import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, HeartIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import ProductImages from "../components/ProductImages";
import ProductInfoModal from "../components/ProductInfo";
import RelatedProducts from "../components/RelatedProducts";
import ProductReviews from "../components/ProductReviews";
import AddToCartButton from "../components/AddToCartButton";
import ProductTags from "../components/ProductTags";
import ProductDetailSkeleton from "../components/ProductDetailSkeleton";
import WriteReviewForm from "../components/WriteReviewForm";
import AddToWishlistButton from "../components/AddToWishlistButton";
// import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import '../styles/ProductDetailPage.css';
import WishlistButton from "../components/WishlistButton";
import styled from "styled-components";






const ProductDetailPage = ({isWishlist = false, onWishlistToggle,}) => {
    const { slug, product_id } = useParams();
    const navigate = useNavigate();
    // const { addToCart } = useCart();
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isHovered, setIsHovered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);


    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/shop/product-detail/${slug}/${product_id}/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch product details.");
                }
                const data = await response.json();
                setProductData(data.product);
            } catch (error) {
                setError(`Error: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug, product_id]);

    const handleSizeChange = (size) => {
        setSelectedSize(size);
    };

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleQuantityChange = (newQuantity) => {
        setQuantity(Math.max(1, newQuantity));
    };

    // const handleAddToCart = () => {
    //     if (!selectedSize && productData?.size?.length > 0) {
    //         alert("Please select a size before adding to cart");
    //         return;
    //     }
    //
    //     addToCart({
    //         ...productData,
    //         selectedSize,
    //         selectedColor,
    //         quantity
    //     });
    // };


    const handleWriteReview = () => {
        setShowReviewForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });

    };
    if (loading) return <ProductDetailSkeleton />;
    if (error) return <div className="error-message">{error}</div>;
    if (!productData) return <div className="product-not-found">Product not found.</div>;


    const {
        name,
        image,
        price,
        final_price,
        size,
        size_prices,
        colors,
        currency_code,
        tags,
        reviews,
        related_products,
        average_rating,
        stock,
        brand,
        description,
        delivery_service
    } = productData;


    const discountPercentage = final_price < price
        ? Math.round((1 - final_price / price) * 100)
        : 0;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="product-detail-container"
        >
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="back-button"
                aria-label="Go back to previous page"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-1" />
                Back to Products
            </button>

            {/* Main Product Content */}
            <div className="product-detail-grid">
                {/* Product Images */}
                <div className="product-images-section">
                    {image && image.length > 0 ? (
                        <ProductImages images={image} />
                    ) : (
                        <div className="no-image-placeholder">
                            <div className="no-image-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p>No images available</p>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="product-info-section">
                    <div className="product-header">
                        <h1 className="product-title">{name}</h1>
                        <WishlistButton
                            product={productData}
                            onToggle={onWishlistToggle}
                            isHovered={isHovered}

                        />
                    </div>

                    {/* Brand */}
                    {brand && (
                        <div className="product-brand">
                            Brand: <span>{brand.name}</span>
                        </div>
                    )}

                    {/* Rating */}
                    <div className="product-rating">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <StarIcon
                                    key={i}
                                    className={`star-icon ${i < Math.floor(average_rating) ? 'filled' : ''}`}
                                />
                            ))}
                        </div>
                        <span className="rating-text">
    {average_rating.toFixed(1)} (
    <Link to={`/products/${productData.id}/review/`} className="review-link">
      {productData.count_reviews} reviews
    </Link>
    )
  </span>

                    </div>

                    <div className="product-price-container">
                        {final_price != null ? (
                            <>
                                <span className="current-price">{final_price.toLocaleString()} {currency_code}</span>
                                {discountPercentage > 0 && (
                                    <>
                                        <span className="original-price">{price.toLocaleString()} {currency_code}</span>
                                        <span className="discount-badge">
                        {discountPercentage}% OFF
                    </span>
                                    </>
                                )}
                            </>
                        ) : (
                            <span className="current-price">{price?.toLocaleString()} {currency_code}</span>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className={`stock-status ${stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                    </div>

                    {related_products?.length > 0 && (
                        <div className="related-products-section">
                            <RelatedProducts relatedProducts={related_products} />
                        </div>
                    )}






                    {/* Quantity Selector */}
                    <div className="product-option-section">
                        <h3 className="option-title">Quantity</h3>
                        <div className="quantity-selector">
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span>{quantity}</span>
                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={quantity >= stock}
                            >
                                +
                            </button>
                        </div>
                    </div>


                    {/* Tags */}
                    {tags?.length > 0 && (
                        <div className="product-tags-section">
                            <h3 className="option-title">Tags</h3>
                            <ProductTags tags={tags} />
                        </div>
                    )}

                    {/* Add to Cart */}
                    {/*<div className="add-to-cart-section">*/}
                    {/*    <AddToCartButton*/}
                    {/*        product={productData}*/}
                    {/*        selectedSize={selectedSize}*/}
                    {/*        selectedColor={selectedColor}*/}
                    {/*        quantity={quantity}*/}
                    {/*        disabled={stock <= 0}*/}
                    {/*        onClick={handleAddToCart}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/* Delivery Info */}
                    {delivery_service && (
                        <div className="delivery-info">
                            <svg className="delivery-icon" viewBox="0 0 24 24">
                                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                                <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                            </svg>
                            <span>{delivery_service}</span>
                        </div>
                    )}
                    <div><AddToCartButton
                        product={productData}
                        color={null}

                        quantity={quantity}
                        price={final_price ?? price}
                        sizePrices={productData?.size_prices}
                        isHovered={isHovered}



                    /></div>


                    {/* Write Review Button */}
                    <button
                        onClick={handleWriteReview}
                        className="write-review-button"
                    >
                        Write a Review
                    </button>

                    <div className="product-container">
                        <button onClick={handleOpenModal}>
                            More Info
                        </button>

                        {isModalOpen && (
                            <ProductInfoModal
                                product={productData}
                                onClose={handleCloseModal}
                                productName={productData.name}
                                className="product-modal-animate"
                            />
                        )}
                    </div>
                </div>
            </div>



            {/* Reviews Section */}
            <div className="reviews-section">
                <h2 className="section-title">
                    Customer Reviews
                </h2>
                <ProductReviews reviews={reviews} />
            </div>





            {/* Review Form Modal */}
            <AnimatePresence>
                {showReviewForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="review-form-modal"
                    >
                        <div className="modal-content">
                            <button
                                onClick={() => setShowReviewForm(false)}
                                className="close-modal-button"
                                aria-label="Close review form"
                            >
                                &times;
                            </button>
                            <WriteReviewForm
                                productId={product_id}
                                onSuccess={() => setShowReviewForm(false)}
                            />

                        </div>

                    </motion.div>

                )}
            </AnimatePresence>
            {/* --- Նման Ապրանքներ բաժին --- */}
            {productData.similar_products?.length > 0 && (
                <section className="similar-products-section mt-12">
                    <h2 className="section-title mb-4">Նման Ապրանքներ</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {productData.similar_products.map((sim, idx) => (
                            <ProductCard
                                key={sim.id}
                                product={sim}
                                index={idx}
                                getCurrencySymbol={(code) => {
                                    // Կարող ես կրկնել LIST էջի currencySymbols մեփինգը,
                                    // կամ օգտագործել CurrencyContext
                                    const map = { USD: '$', AMD: '֏', RUB: '₽' };
                                    return map[code] || code;
                                }}
                                onWishlistToggle={() => onWishlistToggle(sim.id, !sim.liked)}
                                onQuickView={() => navigate(`/product/${sim.slug}/${sim.id}`)}
                            />
                        ))}
                    </div>
                </section>
            )}

        </motion.div>
    );
};

export default ProductDetailPage;
