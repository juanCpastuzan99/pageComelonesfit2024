import { combineReducers } from 'redux';
import userMetricsReducer from './userMetricsReducer';
import themeReducer from './themeReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  userMetrics: userMetricsReducer,
  theme: themeReducer,
  user: userReducer
});

export default rootReducer; 