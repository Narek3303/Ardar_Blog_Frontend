import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import '../styles/RelatedProducts.css';

const RelatedProducts = ({ relatedProducts = [] }) => {
    const [current, setCurrent] = useState(0);
    const containerRef = useRef();

    const handleNext = () => {
        if (current + 1 < relatedProducts.length) {
            setCurrent(current + 1);
        }
    };

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;
        const child = node.children[current];
        if (child) child.scrollIntoView({ behavior: 'smooth', inline: 'start' });
    }, [current]);

    return (
        <div className="carousel-wrapper">
            <div className="carousel-container" ref={containerRef}>
                {relatedProducts.map((product, i) => (
                    <Link
                        key={product.id}
                        to={`/product/${product.slug}/${product.id}`}
                        className={`slide ${i === current ? 'active' : ''}`}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            className="slide-inner"
                        >
                            <img
                                src={`http://127.0.0.1:8000${product.first_image}`}
                                alt={product.name}
                                className="slide-image"
                            />
                        </motion.div>
                    </Link>
                ))}
            </div>

        </div>
    );
};

export default RelatedProducts;
