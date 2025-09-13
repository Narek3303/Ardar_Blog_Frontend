import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import styled, { keyframes } from 'styled-components';
import { FiMail, FiSend, FiCheckCircle, FiAlertCircle, FiArrowRight } from 'react-icons/fi';

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

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
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
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
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

const SubmitButton = styled.button`
  background: linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%);
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
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(79, 70, 229, 0.3);
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
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.5s;
  }

  &:hover::after {
    left: 100%;
  }
`;

const StatusMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  animation: ${fadeIn} 0.4s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  line-height: 1.6;

  &.sending {
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

const SuccessIcon = styled(FiCheckCircle)`
  font-size: 3rem;
  color: #16a34a;
  animation: ${float} 2s ease-in-out infinite;
`;

const ErrorIcon = styled(FiAlertCircle)`
  font-size: 3rem;
  color: #dc2626;
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

function EmailChangeRequest() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | success | error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        setMessage('');

        try {
            const res = await axiosInstance.post('/api/accounts/email/change/', { email });

            if (res.status === 201) {
                setStatus('success');
                setMessage(`A confirmation link has been sent to ${email}. Please check your inbox and follow the instructions to complete your email change.`);
            } else {
                throw new Error(res.data.detail || 'Unable to initiate email change.');
            }
        } catch (err) {
            console.error('Email change request error:', err);
            setStatus('error');
            setMessage(err.response?.data?.detail || 'An error occurred while processing your request. Please try again later.');
        }
    };

    return (
        <Container>
            <Card>
                <Title>
                    <FiMail size={28} />
                    Change Email Address
                </Title>

                {status === 'sending' && (
                    <StatusMessage className="sending">
                        <Spinner />
                        <MessageText>Sending confirmation email...</MessageText>
                    </StatusMessage>
                )}

                {status === 'success' ? (
                    <StatusMessage className="success">
                        <SuccessIcon />
                        <MessageText>{message}</MessageText>
                    </StatusMessage>
                ) : (
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <EmailIcon />
                            <Input
                                type="email"
                                placeholder="Enter your new email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputWrapper>

                        <SubmitButton type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? (
                                <>
                                    <Spinner />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FiSend />
                                    Request Email Change
                                </>
                            )}
                        </SubmitButton>

                        {status === 'error' && (
                            <StatusMessage className="error">
                                <ErrorIcon />
                                <MessageText>{message}</MessageText>
                            </StatusMessage>
                        )}
                    </Form>
                )}
            </Card>
        </Container>
    );
}

export default EmailChangeRequest;