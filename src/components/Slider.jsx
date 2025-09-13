import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import axios from 'axios';
import './Slider.css';

const Slider = () => {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch slides from API
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await axios.get('shop/sliders/');
                setSlides(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    // Auto-advance slides
    useEffect(() => {
        if (slides.length > 1) {
            const interval = setInterval(() => {
                goToNext();
            }, 5000); // Change slide every 5 seconds
            return () => clearInterval(interval);
        }
    }, [currentIndex, slides.length]);

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
    };

    // Swipe handlers for mobile
    const handlers = useSwipeable({
        onSwipedLeft: () => goToNext(),
        onSwipedRight: () => goToPrevious(),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    if (loading) return <div className="slider-loading">Loading carousel...</div>;
    if (error) return <div className="slider-error">Error loading carousel: {error}</div>;
    if (slides.length === 0) return <div className="slider-empty">No slides available</div>;

    return (
        <div className="slider-container" {...handlers}>
            {/* Left Arrow */}
            {slides.length > 1 && (
                <button className="slider-arrow left-arrow" onClick={goToPrevious}>
                    &lt;
                </button>
            )}

            {/* Slide Content */}
            <div className="slider-wrapper">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slider-slide ${index === currentIndex ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slider-overlay">
                            <div className="slider-content">
                                <h2 className="slider-title">{slide.name}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Arrow */}
            {slides.length > 1 && (
                <button className="slider-arrow right-arrow" onClick={goToNext}>
                    &gt;
                </button>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="slider-dots">
                    {slides.map((slide, slideIndex) => (
                        <button
                            key={slideIndex}
                            className={`slider-dot ${slideIndex === currentIndex ? 'active' : ''}`}
                            onClick={() => goToSlide(slideIndex)}
                            aria-label={`Go to slide ${slideIndex + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Slider;
