import axios from 'axios';
import { userMetricsService } from '@/utils/services/userMetricsService';

// Action Types
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const CALCULATE_IMC = 'CALCULATE_IMC';
export const FETCH_USER_METRICS_REQUEST = 'FETCH_USER_METRICS_REQUEST';
export const FETCH_USER_METRICS_SUCCESS = 'FETCH_USER_METRICS_SUCCESS';
export const FETCH_USER_METRICS_FAILURE = 'FETCH_USER_METRICS_FAILURE';

// Profile Actions
export const updateUserProfile = (profileData) => ({
  type: UPDATE_USER_PROFILE,
  payload: profileData
});

export const calculateIMC = (height, weight) => {
  const heightInMeters = height / 100;
  const imc = (weight / (heightInMeters * heightInMeters)).toFixed(1);
  return {
    type: CALCULATE_IMC,
    payload: { imc }
  };
};

// Metrics Actions
export const fetchUserMetrics = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_METRICS_REQUEST });

  try {
    const metrics = await userMetricsService.fetchUserMetrics();
    dispatch({
      type: FETCH_USER_METRICS_SUCCESS,
      payload: metrics
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_METRICS_FAILURE,
      payload: error.message
    });
  }
};

export const updateUserMetrics = (metricsData) => async (dispatch) => {
  dispatch({ type: FETCH_USER_METRICS_REQUEST });

  try {
    const updatedMetrics = await userMetricsService.updateUserMetrics(metricsData);
    dispatch({
      type: FETCH_USER_METRICS_SUCCESS,
      payload: updatedMetrics
    });
  } catch (error) {
    dispatch({
      type: FETCH_USER_METRICS_FAILURE,
      payload: error.message
    });
  }
}; 