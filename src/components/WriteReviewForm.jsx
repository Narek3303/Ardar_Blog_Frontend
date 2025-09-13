import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled, { keyframes, css } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, Loader, CheckCircle, AlertCircle } from "react-feather";
import axios from "axios";
import axiosInstance from "../api/axiosInstance";


// ==============
// Animations
// ==============
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ==============
// Styled Components
// ==============
const GlassContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.4);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: 640px;
  margin: 2rem auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  position: relative;

  &:hover {
    box-shadow:
      0 16px 56px rgba(0, 0, 0, 0.12),
      inset 0 0 0 1px rgba(255, 255, 255, 0.6);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      rgba(99, 102, 241, 0.05) 0%,
      rgba(168, 85, 247, 0.05) 50%,
      rgba(99, 102, 241, 0.05) 100%
    );
    animation: ${gradientFlow} 12s ease infinite;
    z-index: -1;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1.75rem;
  position: relative;
  display: inline-block;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  padding-bottom: 0.5rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6);
    border-radius: 4px;
    transition: width 0.4s ease;
  }

  &:hover::after {
    width: 100px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const StarButton = styled(motion.button).attrs({ type: "button" })`
  background: none;
  border: none;
  font-size: 0;
  cursor: pointer;
  padding: 0.5rem;
  color: ${({ active }) => (active ? "#f59e0b" : "#d1d5db")};
  transition: all 0.3s ease;

  svg {
    width: 28px;
    height: 28px;
    fill: ${({ active }) => (active ? "currentColor" : "none")};
    stroke: currentColor;
    stroke-width: ${({ active }) => (active ? "0" : "2px")};
  }

  &:hover {
    color: #f59e0b;
    transform: scale(1.2);
  }
`;

const RatingValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #4b5563;
  margin-left: 0.75rem;
  min-width: 40px;
`;

const TextArea = styled(motion.textarea)`
  width: 100%;
  padding: 1.25rem;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.6;
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 140px;
  font-family: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    background: white;
  }

  &::placeholder {
    color: #9ca3af;
    opacity: 1;
  }
`;

const MessageContainer = styled(motion.div)`
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const ErrorMessage = styled(MessageContainer)`
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
`;

const SuccessMessage = styled(MessageContainer)`
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
`;

const SubmitButton = styled(motion.button).attrs({ type: "submit" })`
  padding: 1.25rem 2rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  overflow: hidden;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6, #6366f1);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(99, 102, 241, 0.4);

    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    box-shadow: 0 4px 16px rgba(99, 102, 241, 0.2);
  }
`;

const Spinner = styled(Loader)`
  animation: ${rotate} 1s linear infinite;
  width: 20px;
  height: 20px;
`;

const UserProfile = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(249, 250, 251, 0.8);
  border-radius: 12px;
  margin-bottom: 1rem;
`;

const Avatar = styled(motion.div)`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #111827;
`;

const UserEmail = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
`;

// ==============
// Components
// ==============
const StarRating = ({ rating, setRating }) => (
    <StarsContainer>
        {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
                key={star}
                onClick={() => setRating(star)}
                active={rating >= star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Rate ${star} out of 5`}
            >
                <Star />
            </StarButton>
        ))}
        <RatingValue>{rating}/5</RatingValue>
    </StarsContainer>
);

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired,
};

// ==============
// Main Component
// ==============
const WriteReviewForm = ({ productId }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);

    useEffect(() => {
        axiosInstance.get("/users/profile/me/")
            .then(res => {
                setUserProfile(res.data);
            })
            .catch(err => console.error(err))
            .finally(() => setProfileLoading(false));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating < 1 || rating > 5) {
            setError("Please select a rating between 1 and 5 stars");
            return;
        }

        if (!comment.trim()) {
            setError("Please share your thoughts in the review");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await axios.post(
                `/shop/reviews/${productId}/`,
                { product: productId, rating, comment },
                {
                    headers: {
                        Authorization: `Token ${localStorage.getItem("authToken")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setSuccess("Thank you for your review! It has been submitted successfully.");
            setRating(5);
            setComment("");

            // Clear success message after 5 seconds
            setTimeout(() => setSuccess(null), 5000);
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to submit review. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getUserInitials = (name) => {
        if (!name) return <User size={24} />;
        const parts = name.split(' ');
        return parts.map(p => p[0]).join('').toUpperCase();
    };

    return (
        <GlassContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <Title>Share Your Experience</Title>

            {/* User Profile Section */}
            {!profileLoading && (
                <UserProfile
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Avatar whileHover={{ scale: 1.05 }}>
                        {userProfile?.avatar_url ? (
                            <img
                                src={userProfile.avatar_url}
                                alt={`${userProfile.first_name} ${userProfile.last_name}`}
                            />
                        ) : (
                            getUserInitials(`${userProfile?.first_name} ${userProfile?.last_name}`)
                        )}
                    </Avatar>
                    <UserInfo>
                        <UserName>
                            {userProfile
                                ? `${userProfile.first_name} ${userProfile.last_name}`
                                : "Anonymous User"}
                        </UserName>
                        {userProfile?.email && (
                            <UserEmail>{userProfile.email}</UserEmail>
                        )}
                    </UserInfo>
                </UserProfile>
            )}

            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label>
                        <Star size={18} /> Your Rating
                    </Label>
                    <StarRating rating={rating} setRating={setRating} />
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="comment">Your Review</Label>
                    <TextArea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What did you like or dislike about this product? Would you recommend it?"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    />
                </FormGroup>

                <AnimatePresence>
                    {error && (
                        <ErrorMessage
                            key="error"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AlertCircle size={18} />
                            {error}
                        </ErrorMessage>
                    )}

                    {success && (
                        <SuccessMessage
                            key="success"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <CheckCircle size={18} />
                            {success}
                        </SuccessMessage>
                    )}
                </AnimatePresence>

                <SubmitButton
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                >
                    {loading ? (
                        <>
                            <Spinner /> Submitting...
                        </>
                    ) : (
                        "Submit Review"
                    )}
                </SubmitButton>
            </Form>
        </GlassContainer>
    );
};

WriteReviewForm.propTypes = {
    productId: PropTypes.string.isRequired,
};

export default WriteReviewForm;
