// src/context/CartContext.js
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes } from 'styled-components';
import { CurrencyContext } from "./CurrencyContext";

// Create context for Cart
const CartContext = createContext();

// Custom hook for consuming Cart context
export const useCart = () => useContext(CartContext);

// Styled Components for Toast Notifications
const ToastContainer = styled.div`
    background: linear-gradient(145deg, #ffffff, #f3f4f6);
    border-radius: 12px;
    padding: 16px 24px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(209, 213, 219, 0.5);
    color: #374151;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
    overflow: hidden;
`;

const ToastIcon = styled.div`
    font-size: 20px;
    flex-shrink: 0;
`;

const ToastMessage = styled(motion.div)`
    flex: 1;
`;

const ProgressBar = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: rgba(0, 0, 0, 0.05);
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        background: linear-gradient(90deg, #6366f1, #8b5cf6);
        animation: ${keyframes`
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        `} 5s linear forwards;
    }
`;

// Toast animation variants
const toastAnimation = {
    hidden: { opacity: 0, y: -20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', damping: 15, stiffness: 300 }
    },
    exit: {
        opacity: 0,
        x: 50,
        transition: { ease: 'easeIn', duration: 0.2 }
    },
};

const getToastIcon = (type) => {
    switch(type) {
        case 'success':
            return '🎉';
        case 'error':
            return '⚠️';
        case 'warning':
            return '❗';
        case 'info':
            return 'ℹ️';
        default:
            return '🛒';
    }
};

const CustomToast = ({ type, message }) => (
    <ToastContainer>
        <ToastIcon>{getToastIcon(type)}</ToastIcon>
        <ToastMessage
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={toastAnimation}
        >
            {message}
        </ToastMessage>
        <ProgressBar />
    </ToastContainer>
);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { authToken } = useAuth();


    const showToast = (type, message) => {
        toast(<CustomToast type={type} message={message} />, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    const fetchCart = useCallback(async () => {
        if (!authToken) {
            setCart({ items: [] });
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.get("/cart/items");
            // Ensure cart is stored as object with `items`
            setCart({ items: response.data });
        } catch (error) {
            console.error("Failed to load cart:", error);
            setError(error);
            showToast("error", "Failed to load cart");
        } finally {
            setIsLoading(false);
        }
    }, [authToken]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);


    const addToCart = async (productId, sizeId = null, color = null, quantity = 1) => {
        try {
            const response = await axiosInstance.post("/cart/add/", {
                product_id: productId,
                size_id: sizeId,
                color,
                quantity
            });
            setCart(response.data);

            showToast("success", "Product added to cart");
            return response.data;
        } catch (error) {
            console.error("Add to cart error:", error);
            showToast("error", "Failed to add product to cart");
            throw error;
        }
    };

    const removeFromCart = async (productId, size = null, color = null) => {
        try {
            const response = await axiosInstance.post("/cart/remove/", {
                product_id: productId,
                size,
                color
            });
            setCart(response.data);
            showToast("success", "Product removed from cart");
            return response.data;
        } catch (error) {
            console.error("Remove from cart error:", error);
            showToast("error", "Failed to remove product from cart");
            throw error;
        }
    };

    const updateQuantity = async (productId, sizeId, newQuantity) => {
        if (!productId) {
            console.warn("Missing productId");
            showToast("warning", "Missing required data");
            return;
        }

        const quantity = Math.max(1, Math.min(99, newQuantity));

        try {
            const { data } = await axiosInstance.post("/cart/update-quantity/", {
                product_id: productId,
                size_id: sizeId || null,
                quantity
            });

            setCart(data);
            showToast("success", "Quantity updated successfully");
        } catch (error) {
            console.error("Quantity update error:", error);
            const errorMessage = error.response?.data?.detail ||
                error.response?.data?.message ||
                "Failed to update quantity";
            showToast("error", errorMessage);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            const response = await axiosInstance.post("/cart/clear/");
            setCart(response.data);
            showToast("success", "Cart cleared");
            return response.data;
        } catch (error) {
            console.error("Clear cart error:", error);
            showToast("error", "Failed to clear cart");
            throw error;
        }
    };

    const cartItems = cart?.items || [];

    const cartTotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const price = cartItems.reduce((sum, item) => sum + item.price, 0);

    const cartValue = {
        cart,
        isLoading,
        error,
        price,
        cartTotal,
        itemCount,
        isEmpty: !isLoading && cartItems.length === 0,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
        getItem: (productId, size, color) => {
            return cartItems.find(
                item => item.product === productId &&
                    item.size === (size || null) &&
                    item.color === (color || null)
            );
        },
        getTotal: (convertFn) => {
            return convertFn ? convertFn(cartTotal) : cartTotal;
        },
    };

    return (
        <CartContext.Provider value={cartValue}>
            <AnimatePresence mode="wait">
                {children}
            </AnimatePresence>
        </CartContext.Provider>
    );
};
