import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassPlusIcon, MagnifyingGlassMinusIcon, ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import '../styles/ProductImage.css';

const ProductImages = ({ images }) => {
    const [mainImage, setMainImage] = useState(images[0]);
    const [isZoomed, setIsZoomed] = useState(false);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Handle image change with useCallback for memoization
    const changeImage = useCallback((direction) => {
        const currentIndex = images.findIndex((img) => img.id === mainImage.id);
        let newIndex = currentIndex + direction;

        // Loop back to start or end if the index is out of bounds
        if (newIndex < 0) {
            newIndex = images.length - 1;
        } else if (newIndex >= images.length) {
            newIndex = 0;
        }

        setMainImage(images[newIndex]);
        setIsZoomed(false);
    }, [mainImage, images]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowRight") changeImage(1);
            if (event.key === "ArrowLeft") changeImage(-1);
            if (event.key === "Escape") {
                setIsZoomed(false);
                setShowFullscreen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [changeImage]);

    // Touch event handlers for mobile swipe
    const handleTouchStart = (e) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > 50) changeImage(1); // Swipe left
        if (distance < -50) changeImage(-1); // Swipe right
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <div className="product-images-container">
            {/* Main Image Container */}
            <div className="main-image-wrapper">
                <motion.div
                    className="relative overflow-hidden rounded-lg bg-gray-100"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => changeImage(-1)}
                                className="nav-arrow left-arrow"
                                aria-label="Previous image"
                            >
                                <ArrowLeftIcon className="h-6 w-6" />
                            </button>
                            <button
                                onClick={() => changeImage(1)}
                                className="nav-arrow right-arrow"
                                aria-label="Next image"
                            >
                                <ArrowRightIcon className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Zoom Controls */}
                    <div className="zoom-controls">
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className="zoom-button"
                            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                        >
                            {isZoomed ? (
                                <MagnifyingGlassMinusIcon className="h-5 w-5" />
                            ) : (
                                <MagnifyingGlassPlusIcon className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            onClick={() => setShowFullscreen(true)}
                            className="fullscreen-button"
                            aria-label="View fullscreen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                        </button>
                    </div>

                    {/* Main Image */}
                    <motion.img
                        src={`http://127.0.0.1:8000${mainImage.image}`}
                        alt={`Product ${mainImage.id}`}
                        className={`main-image ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                        onClick={() => setIsZoomed(!isZoomed)}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        initial={{ scale: 1 }}
                        animate={{ scale: isZoomed ? 1.5 : 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        loading="lazy"
                        draggable="false"
                    />
                </motion.div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div className="thumbnail-gallery">
                    {images.map((img) => (
                        <motion.button
                            key={img.id}
                            onClick={() => setMainImage(img)}
                            className={`thumbnail-container ${mainImage.id === img.id ? 'active-thumbnail' : ''}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            aria-label={`View image ${img.id}`}
                        >
                            <motion.img
                                src={`http://127.0.0.1:8000${img.image}`}
                                alt={`Thumbnail ${img.id}`}
                                className="thumbnail-image"
                                loading="lazy"
                                draggable="false"
                            />
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {showFullscreen && (
                    <motion.div
                        className="fullscreen-modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFullscreen(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="close-modal"
                                onClick={() => setShowFullscreen(false)}
                                aria-label="Close fullscreen"
                            >
                                &times;
                            </button>
                            <img
                                src={`http://127.0.0.1:8000${mainImage.image}`}
                                alt={`Product ${mainImage.id} (fullscreen)`}
                                className="fullscreen-image"
                                draggable="false"
                            />
                            {images.length > 1 && (
                                <div className="modal-nav">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            changeImage(-1);
                                        }}
                                        className="modal-nav-button left"
                                        aria-label="Previous image"
                                    >
                                        <ArrowLeftIcon className="h-8 w-8" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            changeImage(1);
                                        }}
                                        className="modal-nav-button right"
                                        aria-label="Next image"
                                    >
                                        <ArrowRightIcon className="h-8 w-8" />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductImages;
