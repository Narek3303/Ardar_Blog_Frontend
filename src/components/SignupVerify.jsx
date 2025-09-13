import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

// Styled components
const VerifyWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff, #f9fbff);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: 20px;
`;

const VerifyCard = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
  text-align: center;
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.4s ease-out forwards;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08);
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${props => props.variant === 'success' ? '#10b981' :
    props.variant === 'error' ? '#ef4444' :
        props.variant === 'loading' ? '#3b82f6' : '#1f2937'};
`;

const Message = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const Spinner = styled.div`
  margin: 1.5rem auto 0;
  width: 48px;
  height: 48px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const SuccessIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #ecfdf5;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1.5s ease infinite;

  &::after {
    content: '✓';
    font-size: 2rem;
    color: #10b981;
    font-weight: bold;
  }
`;

const ErrorIcon = styled.div`
  margin: 0 auto 1.5rem;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: #fef2f2;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '✕';
    font-size: 2rem;
    color: #ef4444;
    font-weight: bold;
  }
`;

const ActionButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2563eb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function SignupVerify() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    const getQueryParam = (param) =>
        new URLSearchParams(location.search).get(param) || '';

    useEffect(() => {
        const code = getQueryParam('code');

        if (!code) {
            setStatus('error');
            setMessage('No verification code provided.');
            return;
        }

        fetch(
            `${API_BASE}/api/accounts/signup/verify/?code=${encodeURIComponent(code)}`,
            {
                method: 'GET',
                headers: { Accept: 'application/json' },
            }
        )
            .then(async (res) => {
                const data = await res.json();

                if (res.ok) {
                    setStatus('success');
                    setMessage(
                        data.success ||
                        'Your email address has been successfully verified. Welcome to our community!'
                    );
                } else {
                    // Handle manual activation or specific backend messages
                    const detail = data.detail || data.error || '';
                    if (
                        detail === 'Unable to verify user.' ||
                        detail === 'Your email is already verified.'
                    ) {
                        setStatus('success');
                        setMessage(
                            'Your email is already verified. Please continue to login.'
                        );
                    } else {
                        setStatus('error');
                        setMessage(
                            detail ||
                            'Unable to verify your account. The verification link may be invalid or expired.'
                        );
                    }
                }
            })
            .catch((err) => {
                console.error('Verification error:', err);
                setStatus('error');
                setMessage(
                    'Network error occurred. Please check your connection and try again.'
                );
            });
    }, [location.search, navigate]);

    return (
        <VerifyWrapper>
            <VerifyCard>
                {status === 'loading' && (
                    <div className="loading">
                        <Title variant="loading">Verifying Your Email</Title>
                        <Message>Please wait while we verify your email address...</Message>
                        <Spinner />
                    </div>
                )}

                {status === 'success' && (
                    <div className="success">
                        <SuccessIcon />
                        <Title variant="success">Verification Successful!</Title>
                        <Message>{message}</Message>
                        <ActionButton onClick={() => navigate('/login')}>
                            Continue to Login
                        </ActionButton>
                    </div>
                )}

                {status === 'error' && (
                    <div className="error">
                        <ErrorIcon />
                        <Title variant="error">Verification Failed</Title>
                        <Message>{message}</Message>
                        <ActionButton onClick={() => navigate('/signup')}>
                            Back to Sign Up
                        </ActionButton>
                    </div>
                )}
            </VerifyCard>
        </VerifyWrapper>
    );
}

export default SignupVerify;
