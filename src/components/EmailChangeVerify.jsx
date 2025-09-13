import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import styled, { keyframes } from 'styled-components';
import { FiCheckCircle, FiAlertCircle, FiMail, FiUser, FiHome } from 'react-icons/fi';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  padding: 3rem;
  width: 100%;
  max-width: 480px;
  text-align: center;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const StatusMessage = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 12px;
  animation: ${fadeIn} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  line-height: 1.6;

  &.loading {
    color: #334155;
  }

  &.success {
    background: #f0fdf4;
    color: #16a34a;
    animation: ${pulse} 2s infinite;
  }

  &.error {
    background: #fef2f2;
    color: #dc2626;
  }
`;

const MessageText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4f46e5'};
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #4f46e5'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  min-width: 160px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.variant === 'primary' ? '0 5px 15px rgba(79, 70, 229, 0.3)' : '0 5px 15px rgba(79, 70, 229, 0.1)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

const SuccessIcon = styled(FiCheckCircle)`
  font-size: 3rem;
  color: #16a34a;
  animation: ${float} 2s ease-in-out infinite;
`;

const ErrorIcon = styled(FiAlertCircle)`
  font-size: 3rem;
  color: #dc2626;
`;

const LoadingSpinner = styled.div`
  width: 2rem;
  height: 2rem;
  border: 3px solid rgba(79, 70, 229, 0.2);
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

function EmailChangeVerify() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const code = params.get('code') || '';

    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setMessage('No verification code provided in the URL.');
            return;
        }

        axiosInstance
            .get(`/api/accounts/email/change/verify/?code=${encodeURIComponent(code)}`)
            .then((res) => {
                setStatus('success');
                setMessage(res.data.success || 'Your email address has been successfully updated. All future communications will be sent to your new email.');
            })
            .catch((err) => {
                console.error('Email change verify error:', err);
                const detail = err.response?.data?.detail;
                setStatus('error');
                setMessage(
                    detail || 'The verification link is invalid or has expired. Please request a new email change verification.'
                );
            });
    }, [code]);

    return (
        <Container>
            <Card>
                <Title>
                    <FiMail size={28} />
                    Email Change Verification
                </Title>

                {status === 'loading' && (
                    <StatusMessage className="loading">
                        <LoadingSpinner />
                        <MessageText>Verifying your email change request...</MessageText>
                    </StatusMessage>
                )}

                {code && (
                    <>
                        <StatusMessage className="success">
                            <SuccessIcon />
                            <MessageText>{message}</MessageText>
                        </StatusMessage>
                        <ActionButton
                            variant="primary"
                            onClick={() => navigate('/profile')}
                        >
                            <FiUser />
                            Go to Profile
                        </ActionButton>
                    </>
                )}

                {!code && (
                    <>
                        <StatusMessage className="error">
                            <ErrorIcon />
                            <MessageText>{message}</MessageText>
                        </StatusMessage>
                        <ActionButton
                            onClick={() => navigate('/')}
                        >
                            <FiHome />
                            Back to Home
                        </ActionButton>
                    </>
                )}
            </Card>
        </Container>
    );
}

export default EmailChangeVerify;