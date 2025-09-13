

import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
    useMemo
} from 'react';
import axiosInstance from '../api/axiosInstance'; // interceptor-ով հագեցված instance
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

const WishlistContext = createContext({
    wishlist: [],
    toggleWishlist: () => {},
    loading: true,
    error: null,
    isInWishlist: () => false,
});

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [state, setState] = useState({
        wishlist: [],
        loading: true,
        error: null,
        isUpdating: false,
    });

    const updateState = (newState) =>
        setState(prev => ({ ...prev, ...newState }));

    const isInWishlist = useCallback(
        (productId) => state.wishlist.some(item => item.id === productId),
        [state.wishlist]
    );

    const fetchWishlist = useCallback(async () => {
        try {
            updateState({ loading: true, error: null });
            const { data } = await axiosInstance.get('/shop/wishlist_all/');
            updateState({ wishlist: data.products || [], loading: false });
        } catch (err) {
            console.error('Wishlist fetch error:', err);
            updateState({
                error: err.response?.data?.message || 'Failed to load wishlist',
                loading: false
            });
            toast.error('Could not load your wishlist');
        }
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            updateState({ loading: false });
            return;
        }
        fetchWishlist();
    }, [fetchWishlist, isAuthenticated]);

    const toggleWishlist = useCallback(async (productId) => {
        if (state.isUpdating) return;

        const currentlyInWishlist = isInWishlist(productId);
        updateState({
            wishlist: currentlyInWishlist
                ? state.wishlist.filter(item => item.id !== productId)
                : [...state.wishlist, { id: productId }],
            isUpdating: true,
        });

        try {
            const { data } = await axiosInstance.post('/shop/wishlist/toggle/', {
                product_id: productId
            });
            if (data.liked !== !currentlyInWishlist) {
                fetchWishlist();
            }
        } catch (err) {
            console.error('Wishlist toggle error:', err);
            toast.error('Failed to update wishlist');
            fetchWishlist();
        } finally {
            updateState({ isUpdating: false });
        }
    }, [state.wishlist, state.isUpdating, isInWishlist, fetchWishlist]);

    const value = useMemo(() => ({
        wishlist: state.wishlist,
        toggleWishlist,
        loading: state.loading,
        error: state.error,
        isInWishlist,
    }), [state.wishlist, state.loading, state.error, toggleWishlist, isInWishlist]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};