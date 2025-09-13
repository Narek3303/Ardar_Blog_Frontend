import React, { useState, useEffect, useContext, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { X, ChevronLeft, ChevronRight, Star, Truck, Clock, Shield, Zap, Check } from 'react-feather';
import { animated, useSpring, config } from 'react-spring';
import { useGesture } from '@use-gesture/react';
import axiosInstance from '../api/axiosInstance';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { CurrencyContext } from '../context/CurrencyContext';
import { motion } from 'framer-motion';
import { useParams, useNavigate, Link } from "react-router-dom";

// ======================
// ANIMATIONS
// ======================
const fadeIn = keyframes`
    from {
        opacity: 0;
        backdrop-filter: blur(0);
    }
    to {
        opacity: 1;
        backdrop-filter: blur(12px);
    }
`;

const slideIn = keyframes`
    from {
        transform: translateY(40px) scale(0.98);
        opacity: 0;
    }
    to {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(67, 97, 238, 0.4);
    }
    70% {
        transform: scale(1.03);
        box-shadow: 0 0 0 12px rgba(67, 97, 238, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(67, 97, 238, 0);
    }
`;

const floatAnimation = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    }
`;

// ======================
// STYLED COMPONENTS
// ======================
const Overlay = styled(animated.div)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(12px);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    animation: ${fadeIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    will-change: opacity, backdrop-filter;
`;

const ModalContainer = styled(animated.div)`
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 90vh;
    max-height: 800px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    display: grid;
    grid-template-columns: 1fr 1fr;
    animation: ${slideIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    will-change: transform;
    opacity: 0; /* Initial state for animation */

    @media (max-width: 1024px) {
        grid-template-columns: 1fr;
        height: 95vh;
        max-height: none;
    }

    @media (max-width: 768px) {
        border-radius: 0;
        height: 100vh;
        max-height: 100vh;
    }
`;

const CloseButton = styled(motion.button)`
    position: absolute;
    top: 24px;
    right: 24px;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 20;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
        background: white;
        transform: rotate(90deg) scale(1.1);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    svg {
        width: 24px;
        height: 24px;
        stroke-width: 3px;
        color: #1f2937;
    }
`;

const GallerySection = styled.div`
    position: relative;
    background: linear-gradient(145deg, #f8f9fa, #e9ecef);
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-right: 1px solid rgba(0, 0, 0, 0.05);

    @media (max-width: 1024px) {
        min-height: 400px;
        border-right: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
`;

const MainImage = styled(motion.img)`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0;
    cursor: zoom-in;
    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    will-change: transform;
    z-index: 5;

    &.zoomed {
        transform: scale(2);
        cursor: zoom-out;
        z-index: 15;
    }
`;


const ThumbnailContainer = styled.div`
    position: absolute;
    bottom: 24px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 0 24px;
    z-index: 10;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

const Thumbnail = styled(motion.div)`
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 8px;
    background: white;
    border: 2px solid ${({ $active }) => $active ? '#4361ee' : 'transparent'};
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    will-change: transform;
    transition: all 0.3s ease;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);

        img {
            transform: scale(1.1);
        }
    }
`;

const NavButton = styled(motion.button)`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.95);
    border: none;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

    &:hover {
        background: white;
        transform: translateY(-50%) scale(1.15);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    svg {
        width: 24px;
        height: 24px;
        stroke-width: 3px;
        color: #1f2937;
    }
`;

const PrevButton = styled(NavButton)`
    left: 24px;
`;

const NextButton = styled(NavButton)`
    right: 24px;
`;

const DetailsSection = styled.div`
    padding: 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    background: white;
    scrollbar-width: thin;
    scrollbar-color: #e5e7eb transparent;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #e5e7eb;
        border-radius: 20px;
    }

    @media (max-width: 768px) {
        padding: 32px 24px;
    }
`;

const ProductHeader = styled.div`
    margin-bottom: 24px;
    position: relative;
`;

const Brand = styled.p`
    font-size: 14px;
    color: #6b7280;
    margin: 0 0 8px 0;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.5px;
`;

const Title = styled.h2`
    font-size: 28px;
    font-weight: 800;
    margin: 0 0 16px 0;
    color: #1f2937;
    line-height: 1.3;
    letter-spacing: -0.5px;
    position: relative;
    display: inline-block;

    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, transparent);
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 0.4s ease;
    }

    &:hover::after {
        transform: scaleX(1);
    }

    @media (max-width: 768px) {
        font-size: 24px;
    }
`;

const RatingContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
`;

const Stars = styled.div`
    display: flex;
    gap: 4px;
`;

const StarIcon = styled(Star)`
    width: 18px;
    height: 18px;
    fill: ${({ filled }) => filled ? '#FFD700' : 'none'};
    stroke: #FFD700;
    stroke-width: 2px;
    transition: transform 0.3s ease;

    &:hover {
        transform: scale(1.2);
    }
`;

const RatingText = styled.span`
    font-size: 14px;
    color: #6b7280;
    font-weight: 600;
`;

const BadgeContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
`;

const Badge = styled(motion.span)`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 20px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
`;

const PremiumBadge = styled(Badge)`
    background: linear-gradient(135deg, #4361ee, #3a0ca3);
`;

const NewBadge = styled(Badge)`
    background: linear-gradient(135deg, #4cc9f0, #4895ef);
`;

const PriceContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    margin: 24px 0;
    flex-wrap: wrap;
`;

const CurrentPrice = styled.span`
    font-size: 32px;
    font-weight: 900;
    color: #3b82f6;
    position: relative;

    &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, #3b82f6, transparent);
        transform-origin: left;
        transform: scaleX(0.8);
        transition: transform 0.4s ease;
    }

    &:hover::after {
        transform: scaleX(1);
    }

    @media (max-width: 768px) {
        font-size: 28px;
    }
`;

const OriginalPrice = styled.span`
    font-size: 20px;
    color: #9ca3af;
    text-decoration: line-through;
    transition: color 0.3s ease;

    &:hover {
        color: #6b7280;
    }

    @media (max-width: 768px) {
        font-size: 18px;
    }
`;

const DiscountBadge = styled(Badge)`
    background: linear-gradient(135deg, #f72585, #b5179e);
    animation: ${pulse} 2s infinite;
`;

const Description = styled.div`
    margin: 24px 0;
    line-height: 1.7;
    color: #4b5563;
    font-size: 16px;

    p {
        margin: 0 0 16px 0;
    }
`;

const ProductMeta = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin: 24px 0;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const MetaItem = styled(motion.div)`
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    color: #1f2937;
    padding: 12px;
    border-radius: 10px;
    background: rgba(219, 234, 254, 0.3);
    transition: all 0.3s ease;
    will-change: transform;

    &:hover {
        background: rgba(219, 234, 254, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    svg {
        width: 20px;
        height: 20px;
        color: #3b82f6;
        stroke-width: 2.5px;
        flex-shrink: 0;
    }
`;


const ToggleDescriptionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  padding: 0;
  text-decoration: underline;
`;


const VariantsContainer = styled.div`
  margin: 24px 0;
`;

const VariantsTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 16px 0;
  color: #1f2937;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, transparent);
    transform-origin: left;
    transform: scaleX(0.5);
    transition: transform 0.4s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const VariantsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const VariantButton = styled(motion.button)`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #4b5563;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  will-change: transform;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }

  &.selected {
    background: #3b82f6;
    color: white;
    border-color: #3b82f6;
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 32px;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

// ======================
// COMPONENT
// ======================
const QuickViewModal = ({ product, isOpen, onClose, initialImageIndex = 0 }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialImageIndex);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isWishlist, setIsWishlist] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const { currency } = useContext(CurrencyContext);
    const modalRef = useRef();
    const [isHovered, setIsHovered] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
    const navigate = useNavigate();

    // Animation for modal
    const animation = useSpring({
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateY(0)' : 'translateY(40px)',
        config: { tension: 300, friction: 30 }
    });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const checkWishlist = async () => {
            try {
                const response = await axiosInstance.get(`/wishlist/${product.id}/`);
                setIsWishlist(response.data?.is_in_wishlist || false);
            } catch {
                setIsWishlist(false); // fallback
            }
        };
        if (product?.id) {
            checkWishlist();
        }
    }, [product?.id]);

    // Handle swipe gestures for image gallery
    const bind = useGesture({
        onDrag: ({ direction: [xDir], velocity, movement: [mx], cancel }) => {
            if (mx < -100 && velocity > 0.3) {
                handleNextImage();
                cancel();
            } else if (mx > 100 && velocity > 0.3) {
                handlePrevImage();
                cancel();
            }
        },
    });

    if (!isOpen || !product) return null;

    // Safely get product data with fallbacks
    const {
        name = 'Product Name',
        brand = { name: 'Brand' },
        description = 'No description available',
        average_rating = 0,
        price = 0,
        final_price = price,
        image = [],
        variants = [],
        tags = []
    } = product;

    const rating = Math.min(5, Math.max(0, Math.round(average_rating)));
    const discountPercentage = (
        final_price != null &&
        price != null &&
        price > 0 &&
        final_price > 0 &&
        final_price < price
    ) ? Math.round(100 - (final_price / price * 100)) : null;

    const isPremium = tags.includes('premium');
    const isNew = product.created_at && (new Date() - new Date(product.created_at)) < 30 * 24 * 60 * 60 * 1000;

    const handlePrevImage = () => {
        setCurrentImageIndex(prev =>
            prev === 0 ? image.length - 1 : prev - 1
        );
        setIsZoomed(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev === image.length - 1 ? 0 : prev + 1
        );
        setIsZoomed(false);
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
        setIsZoomed(false);
    };

    const toggleZoom = () => {
        setIsZoomed(!isZoomed);
    };

    const toggleWishlist = async () => {
        try {
            if (isWishlist) {
                await axiosInstance.delete(`/wishlist/${product.id}/`);
            } else {
                await axiosInstance.post('/wishlist/', { product: product.id });
            }
            setIsWishlist(!isWishlist);
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    const selectVariant = (variant) => {
        setSelectedVariant(variant);
    };

    // Ensure final_price and price are valid numbers
    const validPrice = (price || 0).toFixed(2);
    const validFinalPrice = (final_price || price || 0).toFixed(2);

    return (
        <Overlay
            style={animation}
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <ModalContainer
                style={animation}
                ref={modalRef}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 25 }}
            >
                <CloseButton
                    onClick={onClose}
                    aria-label="Close quick view"
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <X />
                </CloseButton>

                <GallerySection {...bind()}>
                    {image.length > 1 && (
                        <>
                            <PrevButton
                                onClick={handlePrevImage}
                                aria-label="Previous image"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronLeft />
                            </PrevButton>
                            <NextButton
                                onClick={handleNextImage}
                                aria-label="Next image"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronRight />
                            </NextButton>
                        </>
                    )}

                    {image[currentImageIndex]?.image && (
                        <MainImage
                            src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/'}${image[currentImageIndex].image}`}
                            alt={name}
                            className={isZoomed ? 'zoomed' : ''}
                            onClick={toggleZoom}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                    )}

                    {image.length > 1 && (
                        <ThumbnailContainer>
                            {image.map((img, index) => (
                                <Thumbnail
                                    key={index}
                                    $active={index === currentImageIndex}
                                    onClick={() => handleThumbnailClick(index)}
                                    whileHover={{ y: -8 }}
                                    whileTap={{ scale: 0.9 }}
                                    animate={index === currentImageIndex ? {
                                        y: [0, -8, 0],
                                        transition: {
                                            repeat: Infinity,
                                            duration: 2,
                                            ease: "easeInOut"
                                        }
                                    } : {}}
                                >
                                    <img
                                        src={`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/'}${img.thumbnail || img.image}`}
                                        alt={`Thumbnail ${index + 1}`}
                                    />
                                </Thumbnail>
                            ))}
                        </ThumbnailContainer>
                    )}
                </GallerySection>

                <DetailsSection>
                    <ProductHeader>
                        <Brand>{brand.name}</Brand>
                        <Title>{name}</Title>

                        <RatingContainer>
                            <Stars>
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        filled={i < rating}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                    />
                                ))}
                            </Stars>
                            <RatingText>
                                {rating.toFixed(1)} (<Link to={`/products/${product.id}/review/`}>{product.count_reviews || 0} reviews)</Link>
                            </RatingText>
                        </RatingContainer>

                        <BadgeContainer>
                            {isPremium && (
                                <PremiumBadge
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Star size={14} fill="white" /> Premium Product
                                </PremiumBadge>
                            )}
                            {isNew && (
                                <NewBadge
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Zap size={14} /> New Arrival
                                </NewBadge>
                            )}
                        </BadgeContainer>
                    </ProductHeader>

                    <PriceContainer>
                        <CurrentPrice>
                            {validFinalPrice} {product.currency_code}
                        </CurrentPrice>
                        {discountPercentage ? (
                            <DiscountBadge >
                                {discountPercentage}% OFF
                            </DiscountBadge>
                        ) : null}
                    </PriceContainer>

                    <Description>
                        <p>
                            {isDescriptionExpanded ? description : `${description.slice(0, 150)}${description.length > 150 ? '...' : ''}`}
                        </p>
                        {description.length > 150 && (
                            <ToggleDescriptionButton
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {isDescriptionExpanded ? 'Read Less ▲' : 'Read More ▼'}
                            </ToggleDescriptionButton>
                        )}
                    </Description>

                    {variants.length > 0 && (
                        <VariantsContainer>
                            <VariantsTitle>Available Variants:</VariantsTitle>
                            <VariantsGrid>
                                {variants.map((variant, index) => (
                                    <VariantButton
                                        key={index}
                                        onClick={() => selectVariant(variant)}
                                        className={selectedVariant?.id === variant.id ? 'selected' : ''}
                                        whileHover={{ y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {variant.name}
                                        {selectedVariant?.id === variant.id && (
                                            <Check size={14} style={{ marginLeft: '6px' }} />
                                        )}
                                    </VariantButton>
                                ))}
                            </VariantsGrid>
                        </VariantsContainer>
                    )}

                    <ProductMeta>
                        <MetaItem
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Truck /> Free Shipping Worldwide
                        </MetaItem>
                        <MetaItem
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Clock /> Delivery in 2-5 Business Days
                        </MetaItem>
                        <MetaItem
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Shield /> 1-Year Manufacturer Warranty
                        </MetaItem>
                        <MetaItem
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Zap /> 30-Day Money Back Guarantee
                        </MetaItem>
                    </ProductMeta>

                    <ActionsContainer>
                        <WishlistButton
                            product={product}
                            onToggle={toggleWishlist}
                            isActive={isWishlist}
                            variant="ghost"
                            style={{ flex: 1 }}
                        />
                        <AddToCartButton
                            product={product}
                            color={null}

                            quantity={1}
                            price={final_price ?? price}
                            sizePrices={product?.size_prices}
                            isHovered={isHovered}

                            style={{ flex: 1 }}

                        />
                    </ActionsContainer>
                </DetailsSection>
            </ModalContainer>
        </Overlay>
    );
};

export default QuickViewModal;
