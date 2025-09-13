import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { Heart, ChevronLeft, ChevronRight, ShoppingCart, Zap, Star, Clock, Shield, Truck } from 'react-feather';
import { useSpring, animated, config } from 'react-spring';
import axiosInstance from '../api/axiosInstance';
import WishlistButton from './WishlistButton';
import AddToCartButton from './AddToCartButton';
import { CurrencyContext } from '../context/CurrencyContext';
import { useGesture } from '@use-gesture/react';
import QuickViewModal from "./QuickView";


// Premium Animations
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
`;





const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
`;

const pulse = keyframes`
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(247, 37, 133, 0.7); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(247, 37, 133, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(247, 37, 133, 0); }
`;

const shimmer = keyframes`
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
`;

const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const wave = keyframes`
    0% { transform: translateX(-100%); }
    60% { transform: translateX(100%); }
    100% { transform: translateX(100%); }
`;

// Premium Styled Components
const ProductCardContainer = styled(animated.div)`
    position: relative;
    width: 100%;
    max-width: 320px;
    margin: 0 auto;
    border-radius: 24px;
    overflow: hidden;
    box-shadow:
            0 8px 16px rgba(0, 0, 0, 0.08),
            0 4px 8px rgba(0, 0, 0, 0.04);
    transition:
            box-shadow 0.6s ease,
            border-color 0.4s ease;
    will-change: box-shadow;
    opacity: 1;
    border: 1px solid rgba(255, 255, 255, 0.3);

    perspective: 1200px;
    transform-style: preserve-3d;
    background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 0%,
            rgba(255, 255, 255, 0) 50%,
            rgba(255, 255, 255, 0.1) 100%
    );
    backdrop-filter: blur(8px);
    z-index: ${({ $zIndex = 1 }) => $zIndex};

    &:hover {
        box-shadow:
                0 24px 48px rgba(0, 0, 0, 0.16),
                0 12px 24px rgba(0, 0, 0, 0.12);
        border-color: rgba(255, 255, 255, 0.6);

        .product-image {
            filter: brightness(1.05) saturate(1.1);
        }

        .quick-view {
            opacity: 1;
            transform: translateZ(20px);
            transition: opacity 0.3s ease;
        }

        .product-badge {
            transition: transform 0.3s ease;
        }
    }

    &:active {
        /* No changes needed here */
    }

    /* Commented out to remove shine */
    /* &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 24px;
        background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0) 60%,
                rgba(255, 255, 255, 0.1) 100%
        );
        opacity: 0;  // Set to 0 to hide
        transition: opacity 0.6s ease, background 0.6s ease;
        pointer-events: none;
        z-index: 1;
    } */

    /* Commented out to remove shine */
    /* &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 24px;
        background: radial-gradient(
                circle at 20% 80%,
                rgba(255, 255, 255, 0.4) 0%,
                transparent 60%
        );
        opacity: 0;
        transition: opacity 0.6s ease;
        pointer-events: none;
        z-index: 2;
    } */

    /* Also disable hover shine */
    /* &:hover::after {
        opacity: 0;  // set to 0 to hide on hover too
    } */

    &:focus-within {
        outline: 3px solid ${({ theme }) => theme.primary + 'aa'};
        outline-offset: 4px;
        box-shadow:
                0 0 0 6px ${({ theme }) => theme.primary + '20'},
                0 24px 48px rgba(0, 0, 0, 0.16);
    }

    @media (max-width: 768px) {
        max-width: 280px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);

        &:hover {
            box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);
        }
    }
`;



const ImageSlider = styled.div`
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; /* Maintain square aspect ratio */
    overflow: hidden;
    border-radius: 24px;
    perspective: 1500px;
    transform-style: preserve-3d;
    background:
            linear-gradient(
                    135deg,
                    rgba(245,245,245,0.8) 0%,
                    rgba(240,240,240,0.6) 100%
            );
    box-shadow:
            inset 0 1px 2px rgba(255,255,255,0.8),
            inset 0 -1px 4px rgba(0,0,0,0.05);
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);

    ${ProductCardContainer}:hover & {
        box-shadow:
                inset 0 2px 4px rgba(255,255,255,0.9),
                inset 0 -2px 8px rgba(0,0,0,0.08);
    }

    @media (max-width: 768px) {
        border-radius: 20px;
    }
`;

const ImageLink = styled(Link)`
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    overflow: hidden;
    border-radius: inherit;

    &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
                to bottom,
                rgba(0,0,0,0) 60%,
                rgba(0,0,0,0.02) 100%
        );
        opacity: 0;
        transition: opacity 0.6s ease;
        z-index: 3;
    }

    ${ProductCardContainer}:hover &::after {
        opacity: 1;
    }
`;

const SkeletonImage = styled.div`
    position: absolute;
    top: 5%;
    left: 5%;
    width: 90%;
    height: 90%;
    background:
            linear-gradient(
                    90deg,
                    rgba(240,240,240,0.9) 25%,
                    rgba(230,230,230,0.9) 50%,
                    rgba(240,240,240,0.9) 75%
            );
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
    border-radius: 16px;
    overflow: hidden;
    box-shadow:
            0 2px 4px rgba(0,0,0,0.05);

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        background:
                linear-gradient(
                        135deg,
                        rgba(255,255,255,0.6) 0%,
                        rgba(255,255,255,0) 60%
                );
        border-radius: inherit;
    }
`;

const ProductImage = styled.img`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
            transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.8s cubic-bezier(0.65, 0, 0.35, 1),
            filter 0.6s ease;
    opacity: ${({ $loaded }) => $loaded ? 1 : 0};
    filter: ${({ $loaded }) => $loaded ? 'none' : 'blur(8px)'};
    transform-origin: center center;
    will-change: transform, opacity;
    z-index: ${({ $loaded }) => $loaded ? 2 : 1};
    border-radius: inherit;

    ${ProductCardContainer}:hover & {
        transform: scale(1.05) rotateZ(0.5deg);
    }

    @supports not (backdrop-filter: blur(10px)) {
        transition:
                transform 1.2s cubic-bezier(0.16, 1, 0.3, 1),
                opacity 0.8s ease !important;
    }
`;

const QuickViewButton = styled.button`
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    padding: 10px 24px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    opacity: 0;
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);

    &:hover {
        background: ${({ theme }) => theme.primary};
        transform: translateX(-50%) translateY(20px) scale(1.05);
    }

    svg {
        width: 16px;
        height: 16px;
    }
`;

const NavButton = styled.button`
    position: absolute;
    top: 50%;
    transform:
            translateY(-50%)
            scale(0.9);
    width: 48px;
    height: 48px;
    background:
            linear-gradient(
                    135deg,
                    rgba(255, 255, 255, 0.95) 0%,
                    rgba(255, 255, 255, 0.98) 100%
            );
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition:
            all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6),
            backdrop-filter 0.4s ease;
    z-index: 20;
    color: ${({ theme }) => theme.darkText};
    box-shadow:
            0 4px 20px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    overflow: hidden;
    will-change: transform, opacity, box-shadow;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
                135deg,
                rgba(255,255,255,0.4) 0%,
                rgba(255,255,255,0) 60%
        );
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    ${ProductCardContainer}:hover & {
        opacity: 1;
        transform: translateY(-50%) scale(1);
    }

    &:hover {
        background:
                linear-gradient(
                        135deg,
                        rgba(255, 255, 255, 1) 0%,
                        rgba(255, 255, 255, 0.98) 100%
                );
        transform: translateY(-50%) scale(1.15);
        box-shadow:
                0 8px 32px rgba(0, 0, 0, 0.2),
                inset 0 2px 4px rgba(255, 255, 255, 0.6);
        color: ${({ theme }) => theme.primary};

        &::before {
            opacity: 1;
        }

        svg {
            transform: translateX(${props => props.direction === 'prev' ? '-2px' : '2px'});
        }
    }

    &:active {
        transform: translateY(-50%) scale(0.95);
        transition: transform 0.1s ease;
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.primary + 'aa'};
        outline-offset: 3px;
        box-shadow:
                0 0 0 4px ${({ theme }) => theme.primary + '20'},
                0 8px 32px rgba(0, 0, 0, 0.2);
    }

    svg {
        width: 24px;
        height: 24px;
        stroke-width: 2.2px;
        transition:
                transform 0.3s ease-out,
                color 0.2s ease;
        will-change: transform;
    }

    @media (max-width: 768px) {
        width: 44px;
        height: 44px;
        opacity: 0.9;
        transform: translateY(-50%) scale(0.95);

        &:hover {
            transform: translateY(-50%) scale(1.05);
        }
    }
`;

const TopLeftWishlistWrapper = styled.div`
    position: absolute;
    top: 12px;
    right: 3px;
    z-index: 5;
    
`;

const PrevButton = styled(NavButton).attrs({ direction: 'prev' })`
    left: 20px;
    padding-right: 2px; /* Optical adjustment for arrow alignment */
`;

const NextButton = styled(NavButton).attrs({ direction: 'next' })`
    right: 20px;
    padding-left: 2px; /* Optical adjustment for arrow alignment */
`;
const DiscountBadge = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 8px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, #ff4d4f, #f72585);
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.5px;
    box-shadow: 0 6px 18px rgba(247, 37, 133, 0.3);
    text-transform: uppercase;
    z-index: 5;

    display: flex;
    align-items: center;
    gap: 6px;

    transform-origin: center;
    transition: transform 0.3s ease;

    animation: ${pulse} 2.5s ease-in-out infinite;

    &:hover {
        transform: scale(1.05);
    }

    
`;

const PremiumBadge = styled.div`
    position: absolute;
    top: 16px;
    left: 16px;
    padding: 8px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, #4361ee, #3a0ca3);
    color: white;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.5px;
    box-shadow: 0 6px 18px rgba(67, 97, 238, 0.3);
    text-transform: uppercase;
    z-index: 5;
    display: flex;
    align-items: center;
    gap: 6px;
    transform-origin: center;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.05);
    }

    &::before {
        content: '⭐';
        font-size: 16px;
    }
`;

const ProductDetails = styled.div`
    padding: 22px;
    display: flex;
    flex-direction: column;
    gap: 2px; /* 👈 ավելի քիչ gap */
    position: relative;
    z-index: 2;
`;

const ProductTitle = styled.h3`
    font-size: 17px;
    font-weight: 700;
    margin: 0;
    color: ${({ theme }) => theme.darkText};
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 48px;
    line-height: 1.5;
    transition: color 0.3s ease;
    letter-spacing: -0.2px;
    text-shadow: 0 1px 2px rgba(0,0,0,0.05);

    ${ProductCardContainer}:hover & {
        color: ${({ theme }) => theme.primary};
    }
`;

const ProductBrand = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.lightText};
    margin: 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
        content: '';
        display: block;
        width: 14px;
        height: 2px;
        background: ${({ theme }) => theme.lightText};
        opacity: 0.6;
    }
`;




const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 2px; /* նախկինում 14px */
`;

const CurrentPrice = styled.span`
    font-size: 22px;
    font-weight: 800;
    color: ${({ theme }) => theme.primary};
    position: relative;
    display: inline-flex;
    align-items: center;
    letter-spacing: -0.5px;

    &::after {
        content: '';
        position: absolute;
        bottom: -3px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, ${({ theme }) => theme.primary}, transparent);
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.5s ease;
    }

    ${ProductCardContainer}:hover &::after {
        transform: scaleX(1);
    }
`;

const OriginalPrice = styled.span`
    font-size: 16px;
    color: ${({ theme }) => theme.lightText};
    text-decoration: line-through;
    opacity: 0.8;
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 2px; /* նախկինում 6px */
`;

const Stars = styled.div`
    display: flex;
    gap: 3px;
`;

const StarIcon = styled(Star)`
    width: 16px;
    height: 16px;
    fill: ${({ filled }) => filled ? '#FFD700' : 'none'};
    stroke: #FFD700;
    stroke-width: 2px;
`;

const RatingText = styled.span`
    font-size: 14px;
    color: ${({ theme }) => theme.lightText};
    font-weight: 500;
`;



const ProductActions = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px; /* 👈 ավելի փոքր բաց */
    padding: 0 22px 16px; /* 👈 ավելի փոքր ներքևի padding */
    position: relative;
    z-index: 2;

    & > * {
        width: 100%;
    }

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ImageCounter = styled.div`
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 5;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  padding: 8px 14px;
  border-radius: 999px;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $active }) => $active ? 'white' : 'rgba(255,255,255,0.4)'};
  transition: all 0.4s ease;
  box-shadow: ${({ $active }) => $active ? '0 0 8px rgba(255,255,255,0.8)' : 'none'};
`;

const Ribbon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 44px;
  height: 44px;
  overflow: hidden;
  z-index: 5;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150%;
    height: 150%;
    background: ${({ theme }) => theme.primary};
    transform: rotate(45deg) translateY(-50%);
    transform-origin: bottom right;
  }
  
  &::after {
    content: '${props => props.text}';
    position: absolute;
    bottom: 8px;
    right: 8px;
    color: white;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    transform: rotate(45deg);
  }
`;


// Premium Theme
const premiumTheme = {
    primary: '#4361ee',
    primaryDark: '#3a56d4',
    accent: '#f72585',
    accentLight: '#ffdeeb',
    accentLightBg: '#fff0f3',
    darkText: '#2b2d42',
    lightText: '#8d99ae',
    cardBg: '#ffffff',
    imageBg: '#f8f9fa',
    imageBgGradient: 'linear-gradient(145deg, #f8f9fa, #e9ecef)',
    border: '#e9ecef',
    cardShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
    cardHoverShadow: '0 24px 60px rgba(0, 0, 0, 0.15)',
    buttonShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
    buttonHoverShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    badgeShadow: '0 6px 18px rgba(247, 37, 133, 0.3)',
    easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)'
};

const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/';

const ProductCard = ({ product, getCurrencySymbol, index = 0, isWishlist = false, onWishlistToggle, onQuickView }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [showDescription, setShowDescription] = useState(false);
    const [liked, setLiked] = useState(false);


    const { currency } = useContext(CurrencyContext);
    const [quickViewImageIndex, setQuickViewImageIndex] = useState(0);

    const openQuickView = (index = 0) => {
        setQuickViewImageIndex(index);
    };

    const handleQuickView = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product, currentImageIndex);
        }
    };

    // Safely get rating with fallback
    const rating = product?.average_rating ? Math.min(5, Math.max(0, Math.round(product.average_rating))) : 0;



    // Safely get prices with fallbacks
    const price = (isWishlist && product?.wishlist_price)
        ? parseFloat(product.wishlist_price)
        : product?.price ? parseFloat(product.price) : 0;

    const finalPrice = (isWishlist && product?.wishlist_final_price)
        ? parseFloat(product.wishlist_final_price)
        : product?.final_price ? parseFloat(product.final_price) : 0;

    // Calculate discount percentage safely
    const discountPercentage = (
        finalPrice != null &&
        price != null &&
        price > 0 &&
        finalPrice > 0 &&
        finalPrice < price
    ) ? Math.round(100 - (finalPrice / price * 100)) : null;


    const isPremium = product?.tags?.includes('premium') || false;
    const isNew = product?.created_at && (new Date() - new Date(product.created_at)) < 30 * 24 * 60 * 60 * 1000;
    const isBestSeller = product?.tags?.includes('bestseller') || false;

    const cardAnimation = useSpring({
        from: { opacity: 0, transform: 'translateY(24px) scale(0.95)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)' },
        delay: index * 75,
        config: { tension: 300, friction: 30 }
    });

    const bindHover = useGesture({
        onHover: ({ hovering }) => setIsHovered(hovering),
    });

    const bindSwipe = useGesture({
        onDrag: ({ direction: [xDir], velocity }) => {
            if (velocity > 0.5) {
                if (xDir > 0) {
                    handlePrevImage();
                } else {
                    handleNextImage();
                }
            }
        }
    });

    const handlePrevImage = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex(prev =>
            prev === 0 ? product?.image?.length - 1 || 0 : prev - 1
        );
    };

    const handleNextImage = (e) => {
        e?.stopPropagation();
        setCurrentImageIndex(prev =>
            prev === (product?.image?.length - 1 || 0) ? 0 : prev + 1
        );
    };


    // Format price safely
    const formatPrice = (value) => {
        return value?.toFixed ? value.toFixed(2) : '0.00';
    };

    // Memoize expensive calculations
    const memoizedPrice = useMemo(() => formatPrice(finalPrice), [finalPrice]);
    const memoizedRating = useMemo(() => rating.toFixed(1), [rating]);

    return (
        <ProductCardContainer
            style={cardAnimation}
            {...bindHover()}
            $delay={index}
            theme={premiumTheme}
        >

            <ImageSlider {...bindSwipe()} role="group" aria-label="Product images carousel">
                {product?.image?.length > 1 && (
                    <>
                        <PrevButton
                            onClick={handlePrevImage}
                            aria-label="Previous image"
                            aria-controls={`product-${product.id}-images`}
                        >
                            <ChevronLeft />
                        </PrevButton>
                        <NextButton
                            onClick={handleNextImage}
                            aria-label="Next image"
                            aria-controls={`product-${product.id}-images`}
                        >
                            <ChevronRight />
                        </NextButton>

                        <ImageCounter>
                            {product.image.map((_, idx) => (
                                <Dot
                                    key={idx}
                                    $active={idx === currentImageIndex}
                                    aria-hidden="true"
                                />
                            ))}
                        </ImageCounter>
                    </>
                )}

                <ImageLink
                    to={`/product/${product?.slug}/${product?.id}`}
                    aria-label={`View ${product?.name} details`}
                >
                    {!imagesLoaded && !imageError && <SkeletonImage />}

                    {product?.image?.[currentImageIndex]?.image && (
                        <ProductImage
                            className="product-image"
                            src={`${BASE_URL}${product.image[currentImageIndex].image}`}
                            alt={product?.name || 'Product image'}
                            loading="lazy"
                            $loaded={imagesLoaded}
                            onLoad={() => setImagesLoaded(true)}
                            onError={() => setImageError(true)}
                        />
                    )}

                    <QuickViewButton
                        className="quick-view"
                        onClick={handleQuickView}
                        aria-label="Quick view"
                    >
                        <Zap size={14} /> Quick View
                    </QuickViewButton>

                    {discountPercentage ? (
                        <DiscountBadge theme={premiumTheme}>
                            {discountPercentage}% OFF
                        </DiscountBadge>
                    ) : null}

                    {isPremium && (
                        <PremiumBadge theme={premiumTheme}>
                            PREMIUM
                        </PremiumBadge>
                    )}

                    {isNew && <Ribbon text="New" theme={premiumTheme} />}
                    {isBestSeller && <Ribbon text="Hot" theme={premiumTheme} />}
                </ImageLink>
                <TopLeftWishlistWrapper>
                    <WishlistButton
                        product={product}
                        onToggle={onWishlistToggle}
                        isHovered={isHovered}
                        theme={premiumTheme}
                    />
                </TopLeftWishlistWrapper>
            </ImageSlider>

            <ProductDetails>
                <Link to={`/product/${product?.slug}/${product?.id}`} tabIndex="-1">
                    <ProductTitle theme={premiumTheme}>{product?.name || 'Product Name'}</ProductTitle>
                </Link>
                <ProductBrand theme={premiumTheme}>{product?.brand?.name || 'Brand'}</ProductBrand>




                <RatingContainer>
                    <Stars>
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < rating} />
                        ))}
                    </Stars>
                    <RatingText theme={premiumTheme}>{memoizedRating}</RatingText>
                </RatingContainer>

                <PriceContainer>
                    {finalPrice && finalPrice > 0 ? (
                        <>
                            <CurrentPrice theme={premiumTheme}>
                                {finalPrice} {product.currency_code}
                            </CurrentPrice>
                            {discountPercentage > 0 && (
                                <OriginalPrice theme={premiumTheme}>
                                    {formatPrice(price)} {product.currency_code}
                                </OriginalPrice>
                            )}
                        </>
                    ) : (
                        <CurrentPrice theme={premiumTheme}>
                            {formatPrice(price)} {product.currency_code}
                        </CurrentPrice>
                    )}
                </PriceContainer>




            </ProductDetails>

            <ProductActions>
                <AddToCartButton
                    product={product}
                    color={null}
                    quantity={1}
                    price={finalPrice}
                    sizePrices={product?.size_prices}
                    isHovered={isHovered}
                    theme={premiumTheme}
                    style={{ width: '100%' }} // 👈 full width այստեղ
                />
            </ProductActions>
        </ProductCardContainer>
    );
};

export default React.memo(ProductCard);
