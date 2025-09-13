import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../api/axiosInstance';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

// Premium Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const gradientBackground = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(66, 153, 225, 0); }
  100% { box-shadow: 0 0 0 0 rgba(66, 153, 225, 0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Glassmorphism Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 20px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 
    0 10px 25px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  will-change: transform;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 15px 30px rgba(0, 0, 0, 0.15),
      inset 0 0 0 1px rgba(255, 255, 255, 0.7);
  }
`;

const LoginContent = styled.div`
  padding: 40px;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const LoginTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 10px;
  background: linear-gradient(90deg, #3182ce, #4c51bf);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${gradientBackground} 6s ease infinite;
  background-size: 200% 200%;
`;

const LoginSubtitle = styled.p`
  color: #4a5568;
  font-size: 16px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(5px);
  will-change: transform;

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: linear-gradient(to right, #3182ce, #4c51bf);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
  will-change: transform;

  &:hover {
    background: linear-gradient(to right, #2b6cb0, #434190);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(66, 153, 225, 0.4);
  }

  &:disabled {
    background: #a0aec0;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ButtonLoading = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Spinner = styled.svg`
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
`;

const SpinnerPath = styled.circle`
  stroke: white;
  stroke-linecap: round;
  stroke-dasharray: 150;
  stroke-dashoffset: 10;
  fill: none;
  stroke-width: 5;
`;

const Message = styled(motion.div)`
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ErrorMessage = styled(Message)`
  background-color: rgba(255, 245, 245, 0.9);
  color: #c53030;
  border: 1px solid #fed7d7;
`;

const SuccessMessage = styled(Message)`
  background-color: rgba(240, 255, 244, 0.9);
  color: #2f855a;
  border: 1px solid #c6f6d5;
`;

const LoginFooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  margin-top: 25px;
  font-size: 14px;
`;

const FooterLink = styled.a`
  color: #4299e1;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  padding: 0 5px;

  &:hover {
    color: #3182ce;
    text-decoration: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: left;
  }
`;

const RegisterText = styled.p`
  color: #4a5568;
`;

const FloatingDecoration = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.1), rgba(76, 81, 191, 0.1));
  animation: ${float} 6s ease-in-out infinite;
  z-index: -1;

  &:nth-child(1) {
    top: 10%;
    left: 10%;
    width: 80px;
    height: 80px;
    animation-delay: 0s;
  }

  &:nth-child(2) {
    bottom: 15%;
    right: 10%;
    width: 120px;
    height: 120px;
    animation-delay: 1s;
  }

  &:nth-child(3) {
    top: 50%;
    left: 20%;
    width: 60px;
    height: 60px;
    animation-delay: 2s;
  }
`;

const LoginFormComponent = () => {
    const { loginUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || '/';

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        if (!formData.email || !formData.password) {
            setError('Email and password are required');
            toast.error('Email and password are required');
            setIsLoading(false);
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            toast.error('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/api/accounts/login/', formData);
            const { token } = response.data;

            loginUser(token);
            setSuccess('Login successful. Redirecting...');
            toast.success('Login successful 🎉', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                navigate(from, { replace: true });
            }, 2000);
        } catch (err) {
            let message = 'Something went wrong. Please try again.';
            if (err.response?.data?.detail) {
                message = err.response.data.detail;
            }
            setError(message);
            toast.error(message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setIsLoading(false);
        }
    };

    return (
        <LoginContainer>
            <FloatingDecoration />
            <FloatingDecoration />
            <FloatingDecoration />

            <LoginCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <LoginContent>
                    <LoginHeader>
                        <LoginTitle>Welcome Back</LoginTitle>
                        <LoginSubtitle>Enter your credentials to access your account</LoginSubtitle>
                    </LoginHeader>

                    <LoginForm onSubmit={handleSubmit}>
                        <FormGroup>
                            <InputLabel htmlFor="email">Email Address</InputLabel>
                            <LoginInput
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                            />
                        </FormGroup>

                        <FormGroup>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <LoginInput
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                            />
                        </FormGroup>

                        {error && (
                            <ErrorMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {error}
                            </ErrorMessage>
                        )}
                        {success && (
                            <SuccessMessage
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {success}
                            </SuccessMessage>
                        )}

                        <LoginButton
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading ? (
                                <ButtonLoading>
                                    <Spinner viewBox="0 0 50 50">
                                        <SpinnerPath cx="25" cy="25" r="20" />
                                    </Spinner>
                                    Signing In...
                                </ButtonLoading>
                            ) : (
                                'Sign In'
                            )}
                        </LoginButton>
                    </LoginForm>

                    <LoginFooterLinks>
                        <FooterLink href="/password/reset">
                            Forgot your password?
                        </FooterLink>
                        <RegisterText>
                            Don't have an account? <FooterLink href="/register">Sign up</FooterLink>
                        </RegisterText>
                    </LoginFooterLinks>
                </LoginContent>
            </LoginCard>
        </LoginContainer>
    );
};

export default LoginFormComponent;
