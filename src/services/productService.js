import api from './api';

const PRODUCTS_PER_PAGE = 12;

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

  // GET /products/:id -> product
  getSingleProduct: async (id) => {
    const { data } = await api.get(`/products/${id}`);

    return data;
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
