import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FiMail, FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

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

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
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
  position: relative;
  overflow: hidden;

  &:hover {
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
  padding: 1rem 1rem 1rem 2.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const EmailIcon = styled(FiMail)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
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
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -60%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: rotate(30deg);
    transition: all 0.3s;
  }

  &:hover::after {
    left: 100%;
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
  line-height: 1.5;

  &.error {
    background: #fff5f5;
    color: #e53e3e;
  }

  &.success {
    background: #f0fff4;
    color: #38a169;
    animation: ${pulse} 2s infinite;
  }

  &.sending {
    color: #4a5568;
  }
`;

const SuccessIcon = styled(FiCheckCircle)`
  color: #38a169;
  font-size: 1.5rem;
  animation: ${float} 2s ease-in-out infinite;
`;

const ErrorIcon = styled(FiAlertCircle)`
  color: #e53e3e;
  font-size: 1.5rem;
`;

const SendIcon = styled(FiSend)`
  transition: all 0.3s ease;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: ${keyframes`
    to { transform: rotate(360deg); }
  `} 1s linear infinite;
`;

function PasswordResetRequest() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setMessage('');

        try {
            const res = await axios.post(
                `${API_BASE}/api/accounts/password/reset/`,
                { email },
                { headers: { Accept: 'application/json' } }
            );

            if (res.status === 201) {
                setStatus('success');
                setMessage(
                    'If an account exists with this email, you will receive a password reset link shortly.'
                );
            } else {
                throw new Error(res.data.detail || 'Unable to send reset link.');
            }
        } catch (err) {
            console.error('Password reset request error:', err);
            setStatus('error');
            setMessage(
                err.response?.data?.detail ||
                'An error occurred while processing your request. Please try again.'
            );
        }
    };

    return (
        <Container>
            <Card>
                <Title>
                    <FiMail size={24} />
                    Reset Password
                </Title>

                {status === 'sending' && (
                    <StatusMessage className="sending">
                        <Spinner />
                        Sending reset link...
                    </StatusMessage>
                )}

                {status === 'success' ? (
                    <StatusMessage className="success">
                        <SuccessIcon />
                        {message}
                    </StatusMessage>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <EmailIcon />
                            <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputWrapper>

                        <Button type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? (
                                <>
                                    <Spinner />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <SendIcon />
                                    Send Reset Link
                                </>
                            )}
                        </Button>

                        {status === 'error' && (
                            <StatusMessage className="error">
                                <ErrorIcon />
                                {message}
                            </StatusMessage>
                        )}
                    </Form>
                )}
            </Card>
        </Container>
    );
}

export default PasswordResetRequest;
