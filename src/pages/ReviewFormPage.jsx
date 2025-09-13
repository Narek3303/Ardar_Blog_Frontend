import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { StarIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../api/axiosInstance";
import styled, { keyframes } from "styled-components";
import { AlertCircle, CheckCircle } from "lucide-react";

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled Components
const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const Container = styled(motion.div)`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 2rem 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const BackButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: none;
  color: #6366f1;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: #4f46e5;
  }
`;

const ReviewCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 
              0 8px 10px -6px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-bottom: 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const CardHeader = styled.div`
  padding: 1.5rem 2rem 0;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const CardSubtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  padding: 0 2rem 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.75rem;
`;

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const StarButton = styled(motion.button)`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
  }
`;

const Star = styled(StarIcon)`
  height: 2rem;
  width: 2rem;
  color: ${({ $active }) => ($active ? "#f59e0b" : "#e5e7eb")};
  transition: all 0.2s ease;
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  margin-left: 0.5rem;
`;

const TextArea = styled(motion.textarea)`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  color: #334155;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
  resize: vertical;
  min-height: 120px;

  &:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
    background: white;
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  z-index: 1;

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
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);

    &::before {
      opacity: 1;
    }
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${rotate} 1s linear infinite;
`;

const Message = styled(motion.div)`
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ErrorMessage = styled(Message)`
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-left: 4px solid #dc2626;
`;

const SuccessMessage = styled(Message)`
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border-left: 4px solid #059669;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  overflow: hidden;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #1e293b;
`;

const ReviewsSection = styled.div`
  margin-top: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
`;

const ReviewsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ReviewItem = styled(motion.li)`
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;

  &:last-child {
    border-bottom: none;
  }
`;

const ReviewAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4f46e5;
  font-weight: 600;
  flex-shrink: 0;
`;

const ReviewContent = styled.div`
  flex: 1;
`;

const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
`;

const ReviewStars = styled.div`
  display: flex;
  margin-right: 0.5rem;
`;

const ReviewStar = styled(StarIcon)`
  height: 1rem;
  width: 1rem;
  color: #f59e0b;
`;

const ReviewName = styled.span`
  font-weight: 500;
  color: #1e293b;
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

const ReviewDate = styled.span`
  color: #64748b;
  font-size: 0.75rem;
`;

const ReviewText = styled.p`
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  padding: 2rem;

  &::after {
    content: '';
    width: 2rem;
    height: 2rem;
    border: 4px solid #e0e7ff;
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: ${rotate} 1s linear infinite;
  }
`;

const ReviewFormPage = () => {
    const { slug, productId } = useParams();
    const navigate = useNavigate();
    const { authToken, loading: authLoading } = useAuth();

    const [userProfile, setUserProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !authToken) {
            navigate("/login", { state: { from: `/product/${slug}/${productId}/review` } });
        }
    }, [authLoading, authToken, navigate, slug, productId]);

    useEffect(() => {
        axiosInstance
            .get("/users/profile/me/")
            .then(res => setUserProfile(res.data))
            .catch(err => console.error("Failed to load profile", err))
            .finally(() => setProfileLoading(false));
    }, []);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                const response = await axiosInstance.get(`/shop/reviews/${productId}/`);
                setReviews(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || "Failed to load reviews");
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setSuccess(false);

        if (rating < 1 || rating > 5) {
            setError("Rating must be between 1 and 5");
            setSubmitting(false);
            return;
        }
        if (!comment.trim()) {
            setError("Comment cannot be empty");
            setSubmitting(false);
            return;
        }

        try {
            await axiosInstance.post(`/shop/reviews/${productId}/`, {
                rating,
                comment,
                product: productId
            });

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                navigate(-1); // կամ մնա նույն էջում
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.detail || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    const buildAvatarUrl = (path) => {
        if (!path) return null;
        return /^https?:\/\//.test(path)
            ? path
            : `${process.env.REACT_APP_API_URL}${path}`;
    };

    if (authLoading || profileLoading) {
        return (
            <Container
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <LoadingSpinner />
            </Container>
        );
    }

    return (
        <Container
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="max-w-2xl mx-auto px-4">
                <BackButton
                    onClick={() => navigate(-1)}
                    whileHover={{ x: -3 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Back to Product
                </BackButton>

                <UserInfo>
                    <Avatar>
                        {buildAvatarUrl(userProfile.avatar) ? (
                            <AvatarImage
                                src={buildAvatarUrl(userProfile.avatar)}
                                alt={`${userProfile.first_name} ${userProfile.last_name}`}
                            />
                        ) : (
                            `${userProfile.first_name?.[0] || ''}${userProfile.last_name?.[0] || ''}`
                        )}
                    </Avatar>
                    <UserName>
                        {userProfile.first_name} {userProfile.last_name}
                    </UserName>
                </UserInfo>

                <ReviewCard
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                        <CardSubtitle>Your feedback helps others make better decisions!</CardSubtitle>
                    </CardHeader>

                    <Form onSubmit={handleSubmit}>
                        <AnimatePresence>
                            {error && (
                                <ErrorMessage
                                    key="error"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                >
                                    <AlertCircle className="h-5 w-5" />
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
                                    <CheckCircle className="h-5 w-5" />
                                    Review submitted successfully!
                                </SuccessMessage>
                            )}
                        </AnimatePresence>

                        <FormGroup>
                            <Label>Rating</Label>
                            <StarContainer>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarButton
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={`Rate ${star} out of 5`}
                                    >
                                        <Star $active={star <= rating} />
                                    </StarButton>
                                ))}
                                <RatingText>{rating} / 5</RatingText>
                            </StarContainer>
                        </FormGroup>

                        <FormGroup>
                            <Label>Comment</Label>
                            <TextArea
                                rows="4"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts about the product..."
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            />
                        </FormGroup>

                        <SubmitButton
                            type="submit"
                            disabled={submitting}
                            whileHover={!submitting ? { scale: 1.02 } : {}}
                            whileTap={!submitting ? { scale: 0.98 } : {}}
                        >
                            {submitting ? (
                                <>
                                    <Spinner />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Review"
                            )}
                        </SubmitButton>
                    </Form>
                </ReviewCard>

                <ReviewsSection>
                    <SectionTitle>Recent Reviews</SectionTitle>
                    {reviewsLoading ? (
                        <LoadingSpinner />
                    ) : reviews.length === 0 ? (
                        <EmptyState>No reviews yet. Be the first!</EmptyState>
                    ) : (
                        <ReviewsList>
                            {reviews.map((review) => {
                                const isCurrent = userProfile && review.user === userProfile.user;
                                const author = isCurrent ? userProfile : review.user_profile || {};
                                const name = `${author.first_name || ''} ${author.last_name || ''}`.trim() || 'Anonymous';
                                const avatarPath = author.avatar;
                                return (
                                    <ReviewItem
                                        key={review.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ReviewAvatar>
                                            {buildAvatarUrl(avatarPath) ? (
                                                <AvatarImage
                                                    src={buildAvatarUrl(avatarPath)}
                                                    alt={name}
                                                />
                                            ) : (
                                                name.split(' ').map(n => n[0]).join('').toUpperCase()
                                            )}
                                        </ReviewAvatar>
                                        <ReviewContent>
                                            <ReviewMeta>
                                                <ReviewStars>
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <ReviewStar key={i} />
                                                    ))}
                                                </ReviewStars>
                                                <ReviewName>{name}</ReviewName>
                                                <ReviewDate>
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </ReviewDate>
                                            </ReviewMeta>
                                            <ReviewText>{review.comment}</ReviewText>
                                        </ReviewContent>
                                    </ReviewItem>
                                );
                            })}
                        </ReviewsList>
                    )}
                </ReviewsSection>
            </div>
        </Container>
    );
};

export default ReviewFormPage;