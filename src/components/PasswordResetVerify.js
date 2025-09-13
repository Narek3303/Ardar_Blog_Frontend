import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_BASE = process.env.REACT_APP_API_BASE_URL || '';

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

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

// Styled components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 2rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  animation: ${fadeIn} 0.5s ease-out;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1.5rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const PasswordIcon = styled(FiLock)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const Button = styled.button`
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #3182ce;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &.error {
    background: #fff5f5;
    color: #e53e3e;
  }

  &.success {
    background: #f0fff4;
    color: #38a169;
    animation: ${pulse} 1.5s infinite;
  }

  &.loading {
    color: #4a5568;
  }
`;

const SuccessIcon = styled(FiCheckCircle)`
  color: #38a169;
  font-size: 1.5rem;
  animation: ${bounce} 1s;
`;

const ErrorIcon = styled(FiAlertCircle)`
  color: #e53e3e;
  font-size: 1.5rem;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(66, 153, 225, 0.2);
  border-top: 3px solid #4299e1;
  border-radius: 50%;
  animation: ${keyframes`
    to { transform: rotate(360deg); }
  `} 1s linear infinite;
`;

function PasswordResetVerify() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const code = params.get('code') || '';

    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!code) {
            setStatus('error');
            setMessage('No password reset code provided in the URL.');
        }
    }, [code]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code) return;

        setStatus('submitting');
        setMessage('');

        try {
            const res = await axios.post(
                `/api/accounts/password/reset/verified/`,
                { code, password },
                { headers: { Accept: 'application/json' } }
            );

            if (res.status === 200) {
                setStatus('success');
                setMessage('Password successfully updated! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                throw new Error(res.data.detail || 'Unable to reset password.');
            }
        } catch (err) {
            console.error('Password reset verify error:', err);
            setStatus('error');
            setMessage(
                err.response?.data?.detail ||
                'Error verifying code or updating password. Please try again.'
            );
        }
    };

    return (
        <Container>
            <Card>
                <Title>
                    <FiLock size={24} />
                    Reset Password
                </Title>

                {status === 'idle' && !code && (
                    <StatusMessage className="error">
                        <ErrorIcon />
                        {message}
                    </StatusMessage>
                )}

                {status === 'submitting' && (
                    <StatusMessage className="loading">
                        <Spinner />
                        Updating your password...
                    </StatusMessage>
                )}

                {status === 'success' && (
                    <StatusMessage className="success">
                        <SuccessIcon />
                        {message}
                    </StatusMessage>
                )}

                {(status === 'idle' || status === 'error') && code && (
                    <>
                        {status === 'error' && (
                            <StatusMessage className="error">
                                <ErrorIcon />
                                {message}
                            </StatusMessage>
                        )}

                        <Form onSubmit={handleSubmit}>
                            <InputWrapper>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="8"
                                />
                                <PasswordIcon />
                            </InputWrapper>

                            <Button type="submit" disabled={status === 'submitting'}>
                                {status === 'submitting' ? (
                                    <>
                                        <Spinner />
                                        Processing...
                                    </>
                                ) : (
                                    'Reset Password'
                                )}
                            </Button>
                        </Form>
                    </>
                )}
            </Card>
        </Container>
    );
}

export default PasswordResetVerify;