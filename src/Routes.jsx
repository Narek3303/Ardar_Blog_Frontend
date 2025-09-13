import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoryList from './components/CategoryList';
import ProductListPage from './pages/ProductListPage';
import WishlistPage from './pages/WishlistPage';  // Ավելացրու WishlistPage
import NotFoundPage from './pages/NotFoundPage';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<CategoryList />} />
            <Route path="/shop/products/:category_slug/" element={<ProductListPage />} />
            <Route path="/shop/products/:category_slug/:subcategory_slug/" element={<ProductListPage />} />
            <Route path="/wishlist/" element={<WishlistPage />} />  {/* Ավելացրու WishlistPage */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
