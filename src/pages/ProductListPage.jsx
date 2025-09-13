import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { FilterList, Close, Menu, Search, FavoriteBorder, Favorite } from '@mui/icons-material';
import styled, { keyframes, css } from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import SearchBox from '../components/SearchBox';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import SkeletonProductCard from '../components/SkeletonProductCard';
import SliderList from '../components/SliderList';
import CategoryList from '../components/CategoryList';
import QuickViewModal from '../components/QuickView';
import debounce from 'lodash/debounce';

// Constants
const SCROLL_THRESHOLD = 200;
const DEBOUNCE_MS = 150;
const INITIAL_FILTERS = {};
const INITIAL_META = { count: 0, total_pages: 0 };
const SCROLL_LOAD_THRESHOLD = 500;
const DEBOUNCE_DELAY = 500;
const SKELETON_ITEMS = 12;

// ======================
// GLOBAL STYLES
// ======================
const GlobalStyles = createGlobalStyle`
    :root {
        /* Enhanced Color Palette */
        --primary: #6366F1;
        --primary-dark: #4F46E5;
        --primary-light: #C7D2FE;
        --primary-ultralight: #EEF2FF;
        --secondary: #10B981;
        --secondary-dark: #059669;
        --accent: #F59E0B;
        --accent-dark: #D97706;
        --dark: #1F2937;
        --dark-80: rgba(31, 41, 55, 0.8);
        --dark-60: rgba(31, 41, 55, 0.6);
        --light: #F9FAFB;
        --light-80: rgba(249, 250, 251, 0.8);
        --gray: #E5E7EB;
        --gray-dark: #9CA3AF;
        --white: #FFFFFF;
        --error: #EF4444;
        --success: #10B981;
        --warning: #F59E0B;

        /* Spacing */
        --space-xxs: 0.25rem;
        --space-xs: 0.5rem;
        --space-sm: 0.75rem;
        --space-md: 1rem;
        --space-lg: 1.5rem;
        --space-xl: 2rem;
        --space-xxl: 3rem;
        --space-3xl: 4rem;

        /* Shadows */
        --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
        --shadow-primary: 0 4px 14px 0 rgba(99, 102, 241, 0.3);
        --shadow-neon: 0 0 10px rgba(99, 102, 241, 0.5), 0 0 20px rgba(99, 102, 241, 0.3);

        /* Border Radius */
        --radius-sm: 0.25rem;
        --radius-md: 0.5rem;
        --radius-lg: 0.75rem;
        --radius-xl: 1rem;
        --radius-2xl: 1.5rem;
        --radius-full: 9999px;

        /* Transitions */
        --transition-default: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        --transition-fast: all 0.1s ease;
        --transition-slow: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        --transition-transform: transform 0.25s cubic-bezier(0.33, 1, 0.68, 1);
        --transition-bounce: all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6);

        /* Layout */
        --header-height: 5rem;
        --max-width: 96rem;
        --sidebar-width: 24rem;
        --z-index-low: 10;
        --z-index-medium: 50;
        --z-index-high: 100;
        --z-index-highest: 1000;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
        scroll-behavior: smooth;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
        background-color: var(--light);
        color: var(--dark);
        line-height: 1.6;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        overflow-x: hidden;
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }
    }
`;

// ======================
// ANIMATIONS
// ======================
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(1rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const slideInFromLeft = keyframes`
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const pulse = keyframes`
    0% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
    }
    70% {
        transform: scale(1.05);
        box-shadow: 0 0 0 12px rgba(99, 102, 241, 0);
    }
    100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
    }
`;

const float = keyframes`
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-0.5rem);
    }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const gradientFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// ======================
// STYLED COMPONENTS
// ======================
const PageContainer = styled.div`
    position: relative;
    max-width: var(--max-width);
    margin: 0 auto;
    background-color: var(--light);
    min-height: 100vh;
    padding-bottom: var(--space-xxl);
    overflow-x: hidden;
`;

const HeroSection = styled.section`
    position: relative;
    margin-bottom: var(--space-xxl);
    border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--primary), var(--primary-dark));
    animation: ${fadeIn} 0.6s ease-out forwards;
`;

const SliderContainer = styled.div`
    position: relative;
    z-index: 1;
`;

const GradientOverlay = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    z-index: 2;
`;

const ResultCountContainer = styled.div`
    position: absolute;
    bottom: var(--space-md);
    right: var(--space-xl);
    background: var(--white);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-md);
    z-index: var(--z-index-low);
    backdrop-filter: blur(4px);
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    transition: var(--transition-default);
    animation: ${fadeIn} 0.5s ease-out 0.3s both;

    &:hover {
        transform: translateY(-0.25rem);
        box-shadow: var(--shadow-lg);
    }
`;

const ControlsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 var(--space-xl);
    margin-bottom: var(--space-lg);
    position: sticky;
    top: var(--header-height);
    background-color: var(--light);
    z-index: var(--z-index-medium);
    padding-top: var(--space-md);
    padding-bottom: var(--space-md);
    border-bottom: 1px solid var(--gray);
    transition: var(--transition-default);
    backdrop-filter: blur(8px);
    background-color: rgba(249, 250, 251, 0.9);
    animation: ${fadeIn} 0.5s ease-out forwards;
`;

const CategoryPanel = styled.aside`
    position: fixed;
    left: calc(-1 * var(--sidebar-width));
    top: 0;
    width: var(--sidebar-width);
    height: 100vh;
    background: var(--white);
    z-index: var(--z-index-high);
    box-shadow: var(--shadow-2xl);
    transition: var(--transition-slow);
    padding: var(--space-lg);
    overflow-y: auto;
    padding-top: calc(var(--header-height) + var(--space-md));
    animation: ${slideInFromLeft} 0.4s ease-out forwards;

    &.open {
        left: 0;
        animation: ${slideInFromLeft} 0.4s ease-out forwards;
    }

    &::-webkit-scrollbar {
        width: 0.375rem;
    }

    &::-webkit-scrollbar-track {
        background: var(--gray);
        border-radius: var(--radius-full);
    }

    &::-webkit-scrollbar-thumb {
        background-color: var(--gray-dark);
        border-radius: var(--radius-full);
        transition: var(--transition-default);

        &:hover {
            background-color: var(--primary);
        }
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: var(--z-index-medium);
    opacity: ${({ $visible }) => ($visible ? 1 : 0)};
    visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
    transition: var(--transition-slow);
    backdrop-filter: blur(4px);
`;

const ContentContainer = styled.main`
    display: flex;
    flex-direction: column;
    padding: 0 var(--space-xl);
    gap: var(--space-xl);
    position: relative;
    animation: ${fadeIn} 0.6s ease-out 0.2s both;
`;

const FiltersContainer = styled.div`
    width: 100%;
    max-width: 100%;
    margin: 0 auto var(--space-lg);
    padding: var(--space-lg) var(--space-xl);
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    transition: var(--transition-bounce);
    position: sticky;
    top: calc(var(--header-height) + var(--space-md));
    z-index: var(--z-index-medium);
    max-height: ${p => (p.open ? '500px' : '0')};
    padding: ${p => (p.open ? 'var(--space-lg) var(--space-xl)' : '0 var(--space-xl)')};
    overflow: hidden;
    opacity: ${p => (p.open ? 1 : 0.8)};

    &:hover {
        box-shadow: var(--shadow-lg);
        opacity: 1;
    }

    @media (max-width: 768px) {
        position: static;
        max-height: ${p => (p.open ? 'none' : '0')};
    }
`;

const ProductGrid = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: var(--space-lg);
    padding-bottom: var(--space-xl);

    & > * {
        animation: ${fadeIn} 0.4s ease-out forwards;
        opacity: 0;
        animation-delay: ${props => props.delay || '0s'};
    }

    @media (max-width: 1200px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const EmptyState = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-3xl) var(--space-xl);
    background: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    margin-top: var(--space-xl);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-md);
    transition: var(--transition-default);
    animation: ${bounce} 1s ease infinite;

    &:hover {
        transform: translateY(-0.25rem);
        box-shadow: var(--shadow-lg);
        animation: none;
    }
`;

const AuthMessage = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: var(--space-xl);
    text-align: center;
    background-color: var(--white);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    margin: var(--space-xl);
    transition: var(--transition-default);
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: ${gradientFlow} 15s ease infinite;

    &:hover {
        transform: translateY(-0.25rem);
        box-shadow: var(--shadow-xl);
    }
`;

const StyledIconButton = styled(IconButton)`
    &.category-toggle {
        background-color: var(--primary);
        color: var(--white);
        transition: var(--transition-default);
        z-index: var(--z-index-highest);
        box-shadow: var(--shadow-md);
        border-radius: var(--radius-md);
        padding: var(--space-sm);
        animation: ${pulse} 2s infinite;

        &:hover {
            background-color: var(--primary-dark);
            transform: translateY(-0.125rem);
            box-shadow: var(--shadow-lg);
            animation: none;
        }

        &.active {
            background-color: var(--dark);
            transform: rotate(90deg);
        }
    }

    &.filter-toggle {
        background-color: var(--white);
        border: 1px solid var(--gray);
        color: var(--dark);
        transition: var(--transition-default);
        gap: var(--space-sm);
        padding: var(--space-sm) var(--space-md);
        box-shadow: var(--shadow-sm);
        border-radius: var(--radius-md);

        &:hover {
            background-color: var(--primary-light);
            color: var(--primary-dark);
            border-color: var(--primary);
            transform: translateY(-0.125rem);
            box-shadow: var(--shadow-md);
        }

        &.active {
            background-color: var(--dark);
            color: var(--white);
            border-color: var(--dark);
        }
    }
`;

const FilterText = styled.span`
    font-size: 0.875rem;
    font-weight: 600;
    margin-left: var(--space-xs);
    transition: var(--transition-default);
`;

const LoadingIndicator = styled.div`
    grid-column: 1 / -1;
    text-align: center;
    padding: var(--space-xl);
`;

const LoadingDot = styled.div`
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: var(--radius-full);
    background-color: var(--primary);
    margin: 0 var(--space-xs);
    animation: ${float} 1.4s infinite ease-in-out;

    &:nth-child(1) {
        animation-delay: -0.32s;
    }
    &:nth-child(2) {
        animation-delay: -0.16s;
    }
`;

const FloatingActionButton = styled.button`
    position: fixed;
    bottom: var(--space-xl);
    right: var(--space-xl);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--primary), var(--accent));
    color: white;
    border: none;
    box-shadow: var(--shadow-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: var(--z-index-high);
    transition: var(--transition-bounce);
    animation: ${bounce} 2s infinite;

    &:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-neon);
        animation: none;
    }

    svg {
        font-size: 1.5rem;
    }
`;

const ProductListPage = () => {
    // Routing and Auth
    const { category_slug, subcategory_slug } = useParams();
    const { authToken } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // State
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [loading, setLoading] = useState(false);
    const [meta, setMeta] = useState(INITIAL_META);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterData, setFilterData] = useState({});

    // Filter options
    const [colors, setColors] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [categories, setCategories] = useState([]);

    // UI State
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // Derived state
    const isQuickViewOpen = Boolean(quickViewProduct);
    const isEmptyState = !loading && products.length === 0;
    const resultCountText = `Showing ${products.length} of ${meta.count} products`;
    const [nextUrl, setNextUrl] = useState('/shop/products/?page=1');

    // Currency symbol mapping
    const currencySymbols = useMemo(() => ({
        USD: '$',
        AMD: '֏',
        RUB: '₽'
    }), []);

    // API Calls
    const fetchFilters = useCallback(async () => {
        try {
            const res = await fetch('/shop/product_filter/');
            if (!res.ok) throw new Error(`Status: ${res.status}`);

            const { colors = [], brands = [], sizes = [] } = await res.json();
            setColors(colors);
            setBrands(brands);
            setSizes(sizes);
        } catch (error) {
            console.error('Failed to fetch filters:', error);
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch('/shop/category/');
            const data = await res.json();
            setCategories(data || []);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        }
    }, []);

    const handleCategorySelect = ({ category, subcategory }) => {
        const newFilters = {
            ...filters,
            categories: category ? [category] : [],
            subcategories: subcategory ? [subcategory] : [],
        };

        const hasChanged = JSON.stringify(newFilters) !== JSON.stringify(filters);
        if (hasChanged) {
            setFilters(newFilters);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({
            ...prev,
            ...newFilters,
        }));
    };

    const fetchProducts = useCallback(async (url, append = false) => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...filters, search: searchQuery }),
            });
            if (!res.ok) throw new Error(`Status ${res.status}`);
            const data = await res.json();

            const list = Array.isArray(data.products) ? data.products : [];
            setProducts(prev => append ? [...prev, ...list] : list);
            setHasMore(Boolean(data.has_next));
            setNextUrl(data.next);
        } catch (err) {
            console.error('fetchProducts error:', err);
            if (!append) setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [filters, searchQuery]);

    useEffect(() => {
        const initial = '/shop/products/?page=1';
        setNextUrl(initial);
        setHasMore(true);
        fetchProducts(initial, false);
    }, [filters, searchQuery, fetchProducts]);

    const getFullFilters = useCallback(() => ({
        ...filters,
        categories: category_slug ? [category_slug] : filters.categories || [],
        subcategories: subcategory_slug ? [subcategory_slug] : filters.subcategories || [],
    }), [filters, category_slug, subcategory_slug]);

    const debouncedFetchProducts = useMemo(
        () => debounce(
            (filters, nextPage) => fetchProducts(filters, nextPage, true),
            DEBOUNCE_DELAY
        ),
        [fetchProducts]
    );

    useEffect(() => {
        setPage(1);
        fetchProducts(getFullFilters(), 1);
    }, [filters, getFullFilters, fetchProducts, searchQuery]);

    useEffect(() => {
        fetchFilters();
        fetchCategories();
    }, [fetchFilters, fetchCategories]);

    useEffect(() => {
        const onScroll = debounce(() => {
            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - SCROLL_THRESHOLD;

            if (nearBottom && !loading && hasMore) {
                fetchProducts(nextUrl, true);
            }
        }, DEBOUNCE_MS);

        window.addEventListener('scroll', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            onScroll.cancel();
        };
    }, [nextUrl, loading, hasMore, fetchProducts]);

    const handleOpenQuickView = (product) => {
        setQuickViewProduct(product);
    };

    const handleCloseQuickView = () => {
        setQuickViewProduct(null);
    };

    const handleWishlistToggle = (productId, liked) => {
        setProducts(prev => prev.map(p =>
            p.id === productId ? { ...p, liked } : p
        ));
    };

    const toggleCategoryPanel = () => setIsCategoryOpen(prev => !prev);
    const toggleFilterPanel = () => setIsFilterOpen(prev => !prev);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const renderProductCards = () => {
        if (loading && !products.length) {
            return Array.from({ length: SKELETON_ITEMS }).map((_, i) => (
                <SkeletonProductCard key={`skeleton-${i}`} />
            ));
        }

        return products.map((product, i) => (
            <ProductCard
                key={product.id}
                product={product}
                getCurrencySymbol={(code) => currencySymbols[code] || ''}
                // isWishlist={product.liked}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={() => handleOpenQuickView(product)}
                style={{ animationDelay: `${i * 0.05}s` }}
                isMobile={isMobile}
            />
        ));
    };

    const renderEmptyState = () => (
        <EmptyState>
            <Typography variant="h5" color="textPrimary" gutterBottom>
                No products found
            </Typography>
            <Typography variant="body1" color="textSecondary">
                Try adjusting your filters or search criteria
            </Typography>
        </EmptyState>
    );

    const renderAuthMessage = () => (
        <AuthMessage>
            <Typography variant="h4" gutterBottom color="textPrimary" style={{ color: 'white' }}>
                You must be logged in to see products
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph style={{ color: 'white' }}>
                Please sign in to continue browsing our collection
            </Typography>
        </AuthMessage>
    );

    const renderLoadingIndicator = () => (
        <LoadingIndicator>
            {Array(3).fill().map((_, i) => (
                <LoadingDot key={i} />
            ))}
        </LoadingIndicator>
    );

    return (
        <>
            <GlobalStyles />
            <PageContainer>
                {/* Hero Section */}


                        <SliderList />




                {/* Controls */}
                <ControlsContainer>
                    <StyledIconButton
                        className={`category-toggle ${isCategoryOpen ? 'active' : ''}`}
                        onClick={toggleCategoryPanel}
                        aria-label={isCategoryOpen ? 'Close categories' : 'Open categories'}
                    >
                        {isCategoryOpen ? <Close /> : <Menu />}
                    </StyledIconButton>

                    <SearchBox
                        value={searchQuery}
                        onChange={text => setSearchQuery(text)}
                    />

                    <StyledIconButton
                        className={`filter-toggle ${isFilterOpen ? 'active' : ''}`}
                        onClick={toggleFilterPanel}
                        aria-label={isFilterOpen ? 'Hide filters' : 'Show filters'}
                    >
                        <FilterList />
                        {!isMobile && <FilterText>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</FilterText>}
                    </StyledIconButton>
                </ControlsContainer>

                {/*<ResultCountContainer>*/}
                {/*    <Typography variant="subtitle2" color="textSecondary">*/}
                {/*        {resultCountText}*/}
                {/*    </Typography>*/}
                {/*</ResultCountContainer>*/}

                {/* Category Panel Overlay */}
                <Overlay $visible={isCategoryOpen} onClick={toggleCategoryPanel} />

                {/* Category Panel */}
                <CategoryPanel className={isCategoryOpen ? 'open' : ''}>
                    <CategoryList
                        categories={categories}
                        onCategorySelect={handleCategorySelect}
                    />
                </CategoryPanel>

                {/* Main Content */}
                <ContentContainer>
                    {/* Filters */}
                    <FiltersContainer open={isFilterOpen}>
                        <ProductFilters
                            onChange={handleFilterChange}
                            colors={colors}
                            brands={brands}
                            sizes={sizes}
                            externalFilters={{
                                category: filters.categories?.[0] || '',
                                subcategory: filters.subcategories?.[0] || '',
                                search: searchQuery
                            }}
                        />
                    </FiltersContainer>

                    {/* Product Grid */}
                    <ProductGrid>
                        {isEmptyState ? renderEmptyState() : renderProductCards()}
                        {loading && products.length > 0 && renderLoadingIndicator()}
                    </ProductGrid>
                </ContentContainer>

                {/* Quick View Modal */}
                {isQuickViewOpen && (
                    <QuickViewModal
                        product={quickViewProduct}
                        isOpen={isQuickViewOpen}
                        onClose={handleCloseQuickView}
                        getCurrencySymbol={(code) => currencySymbols[code] || ''}
                    />
                )}

                {/* Floating Action Button */}
                <FloatingActionButton onClick={scrollToTop} aria-label="Scroll to top">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6"/>
                    </svg>
                </FloatingActionButton>
            </PageContainer>
        </>
    );
};

export default ProductListPage;