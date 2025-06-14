// Función para cargar el estado inicial desde localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('userMetrics');
        if (serializedState === null) {
            return {
                imc: 0,
                weight: '',
                height: '',
                weeklyCalories: 0
            };
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return {
            imc: 0,
            weight: '',
            height: '',
            weeklyCalories: 0
        };
    }
};

// Función para guardar el estado en localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('userMetrics', serializedState);
    } catch (err) {
        console.error('Error saving state:', err);
    }
};

const initialState = loadState();

const userMetricsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_METRICS':
            const newState = {
                ...state,
                ...action.payload
            };
            saveState(newState);
            return newState;
        default:
            return state;
    }
};

export default userMetricsReducer; 