// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MoonLoader } from 'react-spinners';
import styled, { keyframes } from 'styled-components';

// Styled components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const LoadingText = styled.div`
  margin-top: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #4a5568;
  font-size: 1.25rem;
  font-weight: 500;
  animation: ${fadeIn} 0.5s ease-out;
`;

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await axiosInstance.get('api/accounts/users/me/');
                setUser(response.data);  // ✅ ոչ թե response.data.user
                setAuthToken(localStorage.getItem('authToken'));
            } catch (error) {
                console.error('Error verifying user:', error);
                setUser(null);
                setAuthToken(null);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('authToken');
        if (token) {
            verifyUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loginUser = async (access_token) => {
        localStorage.setItem('authToken', access_token);
        setAuthToken(access_token);

        try {
            const response = await axiosInstance.get('api/accounts/users/me/');
            setUser(response.data); // ✅ պարզապես data, այլ ոչ թե data.user
        } catch (error) {
            console.error('User fetch failed:', error);
            setUser(null);
        }

        toast.success('Ողջույն! Հաջողությամբ մուտք գործեցիք', {
            position: 'top-right',
            autoClose: 3000,
        });
    };

    const logoutUser = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        toast.info('Հաջողությամբ դուրս եք գործել', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
        window.location.href = '/login';
    };

    const value = {
        authToken,
        user,
        loginUser,
        logoutUser,
        loading,
        isAuthenticated: !!authToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <LoadingContainer>
                    <MoonLoader color="#4a5568" size={60} speedMultiplier={0.8} />
                    <LoadingText>Խնդրում ենք սպասել...</LoadingText>
                </LoadingContainer>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
