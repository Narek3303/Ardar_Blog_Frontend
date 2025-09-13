import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const LikedProductsContext = createContext();

export const LikedProductsProvider = ({ children }) => {
    const [likedIds, setLikedIds] = useState([]);

    useEffect(() => {
        axiosInstance
            .get('/shop/liked_products/')
            .then((res) => {
                const ids = res.data.products.map((p) => p.id);
                setLikedIds(ids);
            })
            .catch((err) => {
                console.error('Failed to load liked products:', err);
            });
    }, []);

    return (
        <LikedProductsContext.Provider value={{ likedIds, setLikedIds }}>
            {children}
        </LikedProductsContext.Provider>
    );
};

export const useLikedProducts = () => {
    const context = useContext(LikedProductsContext);
    if (!context) {
        throw new Error('useLikedProducts must be used within a LikedProductsProvider');
    }
    return context;
};
