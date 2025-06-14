export const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
};

export const applyTheme = (isDarkMode) => {
    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        document.body.classList.toggle('dark-mode', isDarkMode);
    }
}; 