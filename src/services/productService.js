import api from './api';

const PRODUCTS_PER_PAGE = 12;

const normalizeProductDetails = (product) => {
  if (!product) return null;

  const imageUrls = [
    product.FrontImageFile,
    product.BackImageFile,
    product.RightImageFile,
    product.LeftImageFile
  ].filter(Boolean);

  return {
    ...product,
    id: product.ProductID,
    name: product.ItemName,
    brand: product.BrandName,
    description: product.ProductDescription,
    price: product.YourPrice || product.OfferingSalePrice || product.MaximumRetailPrice,
    image: product.FrontImageFile,
    imageCollection: [...new Set(imageUrls)].map((url, index) => ({ id: `${product.ProductID}-${index}`, url })),
    sizes: product.Size ? String(product.Size).split(',').map((size) => size.trim()) : [],
    availableColors: product.Color ? String(product.Color).split(',').map((color) => color.trim()) : []
  };
};

// Builds a multipart form from a product payload, so the main image,
// the image collection, and plain fields all travel in one request.
// The backend is expected to store the files and respond with their URLs.
const buildProductFormData = (product) => {
  const formData = new FormData();
  const { image, imageCollection, ...fields } = product;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  if (image instanceof File) {
    formData.append('image', image);
  }

  (imageCollection || []).forEach((img, i) => {
    if (img.file instanceof File) {
      formData.append('imageCollection', img.file);
    } else if (img.url) {
      // existing (already-uploaded) image, keep a reference so the
      // backend knows to preserve it instead of treating it as new
      formData.append(`existingImages[${i}]`, JSON.stringify(img));
    }
  });

  return formData;
};

const productService = {
  // GET /products?page=&limit= -> { products, total, nextPage }
  // `page` is null/undefined for the first page, mirroring the old
  // lastRefKey cursor so ProductList.jsx needs no changes.
  getProducts: async (page) => {
    const { data } = await api.get('/products', {
      params: { page: page || 1, limit: PRODUCTS_PER_PAGE }
    });

    return {
      products: data.products,
      lastKey: data.nextPage || null,
      total: data.total
    };
  },

  // GET https://rudra.circlemark.in/ProductServices/api/Products/GetSingleProductDetails -> product
  getSingleProduct: async (id, productCode) => {
    const { data } = await api.get('https://rudra.circlemark.in/ProductServices/api/Products/GetSingleProductDetails', {
      params: { CompId: 1, ProductId: id, ProductCode: productCode }
    });

    let product = Array.isArray(data?.Data) ? data.Data[0] : data?.Data || data;
    const hasUsableImage = product?.FrontImageFile && !product.FrontImageFile.endsWith('/');

    if (product && !hasUsableImage && product.CategoryId) {
      const categoryProducts = await productService.getProductsByCategory(product.CategoryId);
      const categoryProduct = categoryProducts.find((item) => item.ProductID === product.ProductID);

      if (categoryProduct?.FrontImageFile) {
        product = { ...product, FrontImageFile: categoryProduct.FrontImageFile };
      }
    }

    return normalizeProductDetails(product);
  },

  // GET /products/search?q= -> { products }
  searchProducts: async (searchKey) => {
    const { data } = await api.get('/products/search', { params: { q: searchKey } });

    return { products: data.products, lastKey: null, total: data.total };
  },

  // GET /products/featured?limit= -> { products }
  getFeaturedProducts: async (itemsCount = 12) => {
    const { data } = await api.get('/products/featured', { params: { limit: itemsCount } });

    return data.products;
  },

  // GET /products/recommended?limit= -> { products }
  getRecommendedProducts: async (itemsCount = 12) => {
    const { data } = await api.get('/products/recommended', { params: { limit: itemsCount } });

    return data.products;
  },

  // GET /categories -> { categories }
  getCategories: async () => {
    const { data } = await api.get('/categories');

    return data.categories || data || [];
  },

  // GET https://rudra.circlemark.in/ProductServices/api/Home/GetHomePageProductDetails?compid=1&categoryid= -> products
  getProductsByCategory: async (categoryId, itemsCount = 24) => {
    const categoryKey = Number(categoryId);

    if (!Number.isNaN(categoryKey) && categoryKey > 0) {
      const { data } = await api.get('https://rudra.circlemark.in/ProductServices/api/Home/GetHomePageProductDetails', {
        params: { compid: 1, categoryid: categoryKey }
      });

      const items = Array.isArray(data?.Data)
        ? data.Data
        : Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];

      return items.slice(0, itemsCount);
    }

    const { data } = await api.get('/products', {
      params: { category: categoryId, limit: itemsCount }
    });

    return data.products || [];
  },

  // POST /products (multipart) -> created product
  addProduct: async (product) => {
    const formData = buildProductFormData(product);
    const { data } = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return data;
  },

  // PATCH /products/:id (multipart if images changed, JSON otherwise) -> updated product
  editProduct: async (id, updates) => {
    const hasNewFiles = updates.image instanceof File
      || (updates.imageCollection || []).some((img) => img.file instanceof File);

    const { data } = hasNewFiles
      ? await api.patch(`/products/${id}`, buildProductFormData(updates), {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      : await api.patch(`/products/${id}`, updates);

    return data;
  },

  // DELETE /products/:id
  removeProduct: (id) => api.delete(`/products/${id}`),

  getDashboardData: async () => {
    const { data } = await api.get(`/Home/GetHomePageBannerDetails?CompId=1`);

    return data;
  },


};

export default productService;
