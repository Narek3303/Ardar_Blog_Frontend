import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import WishlistItem from "./WishlistItem";
import styled, { keyframes } from "styled-components";
import { Heart, Loader } from "react-feather";

// ======================
// Animations
// ======================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.6; }
`;

// ======================
// Styled Components
// ======================
const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.5s ease-out forwards;
`;

const WishlistHeader = styled.h2`
  font-size: 1.75rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;
  font-weight: 600;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: #f72585;
    border-radius: 3px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px dashed #e9ecef;
  margin-top: 1rem;
`;

const EmptyHeartIcon = styled(Heart)`
  width: 64px;
  height: 64px;
  color: #adb5bd;
  margin-bottom: 1.5rem;
  stroke-width: 1.5px;
  fill: none;
`;

const EmptyMessage = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
  max-width: 500px;
`;

const ExploreButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: #3a56d4;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(67, 97, 238, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
`;

const LoadingSpinner = styled(Loader)`
  width: 48px;
  height: 48px;
  color: #4361ee;
  animation: ${pulse} 1.5s infinite ease-in-out;
`;

const LoadingMessage = styled.p`
  font-size: 1.1rem;
  color: #6c757d;
  margin-top: 1.5rem;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay for better UX
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);

        return () => clearTimeout(timer);
    }, [wishlist]);

    if (isLoading) {
        return (
            <WishlistContainer>
                <WishlistHeader>Your Wishlist</WishlistHeader>
                <LoadingState>
                    <LoadingSpinner />
                    <LoadingMessage>Loading your favorite items...</LoadingMessage>
                </LoadingState>
            </WishlistContainer>
        );
    }

    return (
        <WishlistContainer>
            <WishlistHeader>Your Wishlist</WishlistHeader>

            {wishlist.length === 0 ? (
                <EmptyState>
                    <EmptyHeartIcon />
                    <EmptyMessage>
                        Your wishlist is currently empty. Start saving your favorite items to see them here!
                    </EmptyMessage>
                    <ExploreButton>
                        Explore Products
                    </ExploreButton>
                </EmptyState>
            ) : (
                <ItemsGrid>
                    {wishlist.map((product) => (
                        <WishlistItem key={product.id} product={product} />
                    ))}
                </ItemsGrid>
            )}
        </WishlistContainer>
    );
};

export default Wishlist;