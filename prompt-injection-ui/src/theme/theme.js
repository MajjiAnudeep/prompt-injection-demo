import { createTheme } from '@mui/material/styles';

const shared = {
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, padding: '10px 24px' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { fontSize: '0.95rem', minHeight: 56 },
      },
    },
  },
};

export const darkTheme = createTheme({
  ...shared,
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9', light: '#bbdefb', dark: '#42a5f5' },
    secondary: { main: '#ffab40', light: '#ffdd71', dark: '#ff9100' },
    background: { default: '#0a1929', paper: '#1a2d47' },
    error: { main: '#ef5350' },
    success: { main: '#66bb6a' },
    warning: { main: '#ffa726' },
    text: { primary: '#e0e0e0', secondary: '#a0aec0' },
  },
  components: {
    ...shared.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(144, 202, 249, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(144, 202, 249, 0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(144, 202, 249, 0.4)' },
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  ...shared,
  palette: {
    mode: 'light',
    primary: { main: '#1565c0', light: '#42a5f5', dark: '#0d47a1' },
    secondary: { main: '#e65100', light: '#ff9100', dark: '#bf360c' },
    background: { default: '#f5f6fa', paper: '#ffffff' },
    error: { main: '#d32f2f' },
    success: { main: '#2e7d32' },
    warning: { main: '#ed6c02' },
    text: { primary: '#1a1a2e', secondary: '#546e7a' },
  },
  components: {
    ...shared.components,
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.15)' },
            '&:hover fieldset': { borderColor: 'rgba(0, 0, 0, 0.3)' },
          },
        },
      },
    },
  },
});