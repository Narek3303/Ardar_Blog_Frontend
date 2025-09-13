import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components'; // Removed unused 'css'
import { FaChevronDown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa';
import { RiRefreshLine } from 'react-icons/ri';
import PropTypes from 'prop-types';
/**
 * Modern Animations
 */
const neonGlow = keyframes`
    0%, 100% {
        box-shadow:
                0 0 5px rgba(255, 87, 34, 0.5),
                0 0 10px rgba(255, 87, 34, 0.3);
    }
    50% {
        box-shadow:
                0 0 20px rgba(255, 87, 34, 0.8),
                0 0 30px rgba(255, 87, 34, 0.5);
    }
`;

const float = keyframes`
    0% { transform: translateY(0px) rotate(0.5deg); }
    50% { transform: translateY(-8px) rotate(-0.5deg); }
    100% { transform: translateY(0px) rotate(0.5deg); }
`;

const gradientFlow = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const fadeSlideIn = keyframes`
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
    0% { transform: translateX(-100%) rotate(30deg); }
    100% { transform: translateX(100%) rotate(30deg); }
`;

const pulse = keyframes`
    0% { transform: scale(0.98); opacity: 0.8; }
    50% { transform: scale(1.01); opacity: 1; }
    100% { transform: scale(0.98); opacity: 0.8; }
`;

/**
 * Glassmorphism Container
 */
const Container = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 3rem auto;
    padding: 2.5rem;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 28px;
    box-shadow:
            0 10px 40px rgba(0, 0, 0, 0.08),
            inset 0 0 20px rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    animation: ${fadeSlideIn} 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;

    &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255,215,215,0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: -1;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
        margin: 1.5rem auto;
        border-radius: 20px;
        backdrop-filter: blur(8px);
    }
`;

/**
 * Premium Discount Banner
 */
const DiscountBanner = styled.div`
    background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 50%, #FF7B54 100%);
    background-size: 200% 200%;
    color: white;
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    margin-bottom: 3rem;
    box-shadow:
            0 12px 32px rgba(255, 75, 43, 0.3),
            inset 0 0 15px rgba(255, 255, 255, 0.3);
    animation:
            ${gradientFlow} 6s ease infinite,
            ${pulse} 3s ease infinite;
    position: relative;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    cursor: pointer;
    z-index: 1;

    &:hover {
        transform: translateY(-3px) scale(1.01);
        box-shadow:
                0 15px 40px rgba(255, 75, 43, 0.4),
                inset 0 0 20px rgba(255, 255, 255, 0.4);
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.1) 0%,
                rgba(255, 255, 255, 0.05) 50%,
                rgba(255, 255, 255, 0.1) 100%
        );
        z-index: -1;
    }

    @media (max-width: 768px) {
        padding: 1.5rem;
        margin-bottom: 2rem;
    }
`;

const DiscountContent = styled.div`
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
`;

const DiscountImage = styled.img`
    max-width: 100%;
    height: auto;
    max-height: 220px;
    border-radius: 16px;
    box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.2),
            inset 0 0 0 1px rgba(255, 255, 255, 0.3);
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
    object-fit: contain;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));

    ${DiscountBanner}:hover & {
        transform: scale(1.03) rotate(0.5deg);
    }

    @media (max-width: 768px) {
        max-height: 160px;
    }
`;

const DiscountText = styled.p`
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0;
    text-shadow:
            0 2px 4px rgba(0, 0, 0, 0.3),
            0 0 10px rgba(255, 255, 255, 0.4);
    letter-spacing: 0.5px;
    background: linear-gradient(to right, #ffffff, #f5f5f5);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    display: inline-block;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

/**
 * Categories Container
 */
const CategoriesContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

/**
 * 3D Card Effect for Categories
 */
const CategoryItem = styled.div`
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.5);
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    animation: ${fadeSlideIn} 0.6s ease-out;
    position: relative;
    z-index: 1;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(to right, #FF416C, #FF4B2B);
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    &:hover {
        box-shadow:
                0 12px 32px rgba(0, 0, 0, 0.15),
                inset 0 0 0 1px rgba(255, 255, 255, 0.6);
        transform: translateY(-6px) perspective(1000px) rotateX(2deg);

        &::before {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        border-radius: 16px;
    }
`;

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.75rem 2rem;
    cursor: pointer;
    background: linear-gradient(to right, rgba(249, 249, 249, 0.8), rgba(255, 255, 255, 0.95));
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, rgba(255,75,43,0.1) 0%, rgba(255,115,84,0.05) 100%);
        transform: translateX(-100%);
        transition: transform 0.4s ease;
    }

    &:hover {
        background: linear-gradient(to right, rgba(245, 245, 245, 0.9), rgba(255, 255, 255, 0.97));

        &::after {
            transform: translateX(0);
        }
    }

    @media (max-width: 768px) {
        padding: 1.25rem 1.5rem;
    }
`;

const CategoryTitle = styled.h3`
    font-size: 1.4rem;
    font-weight: 700;
    color: #333;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;

    ${CategoryHeader}:hover & {
        color: #FF4B2B;
        text-shadow: 0 0 8px rgba(255, 75, 43, 0.2);
    }

    @media (max-width: 768px) {
        font-size: 1.2rem;
        gap: 1rem;
    }
`;

const CategoryIcon = styled.img`
    width: 48px;
    height: 48px;
    object-fit: contain;
    border-radius: 12px;
    box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    background: white;
    padding: 6px;

    ${CategoryHeader}:hover & {
        transform: rotate(3deg) scale(1.1);
        box-shadow:
                0 6px 16px rgba(0, 0, 0, 0.15),
                inset 0 0 0 1px rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
        width: 40px;
        height: 40px;
    }
`;

const ArrowIcon = styled.span`
    color: #888;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    position: relative;
    z-index: 2;

    ${CategoryHeader}:hover & {
        color: #FF4B2B;
        transform: scale(1.2);
    }
`;

const SubcategoryList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: ${props => props.$isOpen ? '1000px' : '0'};
    overflow: hidden;
    transition: max-height 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    background: linear-gradient(to bottom, #fafafa, #f5f5f5);
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(to right, transparent, rgba(0,0,0,0.05), transparent);
    }
`;

const SubcategoryItem = styled.li`
    padding: 1.25rem 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    display: flex;
    align-items: center;
    gap: 1.5rem;
    position: relative;
    background: ${props => props.$isEven ? 'rgba(250, 250, 250, 0.7)' : 'rgba(245, 245, 245, 0.7)'};

    &:hover {
        background: rgba(240, 240, 240, 0.9);
        padding-left: 2.5rem;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 5px;
            background: linear-gradient(to bottom, #FF416C, #FF4B2B);
            border-radius: 0 4px 4px 0;
        }
    }

    &:last-child {
        border-bottom-left-radius: 20px;
        border-bottom-right-radius: 20px;
    }

    @media (max-width: 768px) {
        padding: 1rem 1.5rem;
        gap: 1rem;

        &:hover {
            padding-left: 2rem;
        }
    }
`;

const SubcategoryText = styled.p`
    font-size: 1.15rem;
    color: #555;
    margin: 0;
    transition: all 0.3s ease;
    font-weight: 600;
    position: relative;

    ${SubcategoryItem}:hover & {
        color: #333;
        transform: translateX(8px);

        &::after {
            content: '→';
            position: absolute;
            right: -20px;
            opacity: 0;
            transition: all 0.3s ease;
        }
    }

    ${SubcategoryItem}:hover &::after {
        opacity: 1;
        right: -25px;
    }

    @media (max-width: 768px) {
        font-size: 1rem;
    }
`;

/**
 * Loading Skeleton with Shimmer Effect
 */
const LoadingSkeleton = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem;
`;

const SkeletonItem = styled.div`
    height: 70px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    border-radius: 12px;
    animation: ${shimmer} 2s infinite linear;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
`;

/**
 * Error Message with Glass Effect
 */
const ErrorMessage = styled.div`
    padding: 3rem 2rem;
    text-align: center;
    background: rgba(255, 240, 240, 0.9);
    border-radius: 20px;
    color: #d32f2f;
    border: 1px solid rgba(255, 205, 210, 0.5);
    box-shadow:
            0 8px 24px rgba(211, 47, 47, 0.1),
            inset 0 0 20px rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(8px);
    animation: ${pulse} 2s ease infinite;
`;

const ErrorIcon = styled(FaExclamationTriangle)`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: rgba(211, 47, 47, 0.8);
`;

const RetryButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(to right, #d32f2f, #b71c1c);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow:
    0 4px 12px rgba(211, 47, 47, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to bottom right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    animation: ${shimmer} 3s infinite;
  }

  &:hover {
    background: linear-gradient(to right, #b71c1c, #9a0007);
    transform: translateY(-3px);
    box-shadow:
      0 6px 16px rgba(211, 47, 47, 0.4),
      inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RetryIcon = styled(RiRefreshLine)`
  font-size: 1.2rem;
`;

/**
 * CategoryList Component
 */
const CategoryList = ({ onCategorySelect }) => {
    const [categories, setCategories] = useState([]);
    const [discount, setDiscount] = useState(null);
    const [openCategories, setOpenCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/shop/category/');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setCategories(data.data || []);
            setDiscount(data.discount_char_vi || null);

            // Initialize all categories as closed
            const initialOpenState = {};
            (data.data || []).forEach(category => {
                initialOpenState[category.slug] = false;
            });
            setOpenCategories(initialOpenState);
        } catch (err) {
            console.error("Error fetching categories:", err);
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const toggleCategory = (categorySlug) => {
        setOpenCategories(prev => ({
            ...prev,
            [categorySlug]: !prev[categorySlug]
        }));
    };

    const handleSubcategoryClick = (categorySlug, subcategorySlug) => {
        if (onCategorySelect) {
            onCategorySelect({ category: categorySlug, subcategory: subcategorySlug });
        }
    };

    const handleCategoryClick = (categorySlug) => {
        if (onCategorySelect) {
            onCategorySelect({ category: categorySlug, subcategory: '' });
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingSkeleton>
                    {[...Array(5)].map((_, i) => (
                        <SkeletonItem key={i} />
                    ))}
                </LoadingSkeleton>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <ErrorMessage>
                    <ErrorIcon />
                    <h3>Error Loading Categories</h3>
                    <p>{error}</p>
                    <RetryButton onClick={fetchCategories}>
                        <RetryIcon /> Try Again
                    </RetryButton>
                </ErrorMessage>
            </Container>
        );
    }

    return (
        <Container>
            <CategoriesContainer>
                {categories.map((category) => (
                    <CategoryItem key={category.id}>
                        <CategoryHeader
                            onClick={() => {
                                toggleCategory(category.slug);
                                handleCategoryClick(category.slug);
                            }}
                            aria-expanded={openCategories[category.slug]}
                            aria-controls={`subcategory-list-${category.slug}`}
                        >
                            <CategoryTitle>
                                {category.icon && (
                                    <CategoryIcon
                                        src={category.icon}
                                        alt={category.name}
                                        loading="lazy"
                                    />
                                )}
                                {category.name}
                            </CategoryTitle>
                            <ArrowIcon>
                                {openCategories[category.slug] ? <FaChevronUp /> : <FaChevronDown />}
                            </ArrowIcon>
                        </CategoryHeader>

                        <SubcategoryList
                            $isOpen={openCategories[category.slug]}
                            id={`subcategory-list-${category.slug}`}
                        >
                            {category.subcategories?.map((subcategory, index) => (
                                <SubcategoryItem
                                    key={subcategory.id}
                                    onClick={() => handleSubcategoryClick(category.slug, subcategory.slug)}
                                    $isEven={index % 2 === 0}
                                    role="button"
                                    tabIndex="0"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSubcategoryClick(category.slug, subcategory.slug)}
                                >
                                    {subcategory.icon && (
                                        <CategoryIcon
                                            src={subcategory.icon}
                                            alt={subcategory.name}
                                            style={{ width: '32px', height: '32px' }}
                                            loading="lazy"
                                        />
                                    )}
                                    <SubcategoryText>{subcategory.name}</SubcategoryText>
                                </SubcategoryItem>
                            ))}
                        </SubcategoryList>
                    </CategoryItem>
                ))}
            </CategoriesContainer>
        </Container>
    );
};

CategoryList.propTypes = {
    onCategorySelect: PropTypes.func,
};

export default CategoryList;
