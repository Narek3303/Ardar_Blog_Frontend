import React, { useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'react-feather';
import '../styles/SizeSelectModal.css';
import { CurrencyContext } from "../context/CurrencyContext";

// Motion animation variants to reduce repetition
const fadeVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

const slideUpVariant = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
    }
};

const SizeSelectModal = ({ product, onSizeSelect, onClose }) => {
    const { currency, exchangeRate } = useContext(CurrencyContext);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                {...fadeVariant}
                className="size-select-modal"
                role="dialog"
                aria-modal="true"
            >
                <motion.div
                    {...fadeVariant}
                    className="size-select-modal__backdrop"
                    onClick={onClose}
                />

                <motion.div
                    {...slideUpVariant}
                    className="size-select-modal__content"
                >
                    <div className="size-select-modal__card">
                        {/* Header */}
                        <header className="size-select-modal__header">
                            <div className="size-select-modal__header-content">
                                <h2 className="size-select-modal__title">Select Your Size</h2>
                                <p className="size-select-modal__subtitle">
                                    Available options for {product?.name}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="size-select-modal__close-btn"
                                aria-label="Close"
                            >
                                <X className="size-select-modal__close-icon" />
                            </button>
                        </header>

                        {/* Size List */}
                        <div className="size-select-modal__list-container">
                            <ul className="size-select-modal__list">
                                {Array.isArray(product?.size_prices) &&
                                    product.size_prices.map((sp) => (
                                        <li key={sp.id}>
                                            <motion.button
                                                whileHover={{
                                                    scale: 1.02,
                                                    boxShadow: "0 4px 12px rgba(67, 97, 238, 0.2)"
                                                }}
                                                whileTap={{ scale: 0.98 }}
                                                className="size-select-modal__item-btn"
                                                onClick={() =>
                                                    onSizeSelect(sp.id, parseFloat(sp.price))
                                                }
                                            >
                                                <div className="size-select-modal__item-content">
                                                    <span className="size-select-modal__size-name">
                                                        {sp.size?.name}
                                                    </span>
                                                    <div className="size-select-modal__price-container">
                                                        <span className="size-select-modal__price">
                                                            {Number(sp.price * exchangeRate).toLocaleString(undefined, {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}{" "}
                                                            {currency}
                                                        </span>
                                                        <ChevronRight className="size-select-modal__arrow-icon" />
                                                    </div>
                                                </div>
                                            </motion.button>
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Footer */}
                        <footer className="size-select-modal__footer">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onClose}
                                className="size-select-modal__cancel-btn"
                            >
                                Close
                            </motion.button>
                        </footer>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(SizeSelectModal);
