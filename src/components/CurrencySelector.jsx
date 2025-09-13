import React, { useContext, useState } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import styled, { keyframes, css } from "styled-components";
import { FiDollarSign, FiRefreshCw, FiAlertCircle, FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Premium Animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
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

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const ripple = keyframes`
  to { transform: scale(4); opacity: 0; }
`;

// Glassmorphism Styled Components
const SelectorContainer = styled(motion.div)`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    min-width: 280px;
    z-index: 10;
    perspective: 1000px;
`;

const Label = styled(motion.label)`
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textSecondary};
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    will-change: transform;
`;

const SelectWrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    perspective: 1000px;
`;

const Select = styled(motion.select)`
    appearance: none;
    width: 100%;
    padding: 1.125rem 1.5rem 1.125rem 3.5rem;
    font-size: 1.0625rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    background-color: ${({ theme }) => theme.bgPrimary};
    border: 1px solid ${({ theme }) => theme.borderColor};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.shadowSm};
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
    z-index: 2;
    transform-style: preserve-3d;
    backdrop-filter: blur(8px);
    will-change: transform, box-shadow;

    &:hover {
        border-color: ${({ theme }) => theme.primaryHover};
        box-shadow: ${({ theme }) => theme.shadowMd};
        transform: translateY(-2px);
    }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.primary};
        box-shadow: 0 0 0 4px ${({ theme }) => theme.primaryLight};
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none !important;
    }
`;

const CurrencyIcon = styled(motion.span)`
    position: absolute;
    left: 1.5rem;
    color: ${({ theme }) => theme.primary};
    pointer-events: none;
    z-index: 3;
    transform-style: preserve-3d;
    will-change: transform;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
`;

const ChevronIcon = styled(motion.span)`
    position: absolute;
    right: 1.5rem;
    color: ${({ theme }) => theme.textSecondary};
    pointer-events: none;
    z-index: 3;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    will-change: transform;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;

    ${Select}:focus ~ & {
        transform: rotate(180deg);
        color: ${({ theme }) => theme.primary};
    }
`;

const StatusMessage = styled(motion.div)`
    margin-top: 1rem;
    padding: 1rem 1.5rem;
    border-radius: ${({ theme }) => theme.borderRadius};
    font-size: 0.9375rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: ${({ theme }) => theme.bgSecondary};
    box-shadow: ${({ theme }) => theme.shadowSm};
    backdrop-filter: blur(10px);
    border: 1px solid ${({ theme }) => theme.borderColor};
    will-change: transform;

    &.loading {
        color: ${({ theme }) => theme.primary};
        border-color: ${({ theme }) => theme.primaryLight};
    }

    &.error {
        color: ${({ theme }) => theme.error};
        background: ${({ theme }) => theme.errorLight};
        border-color: ${({ theme }) => theme.error};
        animation: ${pulse} 2s infinite;
    }
`;

const LoadingIcon = styled(FiRefreshCw)`
    animation: ${rotate} 1.2s linear infinite;
    will-change: transform;
`;

const ErrorIcon = styled(FiAlertCircle)`
    animation: ${pulse} 1.5s infinite;
    will-change: transform;
`;

const CurrencyOption = styled.option`
    padding: 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: ${({ theme }) => theme.textPrimary};
    background: ${({ theme }) => theme.bgPrimary};

    &:hover {
        background: ${({ theme }) => theme.primaryLight} !important;
    }
`;

const GlowEffect = styled(motion.div)`
    position: absolute;
    inset: 0;
    border-radius: ${({ theme }) => theme.borderRadius};
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(99, 102, 241, 0) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
    z-index: 1;
    will-change: opacity;

    ${Select}:hover ~ & {
        opacity: 1;
    }
`;

const RippleEffect = styled.span`
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ${ripple} 600ms linear;
  pointer-events: none;
`;

// Premium Theme
const lightTheme = {
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: 'rgba(99, 102, 241, 0.15)',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    bgPrimary: 'rgba(255, 255, 255, 0.9)',
    bgSecondary: 'rgba(249, 250, 251, 0.8)',
    borderColor: 'rgba(229, 231, 235, 0.7)',
    borderRadius: '16px',
    shadowSm: '0 4px 12px rgba(0, 0, 0, 0.08)',
    shadowMd: '0 8px 24px rgba(0, 0, 0, 0.12)',
    error: '#ef4444',
    errorLight: 'rgba(254, 226, 226, 0.9)'
};

const darkTheme = {
    primary: '#818cf8',
    primaryHover: '#6366f1',
    primaryLight: 'rgba(129, 140, 248, 0.15)',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    bgPrimary: 'rgba(31, 41, 55, 0.9)',
    bgSecondary: 'rgba(55, 65, 81, 0.8)',
    borderColor: 'rgba(75, 85, 99, 0.7)',
    borderRadius: '16px',
    shadowSm: '0 4px 12px rgba(0, 0, 0, 0.2)',
    shadowMd: '0 8px 24px rgba(0, 0, 0, 0.25)',
    error: '#f87171',
    errorLight: 'rgba(127, 29, 29, 0.9)'
};

const CurrencySelector = () => {
    const { currency, setSelectedCurrency, loading, error } = useContext(CurrencyContext);
    const [isHovered, setIsHovered] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [ripples, setRipples] = useState([]);
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;

    const handleCurrencyChange = (e) => {
        createRipple(e);
        setSelectedCurrency(e.target.value);
    };

    const createRipple = (e) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        setRipples(prev => [
            ...prev,
            { id: Date.now(), x, y, size }
        ]);

        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== ripple.id));
        }, 600);
    };

    return (
        <SelectorContainer
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            theme={theme}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >


            <SelectWrapper>
                <Select
                    id="currency-select"
                    value={currency}
                    onChange={handleCurrencyChange}
                    disabled={loading || error}
                    theme={theme}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                >
                    <CurrencyOption value="AMD" theme={theme}>AMD - Armenian Dram</CurrencyOption>
                    <CurrencyOption value="USD" theme={theme}>USD - US Dollar</CurrencyOption>
                    <CurrencyOption value="EUR" theme={theme}>EUR - Euro</CurrencyOption>
                    <CurrencyOption value="RUB" theme={theme}>RUB - Russian Ruble</CurrencyOption>
                </Select>

                {ripples.map(ripple => (
                    <RippleEffect
                        key={ripple.id}
                        style={{
                            left: `${ripple.x}px`,
                            top: `${ripple.y}px`,
                            width: `${ripple.size}px`,
                            height: `${ripple.size}px`,
                        }}
                    />
                ))}

                <CurrencyIcon
                    theme={theme}
                    animate={isHovered || isFocused ? {
                        y: [0, -4, 0],
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                    } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <FiDollarSign size={20} />
                </CurrencyIcon>

                <ChevronIcon
                    theme={theme}
                    animate={isHovered || isFocused ? { y: [0, -2, 0] } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <FiChevronDown size={20} />
                </ChevronIcon>

                <GlowEffect
                    theme={theme}
                    animate={isHovered || isFocused ? { opacity: 1 } : { opacity: 0 }}
                />
            </SelectWrapper>

            <AnimatePresence>
                {loading && (
                    <StatusMessage
                        className="loading"
                        theme={theme}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <LoadingIcon size={18} />
                        Loading exchange rates...
                    </StatusMessage>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {error && (
                    <StatusMessage
                        className="error"
                        theme={theme}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', damping: 20 }}
                    >
                        <ErrorIcon size={18} />
                        {error}
                    </StatusMessage>
                )}
            </AnimatePresence>
        </SelectorContainer>
    );
};

export default React.memo(CurrencySelector);