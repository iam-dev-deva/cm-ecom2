import api from './api';

const PRODUCTS_PER_PAGE = 12;

const getUsableImageUrls = (product) => [
  product.FrontImageFile,
  product.BackImageFile,
  product.RightImageFile,
  product.LeftImageFile
].filter((url) => url && !url.endsWith('/'));

const normalizeProductDetails = (product) => {
  if (!product) return null;

  const imageUrls = getUsableImageUrls(product);
  const salePrice = Number(product.OfferingSalePrice) > 0
    ? Number(product.OfferingSalePrice)
    : Number(product.YourPrice || product.MaximumRetailPrice || 0);

  return {
    ...product,
    id: product.ProductID,
    productCode: product.ProductCode,
    categoryId: product.CategoryId,
    name: product.ItemName,
    brand: product.BrandName,
    model: product.ModelName,
    description: product.ProductDescription,
    bulletPoint: product.BulletPoint,
    material: product.Material,
    countryOfOrigin: product.CountryOfOrigin,
    price: salePrice,
    salePrice,
    mrp: Number(product.MaximumRetailPrice || 0),
    color: product.Color,
    size: product.Size,
    dimensions: {
      length: product.ItemLength,
      width: product.ItemWidth,
      height: product.ItemHeight,
      unit: product.ItemSizeUnit
    },
    weight: product.ItemWeight,
    weightUnit: product.ItemWeightUnit,
    image: product.FrontImageFile,
    imageCollection: [...new Set(imageUrls)].map((url, index) => ({ id: `${product.ProductID}-${index}`, url })),
    sizes: product.Size ? String(product.Size).split(',').map((size) => size.trim()) : [],
    availableColors: product.Color ? String(product.Color).split(',').map((color) => color.trim()) : []
  };
};

const buildProductFormData = (product) => {
  const formData = new FormData();
  const { image, imageCollection, ...fields } = product;

  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
  });

  if (image instanceof File) formData.append('image', image);

  (imageCollection || []).forEach((img, i) => {
    if (img.file instanceof File) {
      formData.append('imageCollection', img.file);
    } else if (img.url) {
      formData.append(`existingImages[${i}]`, JSON.stringify(img));
    }
  });

  return formData;
};

const productService = {
  getProducts: async (page) => {
    const { data } = await api.get('/products', {
      params: { page: page || 1, limit: PRODUCTS_PER_PAGE }
    });

    return { products: data.products, lastKey: data.nextPage || null, total: data.total };
  },

  getSingleProduct: async (id, productCode) => {
    const { data } = await api.get('https://rudra.circlemark.in/ProductServices/api/Products/GetSingleProductDetails', {
      params: { CompId: 1, ProductId: id, ProductCode: productCode }
    });

    let product = Array.isArray(data?.Data) ? data.Data[0] : data?.Data || data;
    if (product && getUsableImageUrls(product).length === 0 && product.CategoryId) {
      const categoryProducts = await productService.getProductsByCategory(product.CategoryId);
      const categoryProduct = categoryProducts.find((item) => item.ProductID === product.ProductID);

      if (categoryProduct?.FrontImageFile) {
        product = { ...product, FrontImageFile: categoryProduct.FrontImageFile };
      }
    }

    return normalizeProductDetails(product);
  },

  searchProducts: async (searchKey) => {
    const { data } = await api.get('/products/search', { params: { q: searchKey } });
    return { products: data.products, lastKey: null, total: data.total };
  },

  getFeaturedProducts: async (itemsCount = 12) => {
    const { data } = await api.get('/products/featured', { params: { limit: itemsCount } });
    return data.products;
  },

  getRecommendedProducts: async (itemsCount = 12) => {
    const { data } = await api.get('/products/recommended', { params: { limit: itemsCount } });
    return data.products;
  },

  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data.categories || data || [];
  },

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

  addProduct: async (product) => {
    const { data } = await api.post('/products', buildProductFormData(product), {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

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

  removeProduct: (id) => api.delete(`/products/${id}`),

  getDashboardData: async () => {
    const { data } = await api.get('/Home/GetHomePageBannerDetails?CompId=1');
    return data;
  }
};

export default productService;
