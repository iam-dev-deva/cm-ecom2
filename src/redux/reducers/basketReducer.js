import {
  ADD_QTY_ITEM, ADD_TO_BASKET,
  CLEAR_BASKET,
  MINUS_QTY_ITEM, REMOVE_FROM_BASKET,
  SET_BASKET_ITEMS
} from '@/constants/constants';

const normalizeBasketProduct = (product) => ({
  ...product,
  id: product.id || product.ProductID,
  name: product.name || product.ItemName,
  brand: product.brand || product.BrandName,
  price: Number(product.price ?? product.Rate ?? product.YourPrice ?? product.OfferRate ?? 0),
  image: product.image || product.FrontImageFile,
  quantity: Number(product.quantity) || 1,
  availableColors: product.availableColors
    || (product.Color ? String(product.Color).split(',').map((color) => color.trim()) : []),
  sizes: product.sizes
    || (product.Size ? String(product.Size).split(',').map((size) => size.trim()) : [])
});

export default (state = [], action) => {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return Array.isArray(action.payload?.basket)
        ? action.payload.basket.map(normalizeBasketProduct)
        : state;
    case SET_BASKET_ITEMS:
      return (action.payload || []).map(normalizeBasketProduct);
    case ADD_TO_BASKET:
      return state.some((product) => product.id === action.payload.id)
        ? state
        : [normalizeBasketProduct(action.payload), ...state];
    case REMOVE_FROM_BASKET:
      return state.filter((product) => product.id !== action.payload);
    case CLEAR_BASKET:
      return [];
    case ADD_QTY_ITEM:
      return state.map((product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity + 1
          };
        }
        return product;
      });
    case MINUS_QTY_ITEM:
      return state.map((product) => {
        if (product.id === action.payload) {
          return {
            ...product,
            quantity: product.quantity - 1
          };
        }
        return product;
      });
    default:
      return state;
  }
};
