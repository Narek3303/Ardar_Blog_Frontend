import React, { useEffect } from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";
import {
    X, Info, Tag, Percent, Award, Users, Layers, Hash,
    ChevronRight, Star, Shield, Truck, CreditCard
} from "react-feather";

// ======================
// DESIGN TOKENS
// ======================
const colors = {
    primary: '#3b82f6',
    primaryLight: '#93c5fd',
    primaryDark: '#1d4ed8',
    secondary: '#f43f5e',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    textDark: '#1f2937',
    textMedium: '#4b5563',
    textLight: '#9ca3af',
    backgroundLight: '#f9fafb',
    backgroundDark: '#111827',
    white: '#ffffff',
    black: '#000000'
};

const shadows = {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.1)',
    large: '0 10px 25px rgba(0, 0, 0, 0.1)',
    xlarge: '0 20px 50px rgba(0, 0, 0, 0.2)'
};

const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
};

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
    backdrop-filter: blur(8px); 
  }
`;

const slideUp = keyframes`
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
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

// ======================
// STYLED COMPONENTS
// ======================
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.4s ease-out forwards;
  will-change: opacity, backdrop-filter;
`;

const ModalContainer = styled.div`
  position: relative;
  background: ${colors.white};
  border-radius: 20px;
  box-shadow: ${shadows.xlarge};
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transform-origin: center bottom;
  will-change: transform, opacity;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 0 20px 20px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  @media (max-width: ${breakpoints.md}) {
    max-width: 95%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: ${shadows.medium};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  will-change: transform;

  &:hover {
    background: ${colors.white};
    transform: rotate(90deg) scale(1.1);
    box-shadow: ${shadows.large};
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 3px;
    color: ${colors.textDark};
  }
`;

const ModalContent = styled.div`
  padding: 50px;

  @media (max-width: ${breakpoints.md}) {
    padding: 30px;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 25px 20px;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 30px;
  padding-right: 40px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary}, transparent);
    border-radius: 2px;
  }
`;

const ModalTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.textDark};
  margin: 0 0 10px 0;
  line-height: 1.3;
  letter-spacing: -0.5px;

  @media (max-width: ${breakpoints.md}) {
    font-size: 24px;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 22px;
  }
`;

const InfoSection = styled.section`
  padding: 25px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 25px;
  align-items: flex-start;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(59, 130, 246, 0.03);
    transform: translateX(5px);
  }

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 20px 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ color }) => color || 'rgba(59, 130, 246, 0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ iconColor }) => iconColor || colors.primary};
  flex-shrink: 0;
  transition: all 0.3s ease;

  ${InfoSection}:hover & {
    transform: scale(1.1);
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const SectionContent = styled.div`
  font-size: 16px;
  color: ${colors.textDark};
  line-height: 1.6;

  p {
    margin: 0 0 10px 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 15px;
  }
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 5px;
`;

const CurrentPrice = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${colors.textDark};
  position: relative;
  display: inline-flex;
  align-items: center;
  font-family: 'Inter', sans-serif;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, ${colors.primary}, transparent);
    transform-origin: left;
    transform: scaleX(0.8);
    transition: transform 0.4s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 24px;
  }
`;

const OriginalPrice = styled.span`
  font-size: 20px;
  color: ${colors.textLight};
  text-decoration: line-through;
  transition: color 0.3s ease;

  &:hover {
    color: ${colors.textMedium};
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 18px;
  }
`;

const DiscountBadge = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${colors.white};
  background: linear-gradient(135deg, ${colors.secondary}, #d11d45);
  padding: 5px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  animation: ${pulse} 2s infinite;
  box-shadow: 0 4px 15px rgba(244, 63, 94, 0.3);

  svg {
    width: 14px;
    height: 14px;
  }
`;

const BenefitsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.05);

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: ${colors.backgroundLight};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${shadows.small};
  }
`;

const BenefitIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const BenefitText = styled.div`
  font-size: 14px;
  color: ${colors.textDark};
  font-weight: 500;
`;

// ======================
// COMPONENT
// ======================
const ProductInfoModal = ({ product, onClose, productName }) => {
    const {
        description,
        final_price,
        article,
        currency_code,
        original_price,
        brand,
        gender,
        composition,
        rating,
        reviews_count
    } = product;

    const hasDiscount = original_price && original_price !== final_price;
    const discountPercentage = hasDiscount
        ? Math.round((1 - final_price / original_price) * 100)
        : 0;

    // Close modal when pressing Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContainer onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose} aria-label="Close product details">
                    <X />
                </CloseButton>

                <ModalContent>
                    <ModalHeader>
                        <ModalTitle>{productName || 'Product Details'}</ModalTitle>
                    </ModalHeader>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(59, 130, 246, 0.1)" iconColor={colors.primary}>
                                <Info />
                            </SectionIcon>
                            <SectionTitle>Description</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
                            <p>{description}</p>
                            {rating && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                                    <div style={{
                                        background: colors.warning,
                                        color: colors.white,
                                        padding: '4px 8px',
                                        borderRadius: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '14px'
                                    }}>
                                        <Star size={14} />
                                        {rating.toFixed(1)}
                                    </div>
                                    <span style={{ color: colors.textLight, fontSize: '14px' }}>
                    ({reviews_count || 0} reviews)
                  </span>
                                </div>
                            )}
                        </SectionContent>
                    </InfoSection>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(16, 185, 129, 0.1)" iconColor={colors.success}>
                                <Tag />
                            </SectionIcon>
                            <SectionTitle>Price</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
                            <PriceContainer>
                                <CurrentPrice>
                                    {final_price} {currency_code}
                                </CurrentPrice>
                                {hasDiscount && (
                                    <OriginalPrice>
                                        {original_price} {currency_code}
                                    </OriginalPrice>
                                )}
                                {hasDiscount && (
                                    <DiscountBadge>
                                        <Percent size={14} /> {discountPercentage}% OFF
                                    </DiscountBadge>
                                )}
                            </PriceContainer>
                            <p style={{ color: colors.textMedium, fontSize: '14px', marginTop: '5px' }}>
                                Price includes all taxes. Free shipping available.
                            </p>
                        </SectionContent>
                    </InfoSection>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(244, 63, 94, 0.1)" iconColor={colors.secondary}>
                                <Award />
                            </SectionIcon>
                            <SectionTitle>Brand</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 12px',
                                background: 'rgba(244, 63, 94, 0.05)',
                                borderRadius: '8px',
                                border: `1px solid rgba(244, 63, 94, 0.1)`
                            }}>
                                <span style={{ fontWeight: '600' }}>{brand?.name || 'N/A'}</span>
                                <ChevronRight size={16} color={colors.textLight} />
                            </div>
                        </SectionContent>
                    </InfoSection>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(168, 85, 247, 0.1)" iconColor="#a855f7">
                                <Users />
                            </SectionIcon>
                            <SectionTitle>Gender</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
              <span style={{
                  textTransform: 'capitalize',
                  padding: '4px 12px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '20px',
                  fontWeight: '500'
              }}>
                {gender || 'Unisex'}
              </span>
                        </SectionContent>
                    </InfoSection>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(245, 158, 11, 0.1)" iconColor={colors.warning}>
                                <Layers />
                            </SectionIcon>
                            <SectionTitle>Composition</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
                            {composition ? (
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: '20px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '8px'
                                }}>
                                    {composition.split(',').map((item, index) => (
                                        <li key={index} style={{ position: 'relative' }}>
                      <span style={{
                          position: 'absolute',
                          left: '-15px',
                          color: colors.warning
                      }}>•</span>
                                            {item.trim()}
                                        </li>
                                    ))}
                                </ul>
                            ) : 'Not specified'}
                        </SectionContent>
                    </InfoSection>

                    <InfoSection>
                        <SectionHeader>
                            <SectionIcon color="rgba(107, 114, 128, 0.1)" iconColor={colors.textMedium}>
                                <Hash />
                            </SectionIcon>
                            <SectionTitle>Article</SectionTitle>
                        </SectionHeader>
                        <SectionContent>
              <span style={{
                  fontFamily: 'monospace',
                  background: colors.backgroundLight,
                  padding: '4px 8px',
                  borderRadius: '4px'
              }}>
                {article || 'Not specified'}
              </span>
                        </SectionContent>
                    </InfoSection>

                    <BenefitsContainer>
                        <BenefitItem>
                            <BenefitIcon>
                                <Truck />
                            </BenefitIcon>
                            <BenefitText>Free shipping on orders over $50</BenefitText>
                        </BenefitItem>
                        <BenefitItem>
                            <BenefitIcon>
                                <Shield />
                            </BenefitIcon>
                            <BenefitText>2-year warranty included</BenefitText>
                        </BenefitItem>
                        <BenefitItem>
                            <BenefitIcon>
                                <CreditCard />
                            </BenefitIcon>
                            <BenefitText>Secure payment options</BenefitText>
                        </BenefitItem>
                        <BenefitItem>
                            <BenefitIcon>
                                <Star />
                            </BenefitIcon>
                            <BenefitText>1000+ 5-star reviews</BenefitText>
                        </BenefitItem>
                    </BenefitsContainer>
                </ModalContent>
            </ModalContainer>
        </ModalOverlay>
    );
};

ProductInfoModal.propTypes = {
    product: PropTypes.shape({
        description: PropTypes.string.isRequired,
        final_price: PropTypes.number.isRequired,
        currency_code: PropTypes.string.isRequired,
        original_price: PropTypes.number,
        brand: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        gender: PropTypes.string,
        composition: PropTypes.string,
        article: PropTypes.string,
        rating: PropTypes.number,
        reviews_count: PropTypes.number
    }).isRequired,
    onClose: PropTypes.func.isRequired,
    productName: PropTypes.string
};

export default ProductInfoModal;