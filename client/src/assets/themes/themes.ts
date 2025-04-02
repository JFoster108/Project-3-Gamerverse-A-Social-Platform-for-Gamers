// src/assets/themes/themes.ts
// First, update your base theme type to include the missing properties

const baseTheme = {
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    fontSizes: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
        xxlarge: '2rem',
        regular: '1rem', // Added missing property
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        xxl: '3rem',
    }
};

// Light theme
export const lightTheme = {
    ...baseTheme,
    name: 'light',
    colors: {
        primary: '#6200ee',
        secondary: '#03dac6',
        background: '#f5f5f5',
        surface: '#ffffff',
        error: '#b00020',
        text: '#121212',
        textSecondary: '#757575',
        border: '#e0e0e0',
        divider: '#e0e0e0',
        buttonText: '#ffffff',
        navBackground: '#ffffff',
        navText: '#121212',
        cardBackground: '#ffffff',
        cardShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',
        buttonBackground: '#6200ee', // Added missing property
        buttonBackgroundHover: '#7722ff', // Added missing property
        backgroundHover: '#f0f0f0', // Added missing property
    }
};

// Dark theme
export const darkTheme = {
    ...baseTheme,
    name: 'dark',
    colors: {
        primary: '#bb86fc',
        secondary: '#03dac6',
        background: '#121212',
        surface: '#1e1e1e',
        error: '#cf6679',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#2c2c2c',
        divider: '#2c2c2c',
        buttonText: '#121212',
        navBackground: '#1e1e1e',
        navText: '#ffffff',
        cardBackground: '#2c2c2c',
        cardShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',
        buttonBackground: '#bb86fc', // Added missing property
        buttonBackgroundHover: '#c99eff', // Added missing property
        backgroundHover: '#2c2c2c', // Added missing property
    }
};

// Nintendo Switch theme
export const switchTheme = {
    ...baseTheme,
    name: 'switch',
    colors: {
        primary: '#e60012',
        secondary: '#1a95b6',
        background: '#f5f5f5',
        surface: '#ffffff',
        error: '#b00020',
        text: '#121212',
        textSecondary: '#757575',
        border: '#e0e0e0',
        divider: '#e0e0e0',
        buttonText: '#ffffff',
        navBackground: '#e60012',
        navText: '#ffffff',
        cardBackground: '#ffffff',
        cardShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',
        buttonBackground: '#e60012',
        buttonBackgroundHover: '#ff1a2c',
        backgroundHover: '#f0f0f0',
    }
};

// PlayStation theme
export const playstationTheme = {
    ...baseTheme,
    name: 'playstation',
    colors: {
        primary: '#0070d1',
        secondary: '#9880dd',
        background: '#0b0f1b',
        surface: '#1a1b1e',
        error: '#cf6679',
        text: '#ffffff',
        textSecondary: '#b0b0b0',
        border: '#2c2c2c',
        divider: '#2c2c2c',
        buttonText: '#ffffff',
        navBackground: '#0070d1',
        navText: '#ffffff',
        cardBackground: '#1a1b1e',
        cardShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',
        buttonBackground: '#0070d1',
        buttonBackgroundHover: '#0086ff',
        backgroundHover: '#222530',
    }
};

// Xbox theme
export const xboxTheme = {
    ...baseTheme,
    name: 'xbox',
    colors: {
        primary: '#107c10',
        secondary: '#5dc21e',
        background: '#f9f9f9',
        surface: '#ffffff',
        error: '#b00020',
        text: '#121212',
        textSecondary: '#757575',
        border: '#e0e0e0',
        divider: '#e0e0e0',
        buttonText: '#ffffff',
        navBackground: '#107c10',
        navText: '#ffffff',
        cardBackground: '#ffffff',
        cardShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        success: '#4caf50',
        warning: '#ff9800',
        info: '#2196f3',
        buttonBackground: '#107c10',
        buttonBackgroundHover: '#15a215',
        backgroundHover: '#f0f0f0',
    }
};

// Types for themes
export type ThemeType = typeof lightTheme;
export type ThemeNameType = 'light' | 'dark' | 'switch' | 'playstation' | 'xbox';

// Map to get theme by name
export const themeMap: Record<ThemeNameType, ThemeType> = {
    light: lightTheme,
    dark: darkTheme,
    switch: switchTheme,
    playstation: playstationTheme,
    xbox: xboxTheme,
};