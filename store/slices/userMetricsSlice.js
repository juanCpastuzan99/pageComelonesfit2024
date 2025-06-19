import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userMetricsService } from '../../app/services/userMetricsServices';

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
                stats: null,
                metrics: [],
                loading: false,
                error: null,
                hasData: false
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
            stats: null,
            metrics: [],
            loading: false,
            error: null,
            hasData: false
        };
    }
};

const initialState = loadState();

// Async thunk para fetch metrics
export const fetchUserMetrics = createAsyncThunk(
    'userMetrics/fetchMetrics',
    async (userId, { rejectWithValue }) => {
        try {
            const stats = await userMetricsService.getUserStats(userId);
            const metrics = await userMetricsService.getUserMetrics(userId);
            return { stats, metrics };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk para agregar métricas
export const addUserMetrics = createAsyncThunk(
    'userMetrics/addMetrics',
    async ({ userId, metricsData }, { rejectWithValue }) => {
        try {
            const result = await userMetricsService.addUserMetrics(userId, metricsData);
            return result;
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
                state.stats = action.payload.stats;
                state.metrics = action.payload.metrics;
                state.hasData = action.payload.metrics && action.payload.metrics.length > 0;
                localStorage.setItem('userMetrics', JSON.stringify(state));
            })
            .addCase(fetchUserMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addUserMetrics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserMetrics.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // No actualizamos el estado aquí, se debe recargar las métricas
            })
            .addCase(addUserMetrics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { setUserMetrics, updateUserProfile, calculateIMC } = userMetricsSlice.actions;
export default userMetricsSlice.reducer;

// Selectores para funciones auxiliares
export const selectImcCategory = (imc) => {
    if (imc === 0) return 'Sin datos';
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
};

export const selectImcColor = (imc) => {
    if (imc === 0) return '#6B7280';
    if (imc < 18.5) return '#3B82F6';
    if (imc < 25) return '#10B981';
    if (imc < 30) return '#F59E0B';
    return '#EF4444';
};

export const selectTrendIcon = (trend) => {
    switch (trend) {
        case 'increasing': return '📈';
        case 'decreasing': return '📉';
        default: return '➡️';
    }
};

export const selectTrendText = (trend) => {
    switch (trend) {
        case 'increasing': return 'Tendencia al alza';
        case 'decreasing': return 'Tendencia a la baja';
        default: return 'Estable';
    }
}; 