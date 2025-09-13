import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { Navigate, useNavigate } from 'react-router-dom';
import { FiHeart, FiArrowRight, FiRefreshCw, FiLogIn } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const WishlistPage = () => {
    const { authToken, loading } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState(null);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
    const navigate = useNavigate();

    // Fetch wishlist data
    const fetchWishlist = async () => {
        if (!authToken) {
            setError("Please login to access your wishlist.");
            return;
        }

        setIsLoadingWishlist(true);
        try {
            const response = await axios.get("/shop/wishlist_all/", {
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });
            setWishlist(response.data.products || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching wishlist products", err);
            setError("Failed to load wishlist items. Please try again later.");
        } finally {
            setIsLoadingWishlist(false);
        }
    };



    useEffect(() => {
        if (!loading && authToken) {
            fetchWishlist();
        }
    }, [authToken, loading]);

    // Loading state
    if (loading) {
        return (
            <div className="wishlist-loading-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="loading-container"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        className="loading-spinner"
                    />
                    <p className="loading-text">Loading your wishlist...</p>
                </motion.div>
            </div>
        );
    }


    // Unauthenticated state
    if (!authToken && !loading) {
        return <Navigate to="/login" />;
    }


    // Error state
    if (error) {
        return (
            <div className="wishlist-error-screen">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="error-container"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="error-icon"
                    >
                        <FiHeart className="heart-icon" />
                    </motion.div>
                    <h2 className="error-title">Oops!</h2>
                    <p className="error-message">{error}</p>
                    <div className="error-actions">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fetchWishlist()}
                            className="retry-button"
                        >
                            <FiRefreshCw className="button-icon" /> Retry
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="home-button"
                        >
                            <FiArrowRight className="button-icon" /> Go Home
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Main content
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="wishlist-page"
        >
            <div className="wishlist-container">
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="wishlist-header"
                >
                    <h1 className="wishlist-title">Your Wishlist</h1>
                    <div className="wishlist-count">
                        {wishlist.length} {wishlist.length === 1 ? "cherished item" : "treasured items"}
                    </div>
                </motion.div>

                {isLoadingWishlist ? (
                    <div className="wishlist-grid">
                        {[...Array(4)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0.5 }}
                                animate={{ opacity: 1 }}
                                transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                                className="wishlist-skeleton-card"
                            >
                                <div className="skeleton-image"></div>
                                <div className="skeleton-content">
                                    <div className="skeleton-line"></div>
                                    <div className="skeleton-line short"></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="empty-wishlist"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="empty-icon-container"
                        >
                            <FiHeart className="empty-icon" />
                        </motion.div>
                        <h3 className="empty-title">Your wishlist is empty</h3>
                        <p className="empty-message">
                            Discover amazing products and add them to your wishlist to save them for later!
                        </p>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href="/"
                            className="explore-button"
                        >
                            Explore Products <FiArrowRight className="button-icon" />
                        </motion.a>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        <div className="wishlist-grid">
                            {wishlist.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.3 }}
                                    whileHover={{ y: -5 }}
                                    className="wishlist-item"
                                >
                                    <ProductCard
                                        product={product}
                                        isWishlist={true}
                                        getCurrencySymbol={(currencyCode) =>
                                            currencyCode === "AMD" ? "֏" : "$"
                                        }
                                        className="product-card"
                                    />

                                </motion.div>
                            ))}
                        </div>
                    </AnimatePresence>
                )}
            </div>

            {/* CSS Styles */}
            <style jsx>{`
                /* Base styles */
                .wishlist-page {
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
                    padding: 3rem 1rem;
                }
                
                .wishlist-container {
                    max-width: 80rem;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                /* Header styles */
                .wishlist-header {
                    margin-bottom: 3rem;
                    text-align: center;
                }
                
                .wishlist-title {
                    font-size: 2.25rem;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 0.75rem;
                }
                
                .wishlist-count {
                    display: inline-block;
                    background-color: #fce7f3;
                    color: #9d174d;
                    padding: 0.25rem 1rem;
                    border-radius: 9999px;
                    font-size: 0.875rem;
                    font-weight: 500;
                }
                
                /* Grid styles */
                .wishlist-grid {
                    display: grid;
                    grid-template-columns: repeat(1, 1fr);
                    gap: 2rem;
                }
                
                @media (min-width: 640px) {
                    .wishlist-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (min-width: 768px) {
                    .wishlist-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
                
                @media (min-width: 1024px) {
                    .wishlist-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
                
                /* Loading state */
                .wishlist-loading-screen {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
                }
                
                .loading-container {
                    text-align: center;
                }
                
                .loading-spinner {
                    width: 4rem;
                    height: 4rem;
                    border-radius: 9999px;
                    border: 4px solid #fbcfe8;
                    border-top-color: #ec4899;
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 1rem;
                }
                
                .loading-text {
                    color: #4b5563;
                    font-weight: 500;
                }
                
                /* Error state */
                .wishlist-error-screen {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
                    padding: 1rem;
                }
                
                .error-container {
                    max-width: 28rem;
                    width: 100%;
                    background-color: white;
                    padding: 2rem;
                    border-radius: 0.75rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    text-align: center;
                }
                
                .error-icon {
                    color: #f87171;
                    margin-bottom: 1rem;
                }
                
                .heart-icon {
                    width: 4rem;
                    height: 4rem;
                    margin-left: auto;
                    margin-right: auto;
                }
                
                .error-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }
                
                .error-message {
                    color: #6b7280;
                    margin-bottom: 1.5rem;
                }
                
                .error-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }
                
                .retry-button {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1.5rem;
                    background-color: #ec4899;
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                
                .retry-button:hover {
                    background-color: #db2777;
                }
                
                .home-button {
                    display: flex;
                    align-items: center;
                    padding: 0.5rem 1.5rem;
                    background-color: white;
                    border: 1px solid #d1d5db;
                    color: #374151;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                
                .home-button:hover {
                    background-color: #f9fafb;
                }
                
                .button-icon {
                    margin-right: 0.5rem;
                }
                
                /* Skeleton loading */
                .wishlist-skeleton-card {
                    background-color: white;
                    border-radius: 0.75rem;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    overflow: hidden;
                }
                
                .skeleton-image {
                    height: 15rem;
                    background: linear-gradient(to right, #f3f4f6, #e5e7eb, #f3f4f6);
                    animation: shimmer 1.5s infinite;
                }
                
                .skeleton-content {
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }
                
                .skeleton-line {
                    height: 1rem;
                    background-color: #e5e7eb;
                    border-radius: 0.25rem;
                    width: 75%;
                }
                
                .skeleton-line.short {
                    width: 50%;
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
                
                /* Empty state */
                .empty-wishlist {
                    text-align: center;
                    padding: 4rem 0;
                }
                
                .empty-icon-container {
                    width: 7rem;
                    height: 7rem;
                    background: linear-gradient(to bottom right, #fce7f3, #fbcfe8);
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 1.5rem;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
                }
                
                .empty-icon {
                    width: 3.5rem;
                    height: 3.5rem;
                    color: #ec4899;
                }
                
                .empty-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 0.75rem;
                }
                
                .empty-message {
                    color: #6b7280;
                    max-width: 28rem;
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 2rem;
                }
                
                .explore-button {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.75rem 1.5rem;
                    background: linear-gradient(to right, #ec4899, #db2777);
                    color: white;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3), 0 2px 4px -1px rgba(236, 72, 153, 0.1);
                    transition: all 0.2s;
                }
                
                .explore-button:hover {
                    box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.3), 0 4px 6px -2px rgba(236, 72, 153, 0.1);
                }
                
                /* Wishlist item */
                .wishlist-item {
                    position: relative;
                }
                
                .product-card {
                    height: 100%;
                }

                .wishlist-heart {
                    position: absolute;
                    top: 0.5rem; /* 8px */
                    left: 0.5rem; /* 8px */
                    width: 2.5rem; /* 40px */
                    height: 2.5rem; /* 40px */
                    background: rgba(255, 255, 255, 0.6); /* թափանցիկ սպիտակ ֆոն */
                    backdrop-filter: blur(6px); /* գեղեցիկ blur */
                    border-radius: 50%;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1),
                    0 2px 4px rgba(0, 0, 0, 0.06);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    z-index: 2; /* միշտ լինի վերևում */
                }

                .wishlist-heart:hover {
                    transform: scale(1.15);
                    background: rgba(255, 255, 255, 0.8); /* ավելի թափանցիկ ֆոն հովերի ժամանակ */
                    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15),
                    0 3px 6px rgba(0, 0, 0, 0.1);
                }




            `}</style>
        </motion.div>
    );
};

export default WishlistPage;
