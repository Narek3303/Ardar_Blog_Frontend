import React, { useContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { useCart } from "../context/CartContext";
import { CurrencyContext } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, Heart, Loader } from "react-feather";
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

// Premium Animations
const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
    70% { transform: scale(1.03); box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-4px); }
    100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const ripple = keyframes`
  to { transform: scale(4); opacity: 0; }
`;

// Glassmorphism Styled Components
const CartItemContainer = styled(motion.div)`
    display: grid;
    grid-template-columns: 120px 1fr auto;
    gap: 1.5rem;
    padding: 1.5rem;
    border-radius: 1.25rem;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.05),
            inset 0 0 0 1px rgba(255, 255, 255, 0.6);
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    overflow: hidden;
    will-change: transform, box-shadow;
    animation: ${fadeIn} 0.6s ease-out forwards;

    &:hover {
        transform: translateY(-3px);
        box-shadow:
                0 12px 40px rgba(0, 0, 0, 0.1),
                inset 0 0 0 1px rgba(255, 255, 255, 0.8);
    }

    @media (max-width: 768px) {
        grid-template-columns: 100px 1fr;
        grid-template-rows: auto auto;
    }
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 0.875rem;
    overflow: hidden;
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: transform 0.4s ease;

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to bottom right,
                rgba(255, 255, 255, 0.2),
                rgba(255, 255, 255, 0)
        );
        pointer-events: none;
        z-index: 1;
    }
`;

const ProductImage = styled(motion.img)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
    position: relative;
    z-index: 0;
`;

const ImageOverlay = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.1) 0%,
            rgba(0, 0, 0, 0) 40%
    );
    z-index: 1;
`;

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.25rem 0;
    gap: 1rem;

    @media (max-width: 768px) {
        grid-column: 2;
    }
`;

const ProductTitle = styled(Link)`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.darkText};
    margin: 0;
    line-height: 1.4;
    letter-spacing: -0.01em;
    transition: color 0.3s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-decoration: none;

    &:hover {
        color: ${({ theme }) => theme.primary};
    }
`;

const AttributesContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
`;

const Attribute = styled.div`
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
`;

const AttributeLabel = styled.span`
    color: ${({ theme }) => theme.lightText};
    font-weight: 500;
`;

const AttributeValue = styled(motion.span)`
    color: ${({ theme }) => theme.darkText};
    font-weight: 600;
    padding: 0.25rem 0.625rem;
    border-radius: 6px;
    background: ${({ theme }) => theme.lightBg};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    will-change: transform;
`;

const PricingContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const PriceRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PriceLabel = styled.span`
    font-size: 0.875rem;
    color: ${({ theme }) => theme.lightText};
`;

const PriceValue = styled(motion.span)`
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.primary};
    position: relative;
    display: inline-flex;
    align-items: center;
    will-change: transform;

    &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 100%;
        height: 1px;
        background: currentColor;
        transform-origin: right;
        transform: scaleX(0);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover::after {
        transform-origin: left;
        transform: scaleX(1);
    }
`;

const TotalPriceRow = styled(PriceRow)`
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed ${({ theme }) => theme.border};

    ${PriceValue} {
        font-size: 1.15rem;
        color: ${({ theme }) => theme.primaryDark};
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1.25rem;

    @media (max-width: 768px) {
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
`;

const QuantitySelector = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: ${({ theme }) => theme.lightBg};
    border-radius: 0.75rem;
    padding: 0.375rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const QuantityButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 0.5rem;
    background: white;
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    will-change: transform;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        box-shadow: none;
    }

    &:not(:disabled):hover {
        background: ${({ theme }) => theme.primary};
        color: white;
    }
`;

const QuantityValue = styled(motion.span)`
    min-width: 28px;
    text-align: center;
    font-size: 1rem;
    font-weight: 700;
    color: ${({ theme }) => theme.darkText};
    will-change: contents;
`;

const ActionButtons = styled.div`
    display: flex;
    gap: 0.75rem;
`;

const IconButton = styled(motion.button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
    position: relative;
    overflow: hidden;
`;

const RemoveButton = styled(IconButton)`
  background: ${({ theme }) => theme.errorLight};
  color: ${({ theme }) => theme.error};
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);

  &:hover {
    background: ${({ theme }) => theme.error};
    color: white;
  }
`;

const WishlistButton = styled(IconButton)`
  background: ${({ theme }) => theme.lightBg};
  color: ${({ theme }) => theme.lightText};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:hover {
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primary};
  }

  &.active {
    background: ${({ theme }) => theme.primaryLight};
    color: ${({ theme }) => theme.primary};
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);

    svg {
      fill: ${({ theme }) => theme.primary};
    }
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

const LoadingOverlay = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  backdrop-filter: blur(2px);
`;

// Premium Theme
const lightTheme = {
    primary: '#3b82f6',
    primaryDark: '#1e40af',
    primaryLight: '#dbeafe',
    error: '#ef4444',
    errorLight: '#fee2e2',
    darkText: '#1f2937',
    lightText: '#6b7280',
    lightBg: '#f3f4f6',
    border: 'rgba(0, 0, 0, 0.08)'
};

const darkTheme = {
    primary: '#60a5fa',
    primaryDark: '#93c5fd',
    primaryLight: '#1e3a8a',
    error: '#f87171',
    errorLight: '#7f1d1d',
    darkText: '#f9fafb',
    lightText: '#9ca3af',
    lightBg: '#374151',
    border: 'rgba(255, 255, 255, 0.1)'
};

const BASE_URL = process.env.REACT_APP_BACKEND_URL?.replace(/\/+$/, '') || '';

const CartItem = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCart();
    const { currency: selectedCurrency, currency, exchangeRate } = useContext(CurrencyContext);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isLiked, setIsLiked] = useState(item.liked);
    const [isHovered, setIsHovered] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [ripples, setRipples] = useState([]);

    // Price calculations
    const price = item.price * exchangeRate;
    const totalPrice = item.price * item.quantity * exchangeRate;

    const changeQty = async (newQty) => {
        const qty = Math.max(1, Math.min(99, newQty));
        if (qty !== item.quantity) {
            setIsUpdating(true);
            try {
                await updateQuantity(item.product, item.size ?? null, qty);
            } catch (error) {
                console.error("Error updating quantity:", error);
            } finally {
                setIsUpdating(false);
            }
        }
    };

    const handleRemove = async (e) => {
        createRipple(e);
        setIsRemoving(true);
        try {
            await removeFromCart(item.product, item.size, item.color);
        } catch (error) {
            console.error("Error removing item:", error);
            setIsRemoving(false);
        }
    };

    const toggleWishlist = (e) => {
        createRipple(e);
        setIsLiked(prev => !prev);
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
    };

    const inc = (e) => {
        createRipple(e);
        changeQty(item.quantity + 1);
    };

    const dec = (e) => {
        createRipple(e);
        changeQty(item.quantity - 1);
    };

    const sizeName = () =>
        item.product_detail.size_prices
            ?.find(sp => sp.id === item.size)
            ?.size?.name || '';

    const handleImageError = (e) => {
        e.target.src = '/path/to/default-image.jpg';
    };

    return (
        <AnimatePresence>
            {!isRemoving && (
                <CartItemContainer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                        opacity: 0,
                        x: -50,
                        height: 0,
                        paddingTop: 0,
                        paddingBottom: 0,
                        marginBottom: 0,
                        transition: { duration: 0.3 }
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    layout
                >
                    {isUpdating && (
                        <LoadingOverlay
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Loader size={24} className="animate-spin" />
                        </LoadingOverlay>
                    )}

                    <ImageContainer>
                        <Link to={`/product/${item.product_detail.slug}/${item.product}`}>
                            <ProductImage
                                src={`${BASE_URL}${item.product_image}`}
                                alt={item.product_detail.name}
                                loading="lazy"
                                animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                onError={handleImageError}
                            />
                            <ImageOverlay />
                        </Link>
                    </ImageContainer>

                    <DetailsContainer>
                        <ProductTitle to={`/product/${item.product_detail.slug}/${item.product}`}>
                            {item.product_detail.name}
                        </ProductTitle>

                        <AttributesContainer>
                            {item.color && (
                                <Attribute>
                                    <AttributeLabel>Color:</AttributeLabel>
                                    <AttributeValue
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {item.color}
                                    </AttributeValue>
                                </Attribute>
                            )}
                            {item.size && (
                                <Attribute>
                                    <AttributeLabel>Size:</AttributeLabel>
                                    <AttributeValue
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {sizeName()}
                                    </AttributeValue>
                                </Attribute>
                            )}
                        </AttributesContainer>

                        <PricingContainer>
                            <PriceRow>
                                <PriceLabel>Unit:</PriceLabel>
                                <PriceValue
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {selectedCurrency.symbol}{price.toFixed(2)} {currency}
                                </PriceValue>
                            </PriceRow>
                            <TotalPriceRow>
                                <PriceLabel>Total:</PriceLabel>
                                <PriceValue
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {selectedCurrency.symbol}{totalPrice.toFixed(2)} {currency}
                                </PriceValue>
                            </TotalPriceRow>
                        </PricingContainer>
                    </DetailsContainer>

                    <ControlsContainer>
                        <QuantitySelector>
                            <QuantityButton
                                onClick={dec}
                                disabled={item.quantity <= 1 || isUpdating}
                                aria-label="Decrease quantity"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Minus size={16} />
                            </QuantityButton>
                            <QuantityValue
                                key={`qty-${item.quantity}`}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0.8 }}
                                transition={{ type: 'spring', stiffness: 500 }}
                            >
                                {isUpdating ? '...' : item.quantity}
                            </QuantityValue>
                            <QuantityButton
                                onClick={inc}
                                aria-label="Increase quantity"
                                disabled={isUpdating}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Plus size={16} />
                            </QuantityButton>
                        </QuantitySelector>

                        <ActionButtons>
                            <WishlistButton

                                className={isLiked ? 'active' : ''}
                                aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                {ripples.map(ripple => (
                                    <RippleEffect
                                        key={ripple.id}
                                        style={{
                                            left: ripple.x,
                                            top: ripple.y,
                                            width: ripple.size,
                                            height: ripple.size,
                                        }}
                                    />
                                ))}
                                <Heart
                                    size={18}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                />
                            </WishlistButton>

                            <RemoveButton
                                onClick={handleRemove}
                                aria-label="Remove from cart"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                disabled={isRemoving}
                            >
                                {ripples.map(ripple => (
                                    <RippleEffect
                                        key={ripple.id}
                                        style={{
                                            left: ripple.x,
                                            top: ripple.y,
                                            width: ripple.size,
                                            height: ripple.size,
                                        }}
                                    />
                                ))}
                                <Trash2 size={18} />
                            </RemoveButton>
                        </ActionButtons>
                    </ControlsContainer>
                </CartItemContainer>
            )}
        </AnimatePresence>
    );
};

CartItem.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.number.isRequired,
        product: PropTypes.number.isRequired,
        product_detail: PropTypes.shape({
            name: PropTypes.string,
            slug: PropTypes.string,
            size_prices: PropTypes.arrayOf(
                PropTypes.shape({
                    id: PropTypes.number,
                    price: PropTypes.number,
                    size: PropTypes.shape({
                        name: PropTypes.string
                    })
                })
            ),
            final_price: PropTypes.number,
            price: PropTypes.number
        }).isRequired,
        size: PropTypes.number,
        color: PropTypes.string,
        quantity: PropTypes.number.isRequired,
        product_image: PropTypes.string,
        currency_code: PropTypes.string,
        liked: PropTypes.bool
    }).isRequired,
};

export default React.memo(CartItem);