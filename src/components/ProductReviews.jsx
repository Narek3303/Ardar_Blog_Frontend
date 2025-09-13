import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from '@heroicons/react/24/solid';
import styled from 'styled-components';
import axiosInstance from '../api/axiosInstance';

const ProductReviews = ({ reviews = [] }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        axiosInstance
            .get('/users/profile/me/')
            .then(res => setUserProfile(res.data))
            .catch(() => setUserProfile(null))
            .finally(() => setLoadingProfile(false));
    }, []);

    return (
        <ReviewsContainer>
            <ReviewsHeader>
                <h3>Customer Reviews</h3>
                <ReviewCount>
                    {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </ReviewCount>
            </ReviewsHeader>

            {reviews.length > 0 ? (
                <ReviewsList>
                    {reviews.map(review => {
                        // review.user_profile comes from nested serializer
                        const profile = review.user_profile || {};
                        const isCurrentUser =
                            userProfile && review.user === userProfile.user; // or compare IDs: review.user === userProfile.user

                        const authorFirst = isCurrentUser
                            ? userProfile.first_name
                            : profile.first_name;
                        const authorLast = isCurrentUser
                            ? userProfile.last_name
                            : profile.last_name;
                        const authorName = `${authorFirst || ''} ${authorLast || ''}`.trim() || 'Anonymous';

                        const avatarUrl = isCurrentUser
                            ? userProfile.avatar
                            : profile.avatar;

                        return (
                            <ReviewItem
                                key={review.id}
                                as={motion.div}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <ReviewMeta>
                                    <ReviewRating>
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`star ${i < review.rating ? 'filled' : ''}`}
                                            />
                                        ))}
                                    </ReviewRating>

                                    {!loadingProfile && (
                                        <AuthorInfo>
                                            {avatarUrl ? (
                                                <AvatarImg src={avatarUrl} alt={authorName} />
                                            ) : (
                                                <AvatarPlaceholder>
                                                    {authorName
                                                        .split(' ')
                                                        .map(n => n[0])
                                                        .join('')
                                                        .toUpperCase()}
                                                </AvatarPlaceholder>
                                            )}
                                            <ReviewAuthor>{authorName}</ReviewAuthor>
                                        </AuthorInfo>
                                    )}

                                    {review.created_at && (
                                        <ReviewDate>
                                            {new Date(review.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </ReviewDate>
                                    )}
                                </ReviewMeta>
                                <ReviewComment>{review.comment}</ReviewComment>
                            </ReviewItem>
                        );
                    })}
                </ReviewsList>
            ) : (
                <NoReviews>
                    <NoReviewsIcon>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    </NoReviewsIcon>
                    <p>No reviews yet</p>
                    <WriteReviewPrompt>Be the first to write a review!</WriteReviewPrompt>
                </NoReviews>
            )}
        </ReviewsContainer>
    );
};

export default ProductReviews;

// Styled Components
const ReviewsContainer = styled.div`
    margin-top: 3rem;
    padding: 2rem;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const ReviewsHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;

    h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
        margin: 0;
    }
`;

const ReviewCount = styled.span`
    font-size: 0.9rem;
    color: #666;
    background-color: #f5f5f5;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
`;

const ReviewsList = styled.div`
    display: grid;
    gap: 2rem;
`;

const ReviewItem = styled.div`
    padding: 1.5rem;
    background-color: #fafafa;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f5f5f5;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }
`;

const ReviewMeta = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
`;

const ReviewRating = styled.div`
    display: flex;
    gap: 0.2rem;

    .star {
        width: 18px;
        height: 18px;
        color: #e0e0e0;

        &.filled {
            color: #ffb400;
        }
    }
`;

const AuthorInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const AvatarImg = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
`;

const AvatarPlaceholder = styled.div`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #6b7280;
`;

const ReviewAuthor = styled.span`
    font-weight: 500;
    color: #444;
`;

const ReviewDate = styled.span`
    font-size: 0.85rem;
    color: #888;
`;

const ReviewComment = styled.p`
    margin: 0;
    line-height: 1.6;
    color: #333;
`;

const NoReviews = styled.div`
    text-align: center;
    padding: 2rem;
    color: #666;
`;

const NoReviewsIcon = styled.div`
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
    color: #e0e0e0;

    svg {
        width: 100%;
        height: 100%;
    }
`;

const WriteReviewPrompt = styled.div`
    margin-top: 1rem;
    font-weight: 500;
    color: #3a86ff;
`;
