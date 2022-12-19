import { configureStore } from '@reduxjs/toolkit';
import uiSliceReducer from './ui-slice';
import cartSliceReducer from './cart-slice';
// Variant with RTK Query
import { cartApi } from './cart-api-slice';

const store = configureStore({
  reducer: {
    ui: uiSliceReducer,
    cart: cartSliceReducer,
    // Add generated reducer as a specific top-level slice
    [cartApi.reducerPath]: cartApi.reducer,
  },
  // Adding api middleware enables caching, invalidation, polling,
  // and other useful features of RTK Query
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(cartApi.middleware);
  },
});

export default store;

// TypeScript specific
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
