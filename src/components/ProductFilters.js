import React, { useState, useEffect } from 'react';
import '../styles/ProductFilters.css';

const ProductFilters = ({
                            onChange,
                            colors = [],
                            brands = [],
                            sizes = [],
                            externalFilters = {}
                        }) => {
    const [form, setForm] = useState({
        search: '',
        discounted: false,
        min_price: '',
        max_price: '',
        brand: [],
        colors: [],
        size: [],
        category: '',
        subcategory: '',
    });

    const [isOpen, setIsOpen] = useState({
        price: false,
        color: false,
        size: false,
        brand: false,
        discounted: false,
    });

    // Debounced filter triggering
    const [prevFormStr, setPrevFormStr] = useState('');




    useEffect(() => {
        const currentFormStr = JSON.stringify(form);
        if (currentFormStr === prevFormStr) return;

        const timer = setTimeout(() => {
            onChange(form);
            setPrevFormStr(currentFormStr);
        }, 300);

        return () => clearTimeout(timer);
    }, [form, prevFormStr, onChange]);

    // Apply external filters on mount or change
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            ...externalFilters,
        }));
    }, [externalFilters]);

    const toggleFilter = (filter) => {
        setIsOpen(prev => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[key] = key === filter ? !prev[key] : false;
                return acc;
            }, {}),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onChange(form);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm(prev => {
            if (type === 'checkbox') {
                return { ...prev, [name]: checked };
            } else if (type === 'select-multiple') {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                return { ...prev, [name]: options };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleColorSelect = (colorSlug) => {
        setForm(prev => {
            const newColors = prev.colors.includes(colorSlug)
                ? prev.colors.filter(c => c !== colorSlug)
                : [...prev.colors, colorSlug];
            return { ...prev, colors: newColors };
        });
    };

    const handleCategorySelect = (slug) => {
        setForm(prev => ({
            ...prev,
            category: slug,
            subcategory: '',
        }));
    };

    const handleSubcategorySelect = (slug) => {
        setForm(prev => ({
            ...prev,
            subcategory: slug,
        }));
    };

    const handleBrandSelect = (brandSlug) => {
        setForm(prev => {
            const newBrands = prev.brand.includes(brandSlug)
                ? prev.brand.filter(b => b !== brandSlug)
                : [...prev.brand, brandSlug];
            return { ...prev, brand: newBrands };
        });
    };

    const handleSizeSelect = (sizeSlug) => {
        setForm(prev => {
            const newSizes = prev.size.includes(sizeSlug)
                ? prev.size.filter(s => s !== sizeSlug)
                : [...prev.size, sizeSlug];
            return { ...prev, size: newSizes };
        });
    };

    const clearFilters = () => {
        setForm({
            discounted: false,
            min_price: '',
            max_price: '',
            brand: [],
            colors: [],
            size: [],
            category: '',
            subcategory: '',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="filters-container">
            <div className="filters-grid">
                {/* Price Filter */}
                <div className={`filter-section ${isOpen.price ? 'open' : ''}`}>
                    <div className="filter-header" onClick={() => toggleFilter('price')}>
                        <h3 className="filter-title">Price Range</h3>
                        <span className="filter-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                        </span>
                    </div>
                    <div className="filter-content">
                        <div className="price-inputs">
                            <div className="input-group">
                                <label htmlFor="min_price">Min</label>
                                <input
                                    id="min_price"
                                    type="number"
                                    name="min_price"
                                    placeholder="Min"
                                    value={form.min_price}
                                    onChange={handleChange}
                                    min="0"
                                    className="price-input"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="max_price">Max</label>
                                <input
                                    id="max_price"
                                    type="number"
                                    name="max_price"
                                    placeholder="Max"
                                    value={form.max_price}
                                    onChange={handleChange}
                                    min={form.min_price || '0'}
                                    className="price-input"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discount Filter */}
                <div className={`filter-section ${isOpen.discounted ? 'open' : ''}`}>
                    <div className="filter-header" onClick={() => toggleFilter('discounted')}>
                        <h3 className="filter-title">Discount</h3>
                        <span className="filter-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                        </span>
                    </div>
                    <div className="filter-content">
                        <label className="discount-toggle">
                            <input
                                type="checkbox"
                                name="discounted"
                                checked={form.discounted}
                                onChange={handleChange}
                                className="toggle-input"
                            />
                            <span className="toggle-slider"></span>
                            <span className="toggle-label">Discounted Only</span>
                        </label>
                    </div>
                </div>

                {/* Color Filter */}
                <div className={`filter-section ${isOpen.color ? 'open' : ''}`}>
                    <div className="filter-header" onClick={() => toggleFilter('color')}>
                        <h3 className="filter-title">Colors</h3>
                        <span className="filter-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                        </span>
                    </div>
                    <div className="filter-content">
                        <div className="color-options">
                            {colors.map(color => (
                                <button
                                    key={color.id}
                                    type="button"
                                    className={`color-option ${form.colors.includes(color.slug) ? 'selected' : ''}`}
                                    onClick={() => handleColorSelect(color.slug)}
                                    style={{ backgroundColor: color.hex_code || '#ccc' }}
                                    title={color.name}
                                >
                                    {form.colors.includes(color.slug) && (
                                        <svg className="check-icon" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Size Filter */}
                <div className={`filter-section ${isOpen.size ? 'open' : ''}`}>
                    <div className="filter-header" onClick={() => toggleFilter('size')}>
                        <h3 className="filter-title">Sizes</h3>
                        <span className="filter-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                        </span>
                    </div>
                    <div className="filter-content">
                        <div className="size-options">
                            {sizes.map(size => (
                                <button
                                    key={size.id}
                                    type="button"
                                    className={`size-option ${form.size.includes(size.slug) ? 'selected' : ''}`}
                                    onClick={() => handleSizeSelect(size.slug)}
                                >
                                    {size.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Brand Filter */}
                <div className={`filter-section ${isOpen.brand ? 'open' : ''}`}>
                    <div className="filter-header" onClick={() => toggleFilter('brand')}>
                        <h3 className="filter-title">Brands</h3>
                        <span className="filter-arrow">
                            <svg width="16" height="16" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z" fill="currentColor" /></svg>
                        </span>
                    </div>
                    <div className="filter-content">
                        <div className="brand-options">
                            {brands.map(brand => (
                                <button
                                    key={brand.id}
                                    type="button"
                                    className={`brand-option ${form.brand.includes(brand.slug) ? 'selected' : ''}`}
                                    onClick={() => handleBrandSelect(brand.slug)}
                                >
                                    {brand.name}
                                    {form.brand.includes(brand.slug) && (
                                        <svg className="check-icon" viewBox="0 0 24 24">
                                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-actions">
                <button
                    type="button"
                    onClick={clearFilters}
                    className="clear-btn"
                    disabled={!Object.values(form).some(val => Array.isArray(val) ? val.length > 0 : Boolean(val))}
                >
                    Clear All
                </button>
                <button type="submit" className="apply-btn">
                    Apply Filters
                </button>
            </div>
        </form>
    );
};

export default ProductFilters;

