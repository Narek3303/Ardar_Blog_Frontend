import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled, useTheme, alpha, keyframes } from '@mui/material/styles';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    IconButton,
    CircularProgress,
    Alert,
    Link,
    Fade,
    Slide,
    Paper,
    Grid
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    ArrowBack,
    Celebration
} from '@mui/icons-material';

// Floating animation with subtle bounce
const floatAnimation = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
    100% { transform: translateY(0px); }
`;

// Particle animation for background
const particleAnimation = keyframes`
  0% { transform: translateY(0) translateX(0); opacity: 1; }
  100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
`;

// Glass morphism effect with refined styling
const GlassPaper = styled(Paper)(({ theme }) => ({
    background: alpha(theme.palette.background.paper, 0.85),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: `
        0 8px 32px ${alpha(theme.palette.primary.main, 0.18)},
        0 4px 12px ${alpha(theme.palette.secondary.main, 0.12)}
    `,
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    animation: `${floatAnimation} 8s ease-in-out infinite`,
    transition: 'all 0.4s ease',
    '&:hover': {
        boxShadow: `
            0 12px 40px ${alpha(theme.palette.primary.main, 0.25)},
            0 6px 16px ${alpha(theme.palette.secondary.main, 0.15)}
        `,
    },
    '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, 
            ${theme.palette.primary.main} 0%, 
            ${theme.palette.secondary.main} 50%, 
            ${theme.palette.primary.main} 100%)`,
        backgroundSize: '200% auto',
        animation: `${keyframes`
            0% { background-position: 0% center; }
            100% { background-position: 200% center; }
        `} 3s linear infinite`
    },
    '&:after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        borderRadius: '20px',
        padding: '1px',
        background: `linear-gradient(45deg, 
            ${alpha(theme.palette.primary.main, 0.2)}, 
            ${alpha(theme.palette.secondary.main, 0.2)})`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none'
    }
}));

// Floating label with smoother transitions
const FloatingLabelTextField = styled(TextField)(({ theme }) => ({
    '& label': {
        color: alpha(theme.palette.text.primary, 0.7),
        transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)'
    },
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
        transform: 'translate(14px, -9px) scale(0.75)'
    },
    '& .MuiInputLabel-outlined': {
        transform: 'translate(14px, 16px) scale(1)'
    },
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        '& fieldset': {
            borderColor: alpha(theme.palette.divider, 0.3),
            borderWidth: '1px'
        },
        '&:hover fieldset': {
            borderColor: alpha(theme.palette.primary.light, 0.5),
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.light, 0.1)}`
        },
        '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1.5px',
            boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.15)}`
        }
    },
    '& .MuiInputBase-input': {
        padding: '12px 14px',
        fontSize: '0.9rem'
    }
}));

// Cosmic background with particles
const CosmicBackground = styled(Box)(({ theme }) => ({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(3),
    background: `
        radial-gradient(circle at 15% 25%, ${alpha(theme.palette.primary.light, 0.12)} 0%, transparent 25%),
        radial-gradient(circle at 85% 75%, ${alpha(theme.palette.secondary.light, 0.12)} 0%, transparent 25%),
        linear-gradient(145deg, 
            ${theme.palette.background.default} 0%, 
            ${alpha(theme.palette.primary.dark, 0.08)} 50%, 
            ${theme.palette.background.default} 100%)
    `,
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
        content: '""',
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        right: '-50%',
        bottom: '-50%',
        background: `
            radial-gradient(circle, ${alpha(theme.palette.common.white, 0.02)} 1px, transparent 1px),
            radial-gradient(circle, ${alpha(theme.palette.common.white, 0.02)} 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px, 60px 60px',
        animation: `${keyframes`
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        `} 300s linear infinite`,
        opacity: 0.4,
        zIndex: -1
    },
    '& .particle': {
        position: 'absolute',
        background: alpha(theme.palette.common.white, 0.4),
        borderRadius: '50%',
        animation: `${particleAnimation} 15s linear infinite`,
        zIndex: -1
    }
}));

// Neumorphic button with depth effect
const NeumorphicButton = styled(Button)(({ theme }) => ({
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '12px',
    padding: theme.spacing(1.5, 3),
    fontSize: '0.95rem',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'none',
    transition: 'all 0.3s ease',
    background: theme.palette.mode === 'light'
        ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.default, 0.9)} 100%)`
        : alpha(theme.palette.background.paper, 0.9),
    color: theme.palette.text.primary,
    boxShadow: theme.palette.mode === 'light'
        ? `8px 8px 16px ${alpha(theme.palette.common.black, 0.1)},
          -8px -8px 16px ${alpha(theme.palette.common.white, 0.8)}`
        : `8px 8px 16px ${alpha(theme.palette.common.black, 0.3)},
          -8px -8px 16px ${alpha(theme.palette.common.black, 0.2)}`,
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.palette.mode === 'light'
            ? `12px 12px 24px ${alpha(theme.palette.common.black, 0.15)},
              -12px -12px 24px ${alpha(theme.palette.common.white, 0.9)}`
            : `12px 12px 24px ${alpha(theme.palette.common.black, 0.4)},
              -12px -12px 24px ${alpha(theme.palette.common.black, 0.3)}`,
        background: theme.palette.mode === 'light'
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.default, 0.95)} 100%)`
            : alpha(theme.palette.background.paper, 0.95)
    },
    '&:active': {
        transform: 'translateY(1px)',
        boxShadow: theme.palette.mode === 'light'
            ? `4px 4px 8px ${alpha(theme.palette.common.black, 0.1)},
              -4px -4px 8px ${alpha(theme.palette.common.white, 0.7)}`
            : `4px 4px 8px ${alpha(theme.palette.common.black, 0.3)},
              -4px -4px 8px ${alpha(theme.palette.common.black, 0.1)}`
    },
    '&.Mui-disabled': {
        color: alpha(theme.palette.text.secondary, 0.5),
        boxShadow: 'none',
        background: alpha(theme.palette.action.disabledBackground, 0.5)
    }
}));

// Success animation
const confettiAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
`;

const Confetti = styled(Box)(({ theme, color }) => ({
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: color,
    opacity: 0,
    animation: `${confettiAnimation} 2s ease-out forwards`,
    borderRadius: '50%'
}));

const UserRegistrationForm = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);
    const [confetti, setConfetti] = useState([]);

    // Generate random particles for background
    const particles = Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: Math.random() * 10 + 10
    }));

    // Generate confetti on success
    const generateConfetti = () => {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.error.main
        ];
        const newConfetti = Array.from({ length: 50 }).map((_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            left: Math.random() * 100,
            delay: Math.random() * 1,
            size: Math.random() * 8 + 4
        }));
        setConfetti(newConfetti);
        setTimeout(() => setConfetti([]), 2000);
    };

    const validate = () => {
        const newErrors = {};
        const { email, password, first_name } = formData;

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!first_name.trim()) {
            newErrors.first_name = 'First name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            await axios.post('/api/accounts/signup/', formData);
            setSuccess(true);
            generateConfetti();
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    setErrors(prev => ({
                        ...prev,
                        ...err.response.data
                    }));
                } else {
                    setServerError(err.response.data || 'Registration failed');
                }
            } else {
                setServerError('Network error. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <CosmicBackground>
            {/* Background particles */}
            {particles.map(particle => (
                <Box
                    key={particle.id}
                    className="particle"
                    sx={{
                        width: particle.size,
                        height: particle.size,
                        left: `${particle.left}%`,
                        top: '100%',
                        animationDelay: `${particle.delay}s`,
                        animationDuration: `${particle.duration}s`
                    }}
                />
            ))}

            {/* Confetti animation */}
            {confetti.map(item => (
                <Confetti
                    key={item.id}
                    color={item.color}
                    sx={{
                        width: item.size,
                        height: item.size,
                        left: `${item.left}%`,
                        bottom: 0,
                        animationDelay: `${item.delay}s`
                    }}
                />
            ))}

            <Slide in direction="down" timeout={600} easing="cubic-bezier(0.34, 1.56, 0.64, 1)">
                <Box sx={{ maxWidth: 480, width: '100%' }}>
                    <GlassPaper elevation={24}>
                        <Box sx={{ p: { xs: 3, sm: 4 } }}>
                            <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Grid item>
                                    <IconButton
                                        onClick={() => navigate(-1)}
                                        sx={{
                                            color: 'text.secondary',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: 'primary.main',
                                                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                transform: 'translateX(-3px)'
                                            }
                                        }}
                                    >
                                        <ArrowBack />
                                    </IconButton>
                                </Grid>
                                <Grid item xs>
                                    <Typography
                                        variant="h4"
                                        component="h1"
                                        sx={{
                                            fontWeight: 700,
                                            background: `linear-gradient(135deg, 
                                                ${theme.palette.primary.main} 0%, 
                                                ${theme.palette.secondary.main} 100%)`,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            display: 'inline-block'
                                        }}
                                    >
                                        Create Account
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{
                                    mb: 4,
                                    fontSize: '1rem',
                                    lineHeight: 1.6
                                }}
                            >
                                Join our community to access exclusive features and content
                            </Typography>

                            {serverError && (
                                <Fade in>
                                    <Alert
                                        severity="error"
                                        sx={{
                                            mb: 3,
                                            borderRadius: '12px',
                                            boxShadow: theme.shadows[1],
                                            '& .MuiAlert-icon': {
                                                alignItems: 'center'
                                            }
                                        }}
                                        onClose={() => setServerError('')}
                                    >
                                        {serverError}
                                    </Alert>
                                </Fade>
                            )}

                            {success && (
                                <Fade in>
                                    <Alert
                                        severity="success"
                                        icon={<Celebration />}
                                        sx={{
                                            mb: 3,
                                            borderRadius: '12px',
                                            boxShadow: theme.shadows[1]
                                        }}
                                    >
                                        Registration successful! Redirecting to login...
                                    </Alert>
                                </Fade>
                            )}

                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{
                                    '& > *:not(:last-child)': {
                                        mb: 2
                                    }
                                }}
                            >
                                <FloatingLabelTextField
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email sx={{
                                                    color: errors.email ?
                                                        'error.main' :
                                                        alpha(theme.palette.text.secondary, 0.7),
                                                    transition: 'color 0.3s ease'
                                                }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <FloatingLabelTextField
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password || 'At least 8 characters'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock sx={{
                                                    color: errors.password ?
                                                        'error.main' :
                                                        alpha(theme.palette.text.secondary, 0.7),
                                                    transition: 'color 0.3s ease'
                                                }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleTogglePassword}
                                                    edge="end"
                                                    sx={{
                                                        color: errors.password ?
                                                            'error.main' :
                                                            alpha(theme.palette.text.secondary, 0.7),
                                                        transition: 'all 0.3s ease',
                                                        '&:hover': {
                                                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                                            color: 'primary.main'
                                                        }
                                                    }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />

                                <Box sx={{
                                    display: 'flex',
                                    gap: 2,
                                    '& > *': {
                                        flex: 1
                                    }
                                }}>
                                    <FloatingLabelTextField
                                        label="First Name"
                                        name="first_name"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        error={!!errors.first_name}
                                        helperText={errors.first_name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{
                                                        color: errors.first_name ?
                                                            'error.main' :
                                                            alpha(theme.palette.text.secondary, 0.7),
                                                        transition: 'color 0.3s ease'
                                                    }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <FloatingLabelTextField
                                        label="Last Name"
                                        name="last_name"
                                        fullWidth
                                        margin="normal"
                                        variant="outlined"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        error={!!errors.last_name}
                                        helperText={errors.last_name}
                                    />
                                </Box>

                                <NeumorphicButton
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : null}
                                    sx={{ mt: 3, py: 1.5 }}
                                >
                                    {isSubmitting ? 'Creating Account...' : 'Sign Up'}
                                </NeumorphicButton>

                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 3,
                                        textAlign: 'center',
                                        color: 'text.secondary',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    Already have an account?{' '}
                                    <Link
                                        component="button"
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        sx={{
                                            fontWeight: 600,
                                            color: 'primary.main',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                color: 'primary.dark',
                                                textDecoration: 'none'
                                            }
                                        }}
                                    >
                                        Sign in
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </GlassPaper>
                </Box>
            </Slide>
        </CosmicBackground>
    );
};

export default UserRegistrationForm;

