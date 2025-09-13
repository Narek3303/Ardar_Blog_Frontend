import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import SliderItem from "./SliderItem";
import styled, { keyframes, css } from "styled-components";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";

// Constants
const AUTO_SLIDE_INTERVAL = 5000;
const API_ENDPOINT = "/shop/sliders/";
const TRANSITION_DURATION = 800;
const EASING_FUNCTION = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

// Animations
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const slideInRight = keyframes`
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const slideInLeft = keyframes`
    from {
        transform: translateX(-100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
`;

const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const gradient = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

// Styled Components
const SliderContainer = styled.div`
    position: relative;
    width: 100%;
    height: 600px;
    max-width: 1440px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 24px;
    box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 0 0 1px rgba(0, 0, 0, 0.05);
    isolation: isolate;
    transition: all 0.5s ${EASING_FUNCTION};

    &:hover {
        box-shadow:
                0 25px 50px rgba(0, 0, 0, 0.2),
                0 0 0 1px rgba(0, 0, 0, 0.08);
    }

    @media (max-width: 1024px) {
        height: 500px;
        border-radius: 16px;
    }

    @media (max-width: 768px) {
        height: 400px;
        border-radius: 12px;
    }
`;

const SliderWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const SliderItemWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: ${({ active }) => (active ? 1 : 0)};
    z-index: ${({ active }) => (active ? 2 : 1)};
    transition: opacity ${TRANSITION_DURATION}ms ${EASING_FUNCTION};
    pointer-events: ${({ active }) => (active ? 'auto' : 'none')};

    animation: ${({ active, direction }) => {
        if (!active) return "none";
        return direction === "right"
                ? css`${slideInRight} ${TRANSITION_DURATION}ms ${EASING_FUNCTION} both`
                : direction === "left"
                        ? css`${slideInLeft} ${TRANSITION_DURATION}ms ${EASING_FUNCTION} both`
                        : css`${fadeIn} ${TRANSITION_DURATION}ms ease both`;
    }};
`;

const NavigationArrow = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 56px;
    height: 56px;
    background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(245, 245, 245, 0.95) 100%
    );
    border: none;
    border-radius: 50%;
    color: #1a1a1a;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow:
            0 8px 24px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(0, 0, 0, 0.05);
    transition: all 0.4s ${EASING_FUNCTION};
    z-index: 10;
    backdrop-filter: blur(8px);
    opacity: 0;
    scale: 0.9;
    will-change: transform, opacity;

    ${SliderContainer}:hover & {
        opacity: 1;
        scale: 1;
    }

    &:hover {
        background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 1) 0%,
                rgba(245, 245, 245, 1) 100%
        );
        box-shadow:
                0 12px 28px rgba(0, 0, 0, 0.15),
                0 0 0 1px rgba(0, 0, 0, 0.08);
        color: #4f46e5;
        transform: translateY(-50%) scale(1.05);
    }

    &:focus-visible {
        outline: 2px solid #4f46e5;
        outline-offset: 2px;
        opacity: 1;
        scale: 1;
    }

    svg {
        width: 24px;
        height: 24px;
        transition: transform 0.2s ease;
    }

    &:active svg {
        transform: scale(0.9);
    }

    @media (max-width: 768px) {
        width: 48px;
        height: 48px;
        opacity: 0.9;
        scale: 1;
    }
`;

const LeftArrow = styled(NavigationArrow)`
    left: 32px;

    @media (max-width: 768px) {
        left: 16px;
    }
`;

const RightArrow = styled(NavigationArrow)`
    right: 32px;

    @media (max-width: 768px) {
        right: 16px;
    }
`;

const DotsContainer = styled.div`
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12px;
    z-index: 10;
    padding: 12px;
    border-radius: 24px;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(8px);
    box-shadow:
            inset 0 1px 2px rgba(255, 255, 255, 0.1),
            0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
        bottom: 20px;
        gap: 8px;
        padding: 8px;
    }
`;

const Dot = styled.button`
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: ${({ active }) =>
            active ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.5)"};
    cursor: pointer;
    transition: all 0.3s ${EASING_FUNCTION};
    padding: 0;
    transform: ${({ active }) => (active ? "scale(1.3)" : "scale(1)")};
    will-change: transform;

    &:hover {
        background: rgba(255, 255, 255, 0.8);
        transform: ${({ active }) => (active ? "scale(1.4)" : "scale(1.2)")};
    }

    &:focus-visible {
        outline: 2px solid white;
        outline-offset: 2px;
    }

    @media (max-width: 768px) {
        width: 10px;
        height: 10px;
    }
`;

const StatusContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 600px;
    border-radius: 24px;
    text-align: center;
    padding: 2rem;
    animation: ${pulse} 2s ease infinite;

    @media (max-width: 1024px) {
        height: 500px;
    }

    @media (max-width: 768px) {
        height: 400px;
    }
`;

const LoadingContainer = styled(StatusContainer)`
    background: linear-gradient(-45deg, #f5f7fa, #e4e8f0, #f5f7fa);
    background-size: 400% 400%;
    animation: ${gradient} 3s ease infinite;
    color: #4f46e5;
`;

const ErrorContainer = styled(StatusContainer)`
    background: linear-gradient(-45deg, #fee2e2, #fecaca, #fee2e2);
    background-size: 400% 400%;
    animation: ${gradient} 3s ease infinite;
    color: #dc2626;
`;

const EmptyContainer = styled(StatusContainer)`
    background: linear-gradient(-45deg, #ecfdf5, #d1fae5, #ecfdf5);
    background-size: 400% 400%;
    animation: ${gradient} 3s ease infinite;
    color: #059669;
`;

const Spinner = styled.div`
    width: 48px;
    height: 48px;
    border: 4px solid rgba(79, 70, 229, 0.1);
    border-radius: 50%;
    border-top-color: #4f46e5;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 24px;
`;

const RetryButton = styled.button`
    margin-top: 24px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ${EASING_FUNCTION};
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    display: flex;
    align-items: center;
    gap: 8px;
    will-change: transform;

    &:hover {
        background: linear-gradient(135deg, #6366f1, #818cf8);
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(79, 70, 229, 0.4);
        animation: ${float} 1.5s ease infinite;
    }

    &:active {
        transform: translateY(0);
    }

    &:focus-visible {
        outline: 2px solid #4f46e5;
        outline-offset: 2px;
    }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5));
  z-index: 10;
  animation: ${({ active, duration }) =>
    active
        ? css`
          ${duration}ms linear 0s 1 normal none running progress
        `
        : "none"};
  transform-origin: left center;
  will-change: transform;

  @keyframes progress {
    0% {
      transform: scaleX(0);
    }
    100% {
      transform: scaleX(1);
    }
  }
`;

const StatusMessage = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  color: inherit;
`;

const StatusDescription = styled.p`
  font-size: 1rem;
  color: inherit;
  opacity: 0.8;
  max-width: 400px;
  line-height: 1.5;
`;

const SliderList = () => {
    const [sliders, setSliders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [slideDirection, setSlideDirection] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    const fetchSliders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(API_ENDPOINT);
            setSliders(data);
        } catch (err) {
            setError("Failed to load sliders. Please try again later.");
            console.error("Slider fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const goToPrevious = useCallback(() => {
        setSlideDirection("left");
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? sliders.length - 1 : prevIndex - 1
        );
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), AUTO_SLIDE_INTERVAL * 2);
    }, [sliders.length]);

    const goToNext = useCallback(() => {
        setSlideDirection("right");
        setCurrentIndex((prevIndex) =>
            prevIndex === sliders.length - 1 ? 0 : prevIndex + 1
        );
    }, [sliders.length]);

    const goToSlide = useCallback(
        (slideIndex) => {
            setSlideDirection(slideIndex > currentIndex ? "right" : "left");
            setCurrentIndex(slideIndex);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), AUTO_SLIDE_INTERVAL * 2);
        },
        [currentIndex]
    );

    useEffect(() => {
        fetchSliders();
    }, [fetchSliders]);

    useEffect(() => {
        if (sliders.length > 1 && isAutoPlaying && !isHovering) {
            const interval = setInterval(goToNext, AUTO_SLIDE_INTERVAL);
            return () => clearInterval(interval);
        }
    }, [currentIndex, sliders.length, isAutoPlaying, goToNext, isHovering]);

    if (loading) {
        return (
            <LoadingContainer>
                <Spinner aria-label="Loading sliders" />
                <StatusMessage>Loading Featured Content</StatusMessage>
                <StatusDescription>
                    Please wait while we load the best offers for you
                </StatusDescription>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <ErrorContainer>
                <StatusMessage>Something Went Wrong</StatusMessage>
                <StatusDescription>{error}</StatusDescription>
                <RetryButton onClick={fetchSliders}>
                    <FiRefreshCw size={16} />
                    Try Again
                </RetryButton>
            </ErrorContainer>
        );
    }

    if (sliders.length === 0) {
        return (
            <EmptyContainer>
                <StatusMessage>No Featured Content</StatusMessage>
                <StatusDescription>
                    Check back later for exciting offers
                </StatusDescription>
            </EmptyContainer>
        );
    }

    return (
        <SliderContainer
            aria-roledescription="carousel"
            aria-label="Featured content carousel"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {sliders.length > 1 && (
                <>
                    <LeftArrow
                        onClick={goToPrevious}
                        aria-label="Previous slide"
                    >
                        <FiChevronLeft size={24} />
                    </LeftArrow>
                    <RightArrow onClick={goToNext} aria-label="Next slide">
                        <FiChevronRight size={24} />
                    </RightArrow>
                </>
            )}

            <SliderWrapper>
                {sliders.map((slider, index) => (
                    <SliderItemWrapper
                        key={slider.id}
                        active={index === currentIndex}
                        direction={slideDirection}
                        aria-hidden={index !== currentIndex}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Slide ${index + 1} of ${sliders.length}`}
                    >
                        <SliderItem slider={slider} />
                        {index === currentIndex && isAutoPlaying && !isHovering && (
                            <ProgressBar
                                active={true}
                                duration={AUTO_SLIDE_INTERVAL}
                            />
                        )}
                    </SliderItemWrapper>
                ))}
            </SliderWrapper>

            {sliders.length > 1 && (
                <DotsContainer role="tablist" aria-label="Slide navigation">
                    {sliders.map((_, slideIndex) => (
                        <Dot
                            key={slideIndex}
                            active={slideIndex === currentIndex}
                            onClick={() => goToSlide(slideIndex)}
                            aria-label={`Go to slide ${slideIndex + 1}`}
                            role="tab"
                            aria-selected={slideIndex === currentIndex}
                            aria-controls={`slide-${slideIndex}`}
                        />
                    ))}
                </DotsContainer>
            )}
        </SliderContainer>
    );
};

SliderList.propTypes = {
    // Add any props if this component receives any
};

export default React.memo(SliderList);

