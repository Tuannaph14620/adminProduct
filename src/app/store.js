import { configureStore } from '@reduxjs/toolkit';
import categorySlice from '../features/categorySlice';
import colorSlice from '../features/colorSlice';
import AuthSlice from '../features/AuthSlice';

export const store = configureStore({
  reducer: {
    category: categorySlice,
    color: colorSlice,
    user: AuthSlice,
  },
});
