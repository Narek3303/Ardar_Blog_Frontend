import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axiosInstance from '../api/axiosInstance';




// Animation for loading state
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components
const LogoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100px;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  position: relative;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #ff5252, #ff7676);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: ${spin} 1s ease-in-out infinite;
`;

const ButtonText = styled.span`
  visibility: ${props => props.isLoading ? 'hidden' : 'visible'};
`;

const ErrorMessage = styled.p`
  color: #ff3333;
  background-color: #ffe6e6;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin: 0;
  text-align: center;
  max-width: 300px;
`;

const Logout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get('/api/accounts/logout/');

            if (response.status === 200) {
                localStorage.removeItem('token'); // Եթե token-ը պահած ես, մաքրենք
                navigate('/login');
            }
        } catch (err) {
            setError('Դուրս գալը ձախողվեց։ Փորձեք կրկին։');
        } finally {
            setLoading(false);
        }
    };

    return (
        <LogoutContainer>
            <LogoutButton onClick={handleLogout} disabled={loading}>
                {loading && <LoadingSpinner />}
                <ButtonText isLoading={loading}>
                    {loading ? 'Դուրս գալու գործընթացում...' : 'Դուրս գալ'}
                </ButtonText>
            </LogoutButton>
            {error && <ErrorMessage>{error}</ErrorMessage>}
        </LogoutContainer>
    );
};

export default Logout;