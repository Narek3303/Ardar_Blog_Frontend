import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import '../styles/ProductSizeSelector.css';

const ProductSizeSelector = ({
                                 sizes = [],
                                 sizePrices = [],
                                 onSizeChange,
                                 selectedSize: propSelectedSize,
                                 label = "Select Size",
                                 disabled = false
                             }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);

    // Sync with parent component if controlled
    useEffect(() => {
        if (propSelectedSize !== undefined) {
            setSelectedSize(sizePrices.find(sp => sp.size.slug === propSelectedSize?.size?.slug) || null);
        }
    }, [propSelectedSize, sizePrices]);

    const handleSizeSelect = (sizePrice) => {
        const newSelected = sizePrice === selectedSize ? null : sizePrice;
        setSelectedSize(newSelected);
        setIsOpen(false);
        if (onSizeChange) {
            onSizeChange(newSelected);
        }
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightIndex(prev =>
                    prev < sizePrices.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightIndex(prev =>
                    prev > 0 ? prev - 1 : 0
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightIndex >= 0) {
                    handleSizeSelect(sizePrices[highlightIndex]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                break;
            default:
                break;
        }
    };

    const toggleDropdown = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
            setHighlightIndex(-1);
        }
    };

    return (
        <div
            className={`size-selector ${disabled ? 'disabled' : ''}`}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className="selector-header" onClick={toggleDropdown}>
                <span className="selector-label">
                    {label}
                </span>
                <div className="selected-value">
                    {selectedSize ? (
                        <>
                            <span className="size-name">{selectedSize.size.name}</span>
                            {selectedSize.price && (
                                <span className="size-price">+{selectedSize.price} AMD</span>
                            )}
                        </>
                    ) : (
                        <span className="placeholder">Choose an option</span>
                    )}
                </div>
                <span className={`dropdown-icon ${isOpen ? 'open' : ''}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24">
                        <path d="M7 10l5 5 5-5z" fill="currentColor" />
                    </svg>
                </span>
            </div>

            {isOpen && (
                <div className="dropdown-options">
                    {sizePrices.map((sizePrice, index) => {
                        const size = sizePrice.size;
                        const isSelected = selectedSize?.size?.slug === size.slug;
                        const isHighlighted = index === highlightIndex;

                        return (
                            <div
                                key={size.id}
                                className={`option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                                onClick={() => handleSizeSelect(sizePrice)}
                                onMouseEnter={() => setHighlightIndex(index)}
                            >
                                <span className="option-size">{size.name}</span>
                                {sizePrice.price && (
                                    <span className="option-price">+{sizePrice.price} AMD</span>
                                )}
                                {isSelected && (
                                    <span className="checkmark">
                                        <svg width="16" height="16" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                                        </svg>
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Accessibility - screen reader only select */}
            <select
                className="sr-only"
                value={selectedSize?.size?.slug || ''}
                onChange={(e) => {
                    const selected = sizePrices.find(sp => sp.size.slug === e.target.value);
                    handleSizeSelect(selected);
                }}
                disabled={disabled}
            >
                <option value="">{label}</option>
                {sizes.map(size => (
                    <option key={size.id} value={size.slug}>
                        {size.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

ProductSizeSelector.propTypes = {
    sizes: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            slug: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired
        })
    ),
    sizePrices: PropTypes.arrayOf(
        PropTypes.shape({
            size: PropTypes.shape({
                id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
                slug: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired
            }).isRequired,
            price: PropTypes.number
        })
    ),
    onSizeChange: PropTypes.func,
    selectedSize: PropTypes.object,
    label: PropTypes.string,
    disabled: PropTypes.bool
};

export default ProductSizeSelector;