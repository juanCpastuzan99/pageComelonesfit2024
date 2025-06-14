import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer';
import userMetricsReducer from './reducers/userMetricsReducer';

const store = configureStore({
  reducer: {
    user: userReducer,
    userMetrics: userMetricsReducer
  }
});

export default store; 