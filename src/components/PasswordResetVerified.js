import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const PasswordResetVerified = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code') || '';  // Extracting code from URL query

    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('api/accounts/password/reset/verify/', { code, password });
            setSuccess('Password successfully reset.');
            setTimeout(() => navigate('/login'), 2000);  // Redirect to login page after 2 seconds
        } catch (err) {
            setError('Error occurred while resetting the password.');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" gutterBottom>Password Reset</Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            {success && <Typography color="primary" sx={{ mb: 2 }}>{success}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                    required
                    margin="normal"
                    value={password}
                    onChange={handleChange}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Reset Password
                </Button>
            </form>
        </Box>
    );
};

export default PasswordResetVerified;
