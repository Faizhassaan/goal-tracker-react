// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Basic CSS for body/html
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Define a simple MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Blue
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    success: {
      main: '#4caf50', // Green
    },
    error: {
      main: '#f44336', // Red
    },
    info: {
      main: '#03a9f4', // Light Blue
    },
    warning: {
      main: '#ffc107', // Amber
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS and provides a baseline for MUI */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);