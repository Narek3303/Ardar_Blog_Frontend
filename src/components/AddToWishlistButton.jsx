// import React, { useState, useCallback, useEffect } from 'react';
// import { useWishlist } from '../context/WishlistContext';
// import { motion } from 'framer-motion';
// import clsx from 'clsx'; // Import clsx for conditional classnames
// import '../styles/AddToWishlistButton.css'; // Import CSS styles
//
// const AddToWishlistButton = ({ product }) => {
//     const { toggleWishlist } = useWishlist();
//     const [isLiked, setIsLiked] = useState(product.liked || false);
//     const [loading, setLoading] = useState(false);
//
//     // Synchronize the component state with prop changes
//     useEffect(() => {
//         setIsLiked(product.liked || false);
//     }, [product.liked]);
//
//     // Handle wishlist toggle with async callback
//     const handleToggleWishlist = useCallback(async () => {
//         if (loading) return;  // Prevent action when loading
//
//         const previousIsLiked = isLiked;
//         setLoading(true);
//         setIsLiked((prevIsLiked) => !prevIsLiked); // Optimistically update state
//
//         try {
//             const response = await toggleWishlist(product.id);
//             if (response?.data?.liked !== undefined) {
//                 setIsLiked(response.data.liked); // Sync with server response
//                 console.log(response.data.liked ? "Product added to Wishlist" : "Product removed from Wishlist");
//             } else {
//                 setIsLiked(previousIsLiked); // Rollback if server response is invalid
//                 console.warn("Invalid server response for wishlist toggle.");
//             }
//         } catch (error) {
//             console.error("Error adding/removing product from Wishlist", error);
//             setIsLiked(previousIsLiked); // Rollback if request fails
//         } finally {
//             setLoading(false);
//         }
//     }, [loading, isLiked, product.id, toggleWishlist]);
//
//     return (
//         <motion.button
//             type="button"
//             className={clsx('wishlist-btn', {
//                 liked: isLiked,
//                 loading: loading,
//             })}
//             onClick={handleToggleWishlist}
//             whileTap={{ scale: 1.1 }}
//             animate={{
//                 scale: isLiked ? 1.2 : 1,
//                 rotate: isLiked ? 15 : 0,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 duration: 0.4,
//             }}
//             disabled={loading} // Disable the button when loading
//         >
//             {loading ? "⏳" : isLiked ? "❤️" : "🤍"}
//         </motion.button>
//     );
// };
//
// export default AddToWishlistButton;
