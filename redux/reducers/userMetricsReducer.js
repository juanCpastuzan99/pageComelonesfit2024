import {
  UPDATE_USER_PROFILE,
  CALCULATE_IMC,
  FETCH_USER_METRICS_REQUEST,
  FETCH_USER_METRICS_SUCCESS,
  FETCH_USER_METRICS_FAILURE
} from '../actions/userMetricsActions';

const initialState = {
  profile: {
    height: "",
    weight: "",
    age: "",
    gender: "",
    activityLevel: "",
    goal: ""
  },
  imc: 0,
  weeklyCalories: 0,
  averageHeight: 0,
  averageWeight: 0,
  loading: false,
  error: null
};

const userMetricsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_PROFILE:
      return {
        ...state,
        profile: {
          ...state.profile,
          ...action.payload
        }
      };
    case CALCULATE_IMC:
      return {
        ...state,
        imc: action.payload.imc
      };
    case FETCH_USER_METRICS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case FETCH_USER_METRICS_SUCCESS:
      return {
        ...state,
        loading: false,
        ...action.payload
      };
    case FETCH_USER_METRICS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default userMetricsReducer; 