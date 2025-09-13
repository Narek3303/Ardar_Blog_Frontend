import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// Premium Animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
    100% { transform: scale(1); opacity: 1; }
`;

const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
    100% { transform: translateY(0px); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Glassmorphism Styled Components
const CurrencyLoader = styled(motion.div)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    min-height: 300px;
    background: ${({ theme }) => theme.bgGradient || theme.bgPrimary};
    background-size: 300% 300%;
    animation: ${gradientFlow} 8s ease infinite;
    gap: 1.75rem;
    padding: 2rem;
    text-align: center;
`;

const SpinnerContainer = styled.div`
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SpinnerTrack = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid ${({ theme }) => theme.primaryLight};
    border-radius: 50%;
    opacity: 0.3;
`;

const Spinner = styled.div`
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-radius: 50%;
    border-top-color: ${({ theme }) => theme.primary};
    border-right-color: ${({ theme }) => theme.primary};
    animation: ${rotate} 1.2s linear infinite, ${fadeIn} 0.6s ease-out;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

const LoadingText = styled(motion.p)`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    animation: ${float} 3.5s ease-in-out infinite;
    max-width: 300px;
    line-height: 1.5;
    position: relative;

    &::after {
        content: '...';
        position: absolute;
        animation: ${fadeIn} 1.5s infinite steps(4, end);
    }
`;

const ErrorContainer = styled(motion.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: ${({ theme }) => theme.bgGradient || theme.bgPrimary};
    background-size: 300% 300%;
    animation: ${gradientFlow} 8s ease infinite;
    padding: 2rem;
    text-align: center;
    gap: 2rem;
    z-index: 1000;
`;

const ErrorMessage = styled(motion.div)`
    padding: 1.5rem;
    margin: 1rem 0;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    color: ${({ theme }) => theme.error};
    border-radius: 16px;
    box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(255, 255, 255, 0.4);
    animation: ${fadeIn} 0.6s ease-out;
    text-align: center;
    max-width: 500px;
    width: 100%;
    font-size: 1.05rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.875rem;
    line-height: 1.6;
`;

const RetryButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 0.875rem;
  backdrop-filter: blur(4px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 50%
    );
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    
    &::before {
      opacity: 1;
    }
  }
`;

const SuccessMessage = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  color: ${({ theme }) => theme.success};
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  z-index: 100;
  animation: ${fadeIn} 0.6s ease-out;
`;

// Theme
const lightTheme = {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: 'rgba(99, 102, 241, 0.2)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    bgPrimary: '#f8fafc',
    bgGradient: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #e5e7eb 100%)',
    error: '#ef4444',
    errorLight: '#fee2e2',
    success: '#10b981',
    successLight: '#d1fae5'
};

const darkTheme = {
    primary: '#818cf8',
    primaryHover: '#6366f1',
    primaryLight: 'rgba(129, 140, 248, 0.2)',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    bgPrimary: '#0f172a',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    error: '#f87171',
    errorLight: '#7f1d1d',
    success: '#34d399',
    successLight: '#065f46'
};

// Create context
const CurrencyContext = createContext();

const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState("AMD");
    const [exchangeRate, setExchangeRate] = useState(1.0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [theme, setTheme] = useState(lightTheme);

    useEffect(() => {
        // Set initial theme based on system preference
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setTheme(mediaQuery.matches ? darkTheme : lightTheme);

        // Listen for theme changes
        const handler = (e) => setTheme(e.matches ? darkTheme : lightTheme);
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
    }, []);



    const fetchCurrencies = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axios.get("/shop/api/available-currencies/");
            const { currencies } = data;
            const savedCurrency = sessionStorage.getItem("price_currency");

            const selectedCurrency = savedCurrency
                ? currencies.find(c => c.code === savedCurrency) ?? currencies[0]
                : currencies[0];

            setCurrency(selectedCurrency.code);
            setExchangeRate(selectedCurrency.exchange_rate);
        } catch (err) {
            console.error("Error loading currencies:", err);
            setError("Failed to load currency data. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencies();
    }, []);

    const setSelectedCurrency = async (newCurrency) => {
        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.post("/shop/api/set-currency/", {
                price_currency: newCurrency
            });

            sessionStorage.setItem("price_currency", newCurrency);
            setCurrency(newCurrency);
            setExchangeRate(data.exchange_rate);

            // Show success message
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            console.error("Error setting currency:", err);
            setError("Failed to update currency. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const getConversionRate = (currencyCode) => {
        return exchangeRate;
    };

    const handleRetry = () => {
        fetchCurrencies();
    };

    if (loading && !error) {
        return (
            <CurrencyLoader
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                theme={theme}
            >
                <SpinnerContainer>
                    <SpinnerTrack theme={theme} />
                    <Spinner theme={theme} />
                </SpinnerContainer>
                <LoadingText
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    theme={theme}
                >
                    Loading currency rates
                </LoadingText>
            </CurrencyLoader>
        );
    }

    if (error) {
        return (
            <ErrorContainer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                theme={theme}
            >
                <ErrorMessage
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    theme={theme}
                >
                    <FiAlertCircle size={22} />
                    {error}
                </ErrorMessage>
                <RetryButton
                    onClick={handleRetry}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    theme={theme}
                >
                    <FiRefreshCw size={20} />
                    Try Again
                </RetryButton>
            </ErrorContainer>
        );
    }

    return (
        <CurrencyContext.Provider
            value={{
                currency,
                exchangeRate,
                loading,
                error,
                getConversionRate,
                setSelectedCurrency,
            }}
        >
            {children}

            <AnimatePresence>
                {showSuccess && (
                    <SuccessMessage
                        initial={{ opacity: 0, y: 20, x: 20 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 20, x: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        theme={theme}
                    >
                        <FiCheckCircle size={20} />
                        Currency updated successfully!
                    </SuccessMessage>
                )}
            </AnimatePresence>
        </CurrencyContext.Provider>
    );
};

export { CurrencyProvider, CurrencyContext };
