
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import darkTheme from './theme';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline /> {/* Aplica estilos básicos como fondo oscuro */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);