import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Styled Components
const SliderItemContainer = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
  will-change: transform;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SliderImage = styled(motion.img).attrs((props) => ({
    whileHover: { scale: 1.03 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}))`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.95) contrast(1.05);
  transition: filter 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  ${SliderItemContainer}:hover & {
    filter: brightness(1) contrast(1);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
`;

const SliderTitle = styled(motion.h3)`
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: white;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  margin: 0;
  z-index: 2;
  max-width: 80%;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    bottom: 1.5rem;
    left: 1.5rem;
  }
`;

const PlaceholderContainer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.2rem;
`;

const SliderItem = ({ slider }) => {
    const handleImageError = (e) => {
        e.target.src = '/placeholder-slider.jpg';
        e.target.alt = 'Placeholder image';
    };

    return (
        <SliderItemContainer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <ImageContainer>
                {slider.image ? (
                    <SliderImage
                        src={slider.image}
                        alt={slider.name || 'Slider content'}
                        loading="lazy"
                        onError={handleImageError}
                    />
                ) : (
                    <PlaceholderContainer>
                        Featured Content
                    </PlaceholderContainer>
                )}

                {slider.overlay && <ImageOverlay />}
            </ImageContainer>

            {slider.name && (
                <SliderTitle
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {slider.name}
                </SliderTitle>
            )}
        </SliderItemContainer>
    );
};

SliderItem.propTypes = {
    slider: PropTypes.shape({
        image: PropTypes.string,
        name: PropTypes.string,
        overlay: PropTypes.bool
    }).isRequired
};

export default SliderItem;