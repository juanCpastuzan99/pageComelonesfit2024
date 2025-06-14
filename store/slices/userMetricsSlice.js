import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userMetricsService } from '../../utils/services/userMetricsService';

// Función para cargar el estado inicial desde localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('userMetrics');
        if (serializedState === null) {
            return {
                profile: {
                    height: '',
                    weight: '',
                    age: '',
                    gender: '',
                    activityLevel: '',
                    goal: ''
                },
                imc: 0,
                weeklyCalories: 0,
                loading: false,
                error: null
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            profile: {
                height: '',
                weight: '',
                age: '',
                gender: '',
                activityLevel: '',
                goal: ''
            },
            imc: 0,
            weeklyCalories: 0,
            loading: false,
            error: null
        };
    }
};

const initialState = loadState();

// Async thunk para fetch metrics
export const fetchUserMetrics = createAsyncThunk(
    'userMetrics/fetchMetrics',
    async (_, { rejectWithValue }) => {
        try {
            const metrics = await userMetricsService.fetchUserMetrics();
            return metrics;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userMetricsSlice = createSlice({
    name: 'userMetrics',
    initialState,
    reducers: {
        updateUserProfile: (state, action) => {
            state.profile = {
                ...state.profile,
                ...action.payload
            };
            localStorage.setItem('userMetrics', JSON.stringify(state));
        },
        calculateIMC: (state, action) => {
            const { height, weight } = action.payload;
            if (height && weight) {
                const heightInMeters = height / 100;
                state.imc = (weight / (heightInMeters * heightInMeters)).toFixed(2);
                localStorage.setItem('userMetrics', JSON.stringify(state));
            }
        },
        setUserMetrics: (state, action) => {
            const newState = {
                ...state,
                ...action.payload
            };
            localStorage.setItem('userMetrics', JSON.stringify(newState));
            return newState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newState = {
                    ...state,
                    ...action.payload
                };
                localStorage.setItem('userMetrics', JSON.stringify(newState));
                return newState;
            })
            .addCase(fetchUserMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setUserMetrics, updateUserProfile, calculateIMC } = userMetricsSlice.actions;
export default userMetricsSlice.reducer; 