import React, { useState, useRef, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-hot-toast';
import SizeSelectModal from './SizeSelectModal';
import { useLikedProducts } from '../context/LikedProductsContext';

const WishlistButton = ({ product, size = 'medium' }) => {
    const { likedIds, setLikedIds } = useLikedProducts();
    const liked = likedIds.includes(product.id);

    const [showModal, setShowModal] = useState(false);
    const [selectedSizePrice, setSelectedSizePrice] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const buttonRef = useRef(null);
    const [ripples, setRipples] = useState([]);
    const rippleTimeoutRefs = useRef([]);
    const animationRef = useRef();

    // Clean up timeouts on unmount
    useEffect(() => {
        return () => {
            rippleTimeoutRefs.current.forEach(clearTimeout);
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    // Ripple effect handler with multiple ripples support
    const createRipple = (e) => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const diameter = Math.max(rect.width, rect.height) * 1.5;
        const x = e.clientX - rect.left - diameter / 2;
        const y = e.clientY - rect.top - diameter / 2;

        const newRipple = {
            id: Date.now(),
            x,
            y,
            size: diameter,
            opacity: 1
        };

        setRipples(prev => [...prev, newRipple]);

        // Animate ripple
        const startTime = Date.now();
        const duration = 800;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            setRipples(prev =>
                prev.map(r =>
                    r.id === newRipple.id
                        ? { ...r, opacity: 1 - progress * 0.8, size: diameter * (1 + progress * 0.3) }
                        : r
                )
            );

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setRipples(prev => prev.filter(r => r.id !== newRipple.id));
            }
        };

        animate();
    };

    // Toggle wishlist, optionally with sizeId
    const toggleWishlist = async (sizeId) => {
        if (isLoading) return;
        setIsLoading(true);
        setIsPressed(false);

        try {
            const payload = { product_id: product.id };
            if (sizeId) payload.size_id = sizeId;

            const { data } = await axiosInstance.post('/shop/wishlist/toggle/', payload);

            if (data.status === 'size_required') {
                setShowModal(true);
                toast.error('Խնդրում ենք ընտրել չափսը');
            } else {
                // ճիշտ toast մեթոդներ
                if (data.liked) {
                    toast.success('Ավելացվեց ցանկի մեջ', {
                        position: 'bottom-center',
                        icon: '❤️',
                        style: {
                            background: '#f0fdf4',
                            color: '#15803d',
                            border: '1px solid #bbf7d0',
                        },
                    });
                } else {
                    toast('Հեռացվեց ցանկից', {
                        position: 'bottom-center',
                        icon: '💔',
                        style: {
                            background: '#f8fafc',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                        },
                    });
                }

                // անիմացիան ամեն դեպքում
                setIsAnimating(true);
                setLikedIds((prev) =>
                    data.liked ? [...prev, product.id] : prev.filter((id) => id !== product.id)
                );
                setTimeout(() => setIsAnimating(false), 800);
            }
        } catch (err) {
            console.error('Wishlist toggle error:', err);
            toast.error('Տեղի ունեցավ սխալ', {
                position: 'bottom-center',
                icon: '⚠️',
                style: {
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                },
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Click handler on heart icon
    const handleHeartClick = (e) => {
        e.stopPropagation();
        createRipple(e);
        toggleWishlist();
    };

    // Handle size selection from modal
    const handleSizeSelect = (sizeId, price) => {
        setSelectedSizePrice({ id: sizeId, price });
        setShowModal(false);
        toggleWishlist(sizeId);
    };

    // Handle button states
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);
    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPressed(false);
    };

    if (!product) {
        return (
            <div className={`relative ${sizeClasses[size]} bg-gray-200 rounded-full overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[pulse_1.5s_infinite_ease-in-out] bg-[length:200%_100%]" />
            </div>
        );
    }

    const sizeClasses = {
        small: 'w-10 h-10 text-sm',
        medium: 'w-12 h-12 text-base',
        large: 'w-14 h-14 text-lg'
    };

    const heartSizeClasses = {
        small: 'w-5 h-5',
        medium: 'w-6 h-6',
        large: 'w-7 h-7'
    };

    const pulseSize = {
        small: 'scale-[1.1]',
        medium: 'scale-[1.15]',
        large: 'scale-[1.2]'
    };

    return (
        <div className={`relative ${sizeClasses[size]}`}>
            <button
                ref={buttonRef}
                onClick={handleHeartClick}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={liked}
                className={`
                    relative inline-flex items-center justify-center rounded-full 
                    border-none bg-transparent p-0 outline-none 
                    transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isLoading ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                    ${isHovered && !isLoading ? pulseSize[size] : ''}
                    ${isPressed ? 'scale-95' : ''}
                    group
                `}
                disabled={isLoading}
            >
                {/* Multiple ripples */}
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="absolute rounded-full bg-blue-400/20 z-10"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: ripple.size,
                            height: ripple.size,
                            opacity: ripple.opacity,
                            transform: `scale(${ripple.size / (Math.max(buttonRef.current?.clientWidth || 0, buttonRef.current?.clientHeight || 0) * 1.5)})`,
                            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
                        }}
                    />
                ))}

                {/* Floating particles */}
                {isAnimating && (
                    <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                        {[...Array(12)].map((_, i) => {
                            const angle = (i * 30) * (Math.PI / 180);
                            const distance = Math.random() * 20 + 15;
                            return (
                                <span
                                    key={i}
                                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 animate-[pop_0.8s_ease-out_forwards]"
                                    style={{
                                        animationDelay: `${i * 0.05}s`,
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate(-50%, -50%) translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`,
                                        background: `hsl(${200 + Math.random() * 40}, 80%, 60%)`
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                {/* Heart container */}
                <span className="relative z-20">
                    {/* Loading spinner */}
                    {isLoading && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                            <svg
                                viewBox="0 0 50 50"
                                className={`animate-spin ${heartSizeClasses[size]}`}
                                style={{
                                    stroke: '#3b82f6',
                                    strokeWidth: '3px',
                                    strokeLinecap: 'round',
                                    strokeDasharray: '90',
                                    strokeDashoffset: '0',
                                }}
                            >
                                <circle cx="25" cy="25" r="20" fill="none" />
                            </svg>
                        </span>
                    )}

                    {/* Heart icon */}
                    <span className={`flex items-center justify-center ${heartSizeClasses[size]}`}>
                        <svg
                            viewBox="0 0 24 24"
                            className="w-full h-full"
                            style={{
                                filter: liked
                                    ? 'drop-shadow(0 2px 4px rgba(33, 150, 243, 0.5))'
                                    : 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
                            }}
                        >
                            <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09
                                 C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5
                                 c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                fill={liked ? '#3b82f6' : 'white'}
                                stroke={liked ? '#2563eb' : '#9ca3af'}
                                strokeWidth={liked ? '1.8' : '1.5'}
                                className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isHovered && !isLoading ? 'scale-110' : 'scale-100'}`}
                            />
                        </svg>
                    </span>

                    {/* Pulse effect when liked */}
                    {liked && !isLoading && (
                        <span className="absolute inset-0 rounded-full bg-blue-100/30 pointer-events-none z-0 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]"></span>
                    )}
                </span>

                {/* Tooltip */}
                {isHovered && !isLoading && (
                    <span className={`
                        absolute -top-8 left-1/2 transform -translate-x-1/2 -translate-y-1
                        bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded
                        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        after:absolute after:top-full after:left-1/2 after:-translate-x-1/2
                        after:border-4 after:border-transparent after:border-t-gray-900
                    `}>
                        {liked ? 'Remove from wishlist' : 'Add to wishlist'}
                    </span>
                )}
            </button>

            {/* Size selection modal */}
            {showModal && (
                <SizeSelectModal
                    product={product}
                    onSizeSelect={handleSizeSelect}
                    onClose={() => setShowModal(false)}
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] backdrop-blur-sm"
                />
            )}

            {/* Custom animations */}
            <style jsx global>{`
                @keyframes pop {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
                @keyframes ping {
                    0% { transform: scale(0.8); opacity: 0.8; }
                    70%, 100% { transform: scale(1.5); opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default React.memo(WishlistButton);
