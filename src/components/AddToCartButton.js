import React, { useState, useContext, useRef, useCallback, useEffect } from "react";
import PropTypes from 'prop-types';
import axiosInstance from "../api/axiosInstance";
import { toast } from 'react-toastify';
import SizeSelectModal from './SizeSelectModal';
import { CurrencyContext } from "../context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import styled, { keyframes, css } from 'styled-components';
import { Check, ShoppingCart, ArrowRight } from 'react-feather';

// Keyframe animations
const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
    50% { transform: scale(1.02); }
    70% { box-shadow: 0 0 0 12px rgba(76, 175, 80, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
`;

const spin = keyframes`
    to { transform: rotate(360deg); }
`;

const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components
const Container = styled.div`
    position: relative;
    display: inline-flex;
    margin: 1rem 0;
    ${props => props.className && css`${props.className}`}
`;

const Button = styled(motion.button)`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.9rem 2.2rem;
    font-size: 0.95rem;
    font-weight: 600;
    min-width: 160px;
    border: none;
    border-radius: 12px;
    background: ${props => {
        if (props.$variant === 'secondary') return props.theme.secondaryBg;
        if (props.$variant === 'outline') return 'transparent';
        if (props.$variant === 'ghost') return 'transparent';
        return props.theme.primaryBg;
    }};
    color: ${props => {
        if (props.$variant === 'secondary') return props.theme.secondaryText;
        if (props.$variant === 'outline') return props.theme.outlineText;
        if (props.$variant === 'ghost') return props.theme.ghostText;
        return props.theme.primaryText;
    }};
    cursor: pointer;
    text-align: center;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: ${props => props.$variant === 'ghost' ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.1)'};
    overflow: hidden;
    letter-spacing: 0.5px;
    border: ${props => props.$variant === 'outline' ? '2px solid' : 'none'};
    border-color: ${props => props.$variant === 'outline' ? props.theme.outlineBorder : 'transparent'};
    will-change: transform, box-shadow;

    &:hover:not(:disabled) {
        background: ${props => {
            if (props.$variant === 'secondary') return props.theme.secondaryHover;
            if (props.$variant === 'outline') return props.theme.outlineHover;
            if (props.$variant === 'ghost') return props.theme.ghostHover;
            return props.theme.primaryHover;
        }};
        color: ${props => props.$variant === 'outline' ? props.theme.outlineHoverText : 'inherit'};
        transform: translateY(-2px);
        box-shadow: ${props => props.$variant === 'ghost' ? 'none' : '0 8px 20px rgba(0, 0, 0, 0.15)'};
    }

    &:active:not(:disabled) {
        transform: translateY(0);
        box-shadow: ${props => props.$variant === 'ghost' ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.1)'};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
    }

    &:focus-visible {
        outline: 2px solid ${props => props.theme.focus};
        outline-offset: 3px;
    }

    ${props => props.$loading && css`
        background: ${props.theme.disabledBg};
        pointer-events: none;
    `}

    ${props => props.$success && css`
        animation: ${pulse} 1.5s ease;
        background: ${props.theme.successBg} !important;
    `}
`;

const ButtonRipple = styled.span`
    position: absolute;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple 600ms linear;
    pointer-events: none;

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

const Content = styled(motion.span)`
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    position: relative;
    z-index: 2;
    transition: all 0.3s ease;

    ${props => props.$success && css`
    opacity: 0;
    transform: translateY(-20px);
  `}
`;

const IconWrapper = styled.span`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    width: 20px;
    height: 20px;
`;

const Spinner = styled.span`
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    margin-right: 0.6rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: ${props => props.$variant === 'secondary' || props.$variant === 'outline' || props.$variant === 'ghost'
            ? props.theme.secondarySpinner
            : props.theme.primarySpinner};
    border-radius: 50%;
    animation: ${spin} 0.9s linear infinite;
`;

const Checkmark = styled.span`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
    width: 24px;
    height: 24px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;

    ${props => props.$success && css`
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  `}

    svg {
        width: 100%;
        height: 100%;
        animation: ${float} 1.5s ease-in-out infinite;
    }
`;

const PriceBadge = styled(motion.span)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.priceBadgeBg};
  color: ${props => props.theme.priceBadgeText};
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  z-index: 4;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
`;

// Theme configuration
const defaultTheme = {
    primaryBg: '#111',
    primaryHover: '#333',
    primaryText: '#fff',
    secondaryBg: '#f0f0f0',
    secondaryHover: '#e0e0e0',
    secondaryText: '#111',
    outlineText: '#111',
    outlineHover: '#111',
    outlineHoverText: '#fff',
    outlineBorder: '#111',
    ghostText: '#111',
    ghostHover: 'rgba(0, 0, 0, 0.05)',
    disabledBg: '#666',
    successBg: '#4CAF50',
    focus: '#4d90fe',
    primarySpinner: '#fff',
    secondarySpinner: '#111',
    priceBadgeBg: '#FF5722',
    priceBadgeText: '#fff'
};

const darkTheme = {
    primaryBg: '#1c1c1c',
    primaryHover: '#333',
    primaryText: '#fff',
    secondaryBg: '#2a2a2a',
    secondaryHover: '#3a3a3a',
    secondaryText: '#fff',
    outlineText: '#fff',
    outlineHover: '#fff',
    outlineHoverText: '#111',
    outlineBorder: '#fff',
    ghostText: '#fff',
    ghostHover: 'rgba(255, 255, 255, 0.1)',
    disabledBg: '#666',
    successBg: '#388E3C',
    focus: '#4d90fe',
    primarySpinner: '#fff',
    secondarySpinner: '#fff',
    priceBadgeBg: '#E64A19',
    priceBadgeText: '#fff'
};

const AddToCartButton = React.memo(({
                                        product,
                                        color,
                                        quantity = 1,
                                        sizePrices,
                                        onSuccess,
                                        className = '',
                                        disabled = false,
                                        variant = 'primary',
                                        showPriceBadge = true
                                    }) => {
    const [detail, setDetail] = useState(product);
    const [showModal, setShowModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [ripples, setRipples] = useState([]);
    const { currency } = useContext(CurrencyContext);
    const buttonRef = useRef(null);

    // Fetch full product details including in_cart, price, final_price
    const fetchProductDetail = useCallback(async (sizeId) => {
        const { slug, id } = product;
        const config = sizeId ? { params: { size_id: sizeId } } : {};
        const res = await axiosInstance.get(`/shop/product-detail/${slug}/${id}/`, config);
        return res.data.product;
    }, [product]);

    // On mount, load fresh detail
    useEffect(() => {
        (async () => {
            const fresh = await fetchProductDetail();
            setDetail(fresh);
        })();
    }, [fetchProductDetail]);

    const handleSizeSelect = (sizeId, sizePrice) => {
        setSelectedSize({ id: sizeId, price: sizePrice });
        handleAddToCart({ id: sizeId, price: sizePrice });
    };

    const handleAddToCart = async (size = selectedSize) => {
        setIsLoading(true);
        try {
            // ensure we have up-to-date detail with correct query param
            const newDetail = await fetchProductDetail(size?.id);
            const priceToSend = size?.price ?? newDetail.final_price ?? newDetail.price;
            if (!priceToSend) throw new Error('Price not available');

            const payload = {
                product: newDetail.id,
                size: size?.id ?? null,
                color: color ?? null,
                quantity,
                price: priceToSend,
            };

            await axiosInstance.post('/cart/add/', payload);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);

            toast.success(
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    🛍️ Added to cart!
                </motion.div>,
                {
                    icon: false,
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                }
            );

            // refresh detail to update in_cart
            const refreshed = await fetchProductDetail(size?.id);
            setDetail(refreshed);
            onSuccess && onSuccess(refreshed);
        } catch (err) {
            toast.error(err.message || 'Failed to add to cart', {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        } finally {
            setIsLoading(false);
            setShowModal(false);
        }
    };

    const handleButtonClick = (e) => {
        if (detail.in_cart) {
            window.location.href = '/cart';
        } else if (sizePrices?.length > 0) {
            setShowModal(true);
        } else {
            handleAddToCart();
        }

        // Create ripple effect
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const newRipple = {
                x,
                y,
                size: Math.max(rect.width, rect.height),
                id: Date.now()
            };

            setRipples(prev => [...prev, newRipple]);

            // Clean up ripples after animation
            setTimeout(() => {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }, 600);
        }
    };

    const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : defaultTheme;

    const badgePrice = sizePrices?.length
        ? Math.min(...sizePrices.map(s => s.price))
        : detail.final_price ?? detail.price;

    return (
        <Container className={className}>
            <Button
                ref={buttonRef}
                onClick={handleButtonClick}
                disabled={isLoading || disabled}
                $variant={variant}
                $loading={isLoading}
                $success={isSuccess}
                aria-label={detail.in_cart ? 'View Cart' : 'Add to Cart'}
                aria-busy={isLoading}
                whileHover={!isLoading && !disabled ? { y: -2 } : {}}
                whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
                initial={false}
                theme={theme}
            >
                {ripples.map(ripple => (
                    <ButtonRipple
                        key={ripple.id}
                        style={{
                            left: `${ripple.x}px`,
                            top: `${ripple.y}px`,
                            width: `${ripple.size}px`,
                            height: `${ripple.size}px`,
                        }}
                    />
                ))}

                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <Content key="loading">
                            <Spinner $variant={variant} />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Adding...
                            </motion.span>
                        </Content>
                    ) : detail.in_cart ? (
                        <Content key="in-cart">
                            <IconWrapper>
                                <ShoppingCart size={16} />
                            </IconWrapper>
                            <motion.span
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 5 }}
                            >
                                View Cart
                            </motion.span>
                            <IconWrapper>
                                <ArrowRight size={16} />
                            </IconWrapper>
                        </Content>
                    ) : (
                        <Content key="default">
                            <IconWrapper>
                                <motion.span
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 500 }}
                                >
                                    +
                                </motion.span>
                            </IconWrapper>
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Add to Cart
                            </motion.span>
                        </Content>
                    )}
                </AnimatePresence>

                <Checkmark $success={isSuccess}>
                    <Check size={20} />
                </Checkmark>
            </Button>

            {/*{showPriceBadge && badgePrice && (*/}
            {/*    <PriceBadge*/}
            {/*        initial={{ opacity: 0, y: 5 }}*/}
            {/*        animate={{ opacity: 1, y: 0 }}*/}
            {/*        transition={{ delay: 0.2 }}*/}
            {/*        theme={theme}*/}
            {/*    >*/}
            {/*        {currency.symbol}{badgePrice.toFixed(2)}*/}
            {/*    </PriceBadge>*/}
            {/*)}*/}

            <AnimatePresence>
                {showModal && (
                    <SizeSelectModal
                        product={detail}
                        sizePrices={sizePrices}
                        onSizeSelect={handleSizeSelect}
                        onClose={() => setShowModal(false)}
                        currency={currency}
                    />
                )}
            </AnimatePresence>
        </Container>
    );
});

AddToCartButton.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.number.isRequired,
        slug: PropTypes.string.isRequired,
        in_cart: PropTypes.bool,
        final_price: PropTypes.number,
        price: PropTypes.number
    }).isRequired,
    color: PropTypes.string,
    quantity: PropTypes.number,
    sizePrices: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired
    })),
    onSuccess: PropTypes.func,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    showPriceBadge: PropTypes.bool,
};

AddToCartButton.defaultProps = {
    quantity: 1,
    className: '',
    disabled: false,
    variant: 'primary',
    showPriceBadge: true
};

export default AddToCartButton;
