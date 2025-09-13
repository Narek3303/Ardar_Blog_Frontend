// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Material UI-ի թեմայի կարգավորում
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


// Հիմնական թեմայի ստեղծում
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Հիմնական գույն
        },
        secondary: {
            main: '#dc004e', // Երկրորդական գույն
        },
        background: {
            default: '#f5f5f5', // Հիմնական ֆոն
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>

            <ThemeProvider theme={theme}>
                <CssBaseline />
                <App />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);

// Եթե ցանկանում եք չափել կատարումը
reportWebVitals();
