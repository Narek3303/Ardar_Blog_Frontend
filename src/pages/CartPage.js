import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import CartItem from "../components/CartItem";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes, css } from 'styled-components';
import { Trash2, ShoppingBag, ArrowRight, Loader, ShoppingCart } from "react-feather";
import AxiosInstance from "../api/axiosInstance";

// Premium Animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

// Glassmorphism Styled Components
const CartContainer = styled.div`
    max-width: 1400px;
    margin: 0 auto;
    padding: 3rem 2rem;
    min-height: 70vh;
    animation: ${fadeIn} 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

    @media (max-width: 768px) {
        padding: 2rem 1rem;
    }
`;

const CartHeader = styled(motion.h1)`
    font-size: 2.5rem;
    font-weight: 800;
    color: ${({ theme }) => theme.darkText};
    margin-bottom: 3rem;
    position: relative;
    display: inline-block;
    letter-spacing: -0.5px;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    will-change: transform;

    &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
        transform-origin: left;
        transform: scaleX(0.7);
        transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    &:hover::after {
        transform: scaleX(1);
    }

    @media (max-width: 768px) {
        font-size: 2rem;
        margin-bottom: 2rem;
    }
`;

const EmptyCart = styled(motion.div)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 5rem 0;
    text-align: center;
`;

const EmptyCartIcon = styled.div`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ theme }) => theme.lightBg};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.lightText};
    animation: ${pulse} 2.5s infinite;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    will-change: transform;

    @media (max-width: 768px) {
        width: 100px;
        height: 100px;
    }
`;

const EmptyCartText = styled.p`
    font-size: 1.5rem;
    color: ${({ theme }) => theme.lightText};
    margin: 0;
    max-width: 500px;
    line-height: 1.6;

    @media (max-width: 768px) {
        font-size: 1.2rem;
        padding: 0 1rem;
    }
`;

const ShopNowButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 1rem;
    background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    will-change: transform;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
    }

    svg {
        transition: transform 0.3s ease;
    }

    &:hover svg {
        transform: translateX(5px);
    }

    @media (max-width: 768px) {
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
    }
`;

const CartItemsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 4rem;

    @media (max-width: 768px) {
        gap: 1.5rem;
        margin-bottom: 3rem;
    }
`;

const CartSummary = styled(motion.div)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2rem 3rem;
    border-radius: 1.5rem;
    background: ${({ theme }) => theme.lightBg};
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    will-change: transform;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1.5rem;
        padding: 1.5rem;
        align-items: stretch;
    }
`;

const TotalPrice = styled.h3`
    font-size: 1.75rem;
    font-weight: 800;
    color: ${({ theme }) => theme.darkText};
    margin: 0;
    will-change: contents;

    span {
        background: linear-gradient(90deg, ${({ theme }) => theme.primary}, ${({ theme }) => theme.primaryDark});
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: ${float} 3s ease-in-out infinite;
    }

    @media (max-width: 768px) {
        font-size: 1.5rem;
        text-align: center;
    }
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 1.5rem;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 1rem;
    }
`;

const ClearCartButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.75rem;
    border: none;
    border-radius: 1rem;
    background: ${({ theme }) => theme.errorLight};
    color: ${({ theme }) => theme.error};
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.15);
    will-change: transform;

    &:hover {
        background: ${({ theme }) => theme.error};
        color: white;
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(239, 68, 68, 0.25);
    }

    @media (max-width: 768px) {
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        justify-content: center;
    }
`;

const CheckoutButton = styled(motion.button)`
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 1rem;
    background: linear-gradient(90deg, ${({ theme }) => theme.primaryDark}, ${({ theme }) => theme.primary});
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
    will-change: transform;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
    }

    svg {
        transition: transform 0.3s ease;
    }

    &:hover svg {
        transform: translateX(5px);
    }

    @media (max-width: 768px) {
        padding: 0.8rem 1.5rem;
        font-size: 1rem;
        justify-content: center;
    }
`;

const LoadingContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    height: 70vh;
`;

const LoadingSpinner = styled.div`
    width: 60px;
    height: 60px;
    border: 5px solid ${({ theme }) => theme.lightBg};
    border-top-color: ${({ theme }) => theme.primary};
    border-radius: 50%;
    animation: spin 1.2s linear infinite;
    will-change: transform;

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
`;

const LoadingText = styled.p`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.lightText};
`;

const DiscountBadge = styled(motion.div)`
  position: absolute;
  top: -10px;
  right: -10px;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  z-index: 2;
  animation: ${float} 3s ease-in-out infinite;
`;

// Theme
const lightTheme = {
    primary: '#3b82f6',
    primaryDark: '#1e40af',
    error: '#ef4444',
    errorLight: '#fee2e2',
    darkText: '#1f2937',
    lightText: '#6b7280',
    lightBg: '#f3f4f6'
};

const darkTheme = {
    primary: '#60a5fa',
    primaryDark: '#93c5fd',
    error: '#f87171',
    errorLight: '#7f1d1d',
    darkText: '#f9fafb',
    lightText: '#9ca3af',
    lightBg: '#374151'
};

const CartPage = () => {
    const { cart, clearCart, fetchCart } = useCart();
    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : lightTheme;
    const [loading, setLoading] = useState(false);
    const [processingCheckout, setProcessingCheckout] = useState(false);
    const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState(null);
    const { currency: selectedCurrency, currency, exchangeRate } = useContext(CurrencyContext);
    const location = useLocation();


    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await AxiosInstance.get('/users/users/profiles/');
                if (response.data && response.data.length > 0) {
                    setUserProfile(response.data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchUserProfile();
    }, []);

    useEffect(() => {
        // երբ pathname–ն փոխվի (navigate('/cart')), նորից ֆետչ ար
        fetchCart();
    }, [fetchCart, location.pathname]);

    const calculateTotalPrice = () => {
        if (!cart || !cart.items) return 0;
        return cart.items.reduce((total, item) => {
            return total + (item.total_price || 0) * exchangeRate;
        }, 0);
    };

    const handleCheckout = async () => {
        if (!userProfile || !userProfile.address || !userProfile.phone_number) {
            alert("Please complete your profile with address and phone number before checkout.");
            navigate('/profile');
            return;
        }

        if (!cart || !cart.items || cart.items.length === 0) {
            alert("Your cart is empty.");
            return;
        }

        try {
            setProcessingCheckout(true);

            const orderData = {
                email: userProfile.user_email || '',
                phone: userProfile.phone_number || '',
                address: userProfile.address || '',
                payment_method: "card",
                currency: cart.items[0]?.currency_code || 'AMD',
                discount: cart.discount || 0,
                tax: cart.tax || 0,
                shipping_cost: cart.shipping_cost || 0,
                notes: cart.notes || "",
                total: calculateTotalPrice(),
                items: cart.items.map(item => ({
                    product: item.product,
                    quantity: item.quantity,
                    size: item.size || null,
                    color: item.color || null,
                })),
            };

            const response = await AxiosInstance.post('/orders/create/', orderData);

            if (response.data?.order_id) {
                clearCart();
                navigate(`/order-detail/${response.data.order_id}`);
            } else {
                alert('Order created but no order ID returned. Please check your orders.');
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert(`Checkout failed: ${error.response?.data?.message || error.message}`);
        } finally {
            setProcessingCheckout(false);
        }
    };



    if (!cart) {
        return (
            <LoadingContainer theme={theme}>
                <LoadingSpinner theme={theme} />
                <LoadingText theme={theme}>Loading your cart...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <CartContainer>
            <CartHeader
                theme={theme}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Your Shopping Cart
            </CartHeader>

            <AnimatePresence mode="wait">
                {!cart.items || cart.items.length === 0 ? (
                    <EmptyCart
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        theme={theme}
                    >
                        <EmptyCartIcon theme={theme}>
                            <ShoppingBag size={48} />
                        </EmptyCartIcon>
                        <EmptyCartText theme={theme}>
                            Your cart is empty. Start your shopping journey now
                        </EmptyCartText>
                        <ShopNowButton
                            as={Link}
                            to="/"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            theme={theme}
                        >
                            Browse Products <ArrowRight size={20} />
                        </ShopNowButton>
                    </EmptyCart>
                ) : (
                    <>
                        <CartItemsWrapper>
                            {cart.items.map((item) => (
                                <CartItem
                                    key={`${item.product}-${item.size || 'no-size'}-${item.color || 'no-color'}`}
                                    item={item}
                                />
                            ))}
                        </CartItemsWrapper>

                        <CartSummary
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            theme={theme}
                        >
                            {cart.discount > 0 && (
                                <DiscountBadge
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5 }}
                                    theme={theme}
                                >
                                    {cart.discount}% OFF
                                </DiscountBadge>
                            )}

                            <TotalPrice theme={theme}>
                                Total: <span>
                  {selectedCurrency.symbol}{calculateTotalPrice().toFixed(2)} {currency}
                </span>
                            </TotalPrice>

                            <ActionButtons>
                                <ClearCartButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={clearCart}
                                    disabled={processingCheckout}
                                    theme={theme}
                                >
                                    <Trash2 size={20} />
                                    Clear Cart
                                </ClearCartButton>

                                <CheckoutButton
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleCheckout}
                                    disabled={processingCheckout}
                                    theme={theme}

                                >
                                    {processingCheckout ? (
                                        <>
                                            <Loader size={20} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Checkout <ArrowRight size={20} />
                                        </>
                                    )}
                                </CheckoutButton>
                            </ActionButtons>
                        </CartSummary>
                    </>
                )}
            </AnimatePresence>
        </CartContainer>
    );
};

export default React.memo(CartPage);