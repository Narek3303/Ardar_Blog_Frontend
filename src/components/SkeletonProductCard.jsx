import React from 'react';
import { motion } from 'framer-motion';
import '../styles/SkeletonProductCard.css';

const SkeletonProductCard = () => {
    return (
        <motion.div
            className="bg-white rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 1.5,
                ease: "easeInOut"
            }}
        >
            {/* Image placeholder */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer" />
            </div>

            {/* Content placeholder */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-100 rounded-full w-3/4"></div>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-4 w-4 bg-gray-100 rounded-full"></div>
                    ))}
                    <div className="h-3 bg-gray-100 rounded-full w-8 ml-1"></div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                    <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                    <div className="h-5 bg-gray-100 rounded-full w-12"></div>
                </div>

                {/* Button */}
                <div className="h-10 bg-gray-100 rounded-lg mt-2"></div>
            </div>
        </motion.div>
    );
};

export default SkeletonProductCard;