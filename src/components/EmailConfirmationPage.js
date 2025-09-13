import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Փոխել useHistory → useNavigate
import axios from 'axios';
import { Box, Typography, CircularProgress } from '@mui/material';

const EmailConfirmationPage = () => {
    const { uid, token } = useParams();
    const navigate = useNavigate();  // Ճիշտ hook
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.post(`/confirm-email/`, {
                    uid,
                    token,
                });

                setMessage('Email confirmed successfully!');
                setTimeout(() => navigate('/login'), 2000); // 2 վրկ հետո ուղղորդում login էջ
            } catch (error) {
                setMessage('There was an error confirming your email.');
            } finally {
                setLoading(false);
            }
        };

        confirmEmail();
    }, [uid, token, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5">{message}</Typography>
        </Box>
    );
};

export default EmailConfirmationPage;
