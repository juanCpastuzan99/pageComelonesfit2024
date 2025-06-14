import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import themeReducer from './slices/themeSlice';
import userMetricsReducer from './slices/userMetricsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
    userMetrics: userMetricsReducer
  },
}); 