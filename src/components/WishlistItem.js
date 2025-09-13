import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import styled from "styled-components";
import { Heart, Eye, Loader } from "react-feather";

// ======================
// Styled Components
// ======================
const WishlistItemCard = styled(motion.article)`
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  will-change: transform, box-shadow;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.12);
    
    .product-image {
      transform: scale(1.05);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1/1;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
  mix-blend-mode: multiply;
  filter: brightness(0.98) contrast(1.05);
  will-change: transform;
`;

const QuickViewButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 2;
  
  &:hover {
    background: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5px;
    color: #2b2d42;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
`;

const LoadingSpinner = styled(motion.div)`
  width: 32px;
  height: 32px;
  border: 3px solid white;
  border-top-color: transparent;
  border-radius: 50%;
`;

const ProductInfo = styled.div`
  padding: 16px;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const ProductTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2b2d42;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const ProductBrand = styled.span`
  font-size: 14px;
  color: #8d99ae;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const ProductPrice = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #4361ee;
`;

const WishlistButton = styled(motion.button)`
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  color: ${({ $isLiked }) => $isLiked ? '#f72585' : '#adb5bd'};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ $isLiked }) => $isLiked ? '#f72585' : '#8d99ae'};
    background: ${({ $isLiked }) => $isLiked ? 'rgba(247, 37, 133, 0.1)' : 'rgba(173, 181, 189, 0.1)'};
  }
  
  svg {
    width: 24px;
    height: 24px;
    stroke-width: ${({ $isLiked }) => $isLiked ? '2.5' : '2'};
    fill: ${({ $isLiked }) => $isLiked ? '#f72585' : 'none'};
  }
`;

// ======================
// Component
// ======================
const WishlistItem = ({ product }) => {
    const { toggleWishlist } = useWishlist();
    const [isProcessing, setIsProcessing] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleToggleWishlist = async () => {
        if (isProcessing) return;

        setIsProcessing(true);
        try {
            await toggleWishlist(product.id);
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const fallbackImage = "/default-image.jpg";

    return (
        <WishlistItemCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            layout
        >
            {/* Loading Overlay */}
            {isProcessing && (
                <LoadingOverlay>
                    <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    />
                </LoadingOverlay>
            )}

            {/* Product Image */}
            <ImageContainer>
                <ProductImage
                    src={imageError ? fallbackImage : product.image[0]?.image || fallbackImage}
                    alt={product.name}
                    className="product-image"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />

                <QuickViewButton aria-label="Quick view">
                    <Eye />
                </QuickViewButton>
            </ImageContainer>

            {/* Product Info */}
            <ProductInfo>
                <ProductHeader>
                    <ProductTitle>{product.name}</ProductTitle>
                    <ProductBrand>
                        {product.brand?.name || "Unknown Brand"}
                    </ProductBrand>
                </ProductHeader>

                <ProductFooter>
                    <ProductPrice>
                        ${product.final_price.toFixed(2)}
                    </ProductPrice>

                    <WishlistButton
                        onClick={handleToggleWishlist}
                        $isLiked={product.liked}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        disabled={isProcessing}
                        aria-label={product.liked ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <AnimatePresence mode="wait">
                            {product.liked ? (
                                <motion.div
                                    key="heart-filled"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Heart fill="#f72585" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="heart-outline"
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.8 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Heart />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </WishlistButton>
                </ProductFooter>
            </ProductInfo>
        </WishlistItemCard>
    );
};

export default WishlistItem;
