import React from "react";

const ProductDetailSkeleton = () => {
    return (
        <div className="animate-pulse p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Skeleton */}
                <div className="w-full h-64 bg-gray-300 rounded-md"></div>

                {/* Info Skeleton */}
                <div className="flex flex-col space-y-4">
                    <div className="h-8 bg-gray-300 rounded w-3/4"></div> {/* Title */}
                    <div className="h-6 bg-gray-300 rounded w-1/2"></div> {/* Price */}
                    <div className="h-4 bg-gray-300 rounded w-full"></div> {/* Short description */}
                    <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                    <div className="h-10 bg-gray-300 rounded w-1/3"></div> {/* Add to cart button */}
                </div>
            </div>

            {/* Size/Color/Reviews Skeleton */}
            <div className="mt-8 space-y-6">
                <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Size title */}
                <div className="flex space-x-4">
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                    <div className="w-16 h-8 bg-gray-300 rounded"></div>
                </div>

                <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Color title */}
                <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                </div>

                <div className="h-6 bg-gray-300 rounded w-1/4"></div> {/* Reviews title */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
