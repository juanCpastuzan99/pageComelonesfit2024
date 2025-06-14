import { createSlice } from '@reduxjs/toolkit';
import { getInitialTheme, applyTheme } from '../../utils/themeUtils';

const initialState = {
    isDarkMode: getInitialTheme()
};

// Apply initial theme
if (typeof window !== 'undefined') {
    applyTheme(initialState.isDarkMode);
}

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
            applyTheme(state.isDarkMode);
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        },
        setTheme: (state, action) => {
            state.isDarkMode = action.payload;
            applyTheme(state.isDarkMode);
            localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
        }
    }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;


