import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import LogoutComponent from "./LogoutComponent";
import {
    Button,
    IconButton,
    Menu,
    MenuItem,
    Avatar,
    Divider,
    Badge,
    Box,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    ShoppingCart,
    Person,
    FavoriteBorder,
    Menu as MenuIcon,
    Close,
    ListAlt
} from '@mui/icons-material';
import CurrencySelector from "../components/CurrencySelector";
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import axiosInstance  from "../api/axiosInstance";

// Animation keyframes
const pulse = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
`;

const gradientBackground = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

// Styled components with DARK BLUE color scheme
const HeaderContainer = styled('header')(({ theme, scrolled }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scrolled ? theme.spacing(1, 6) : theme.spacing(2, 6),
    background: scrolled
        ? 'rgba(13, 37, 87, 0.95)' // Dark navy blue when scrolled
        : 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', // Deep dark blue gradient
    boxShadow: theme.shadows[4],
    position: 'sticky',
    top: 0,
    zIndex: theme.zIndex.appBar,
    transition: 'all 0.3s ease',
    backdropFilter: scrolled ? 'blur(10px)' : 'none',
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(1.5, 2),
    },
}));

const LogoLink = styled(Link)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    '&:hover': {
        animation: `${pulse} 1s ease infinite`,
    },
}));

const BrandName = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(1.5),
    fontWeight: 700,
    color: theme.palette.common.white,
    letterSpacing: '1px',
    background: 'linear-gradient(90deg, #64b5f6, #1e88e5)',  // Medium to dark blue gradient
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: `${gradientBackground} 6s ease infinite`,
    backgroundSize: '200% 200%',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const HeaderActions = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(3),
    [theme.breakpoints.down('md')]: {
        gap: theme.spacing(1.5),
    },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    background: 'linear-gradient(135deg, #1976d2, #0d47a1)',  // Dark blue gradient
    '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: theme.shadows[4],
        borderColor: '#0a192f', // Dark navy blue
    },
}));

const AuthButton = styled(Button)(({ theme }) => ({
    borderRadius: '20px',
    textTransform: 'none',
    padding: theme.spacing(0.75, 2),
    fontWeight: 600,
    letterSpacing: '0.5px',
    color: '#1e88e5', // Medium blue text
    border: '1px solid #1e88e5', // Medium blue border
    backgroundColor: 'transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
        color: 'white',
        backgroundColor: '#1565c0', // Dark blue background
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4],
    },
}));

const MobileMenu = styled(Box)(({ theme, open }) => ({
    position: 'fixed',
    top: 0,
    left: open ? 0 : '-100%',
    width: '80%',
    maxWidth: '300px',
    height: '100vh',
    background: 'linear-gradient(135deg, #0a192f 0%, #172a45 100%)', // Deep dark blue gradient
    padding: theme.spacing(8, 3, 3),
    transition: 'left 0.3s ease-in-out',
    zIndex: theme.zIndex.drawer + 1,
    boxShadow: theme.shadows[16],
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    color: theme.palette.common.white,
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

const Overlay = styled(Box)(({ open }) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 25, 47, 0.85)', // Semi-transparent dark navy blue overlay
    zIndex: 1200,
    opacity: open ? 1 : 0,
    visibility: open ? 'visible' : 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
}));

const MenuIconButton = styled(IconButton)(({ theme }) => ({
    color: '#64b5f6', // Light blue icon
    '&:hover': {
        backgroundColor: 'rgba(25, 118, 210, 0.1)', // Dark blue hover
    },
}));


const Header = () => {
    const { logoutUser, currentUser, user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [profile, setProfile] = useState(null);

    const open = Boolean(anchorEl);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 50);
    }, []);



    useEffect(() => {
        if (!isAuthenticated) return;              // եթե չեք մուտքագրված՝ մի fetch անեք
        console.log('📡 Header: fetching profile…');
        axiosInstance.get('/users/profile/me/')
            .then(res => {
                console.log('📥 Profile fetched:', res.data);
                setProfile(res.data);
            })
            .catch(err => console.error('❌ Profile fetch error:', err));
    }, [isAuthenticated]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(() => {
        logoutUser();
        handleMenuClose();
        navigate('/');
        setMobileMenuOpen(false);
    }, [logoutUser, handleMenuClose, navigate]);

    const navigateTo = useCallback((path) => {
        navigate(path);
        setMobileMenuOpen(false);
    }, [navigate]);

    const menuItems = [
        {
            label: 'My Profile',
            path: '/profile',
            // icon դաշտը ջնջում ենք, ավելացնում avatarUrl
            avatarUrl: profile?.avatar_url || null,
        },
        // ...
    ];

    // Safe access to user data
    const getUserAvatar = () => {
        if (!currentUser) return '';
        return profile?.avatar_url || '';
    };

    const getUserName = () => {
        if (!currentUser) return 'User';
        return currentUser.displayName || 'User';
    };

    return (
        <>
            <HeaderContainer scrolled={scrolled}>
                {/* Mobile Menu Button */}
                <MenuIconButton
                    onClick={() => setMobileMenuOpen(true)}
                    aria-label="Toggle menu"
                    sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
                >
                    <MenuIcon fontSize="large" />
                </MenuIconButton>

                {/* Logo */}
                <LogoLink to="/">
                    <Avatar
                        src="../images/attachment.png"
                        alt="Company Logo"
                        sx={{
                            width: 44,
                            height: 44,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                    />
                    <BrandName variant="h6">myshop</BrandName>
                </LogoLink>

                {/* Right Side Actions */}
                <HeaderActions>
                    <CurrencySelector />

                    {/* Wishlist icon */}
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/wishlist')}
                        aria-label="Wishlist"
                        size="large"
                        sx={{
                            '&:hover': {
                                color: theme.palette.secondary.main,
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <FavoriteBorder fontSize="medium" />
                    </IconButton>

                    {/* Cart icon */}
                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/cart')}
                        aria-label="Cart"
                        size="large"
                        sx={{
                            '&:hover': {
                                color: theme.palette.secondary.main,
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <Badge

                        >
                            <ShoppingCart fontSize="medium" />
                        </Badge>
                    </IconButton>

                    <IconButton
                        color="inherit"
                        onClick={() => navigate('/orders')}
                        aria-label="Orders"
                        size="large"
                        sx={{
                            '&:hover': {
                                color: theme.palette.secondary.main,
                                transform: 'scale(1.1)'
                            }
                        }}
                    >
                        <ListAlt fontSize="medium" />
                    </IconButton>

                    {/* Authentication Buttons */}
                    {isAuthenticated ? (
                        <>
                            <IconButton
                                onClick={handleMenuOpen}
                                color="inherit"
                                aria-label="User menu"
                                aria-controls="user-menu"
                                aria-haspopup="true"
                                size="large"
                                sx={{
                                    '&:hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                <StyledAvatar
                                    src={getUserAvatar()}
                                    alt={getUserName()}
                                    sx={{ width: 36, height: 36 }}
                                />
                            </IconButton>
                            <Menu
                                id="user-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    elevation: 4,
                                    sx: {
                                        overflow: 'visible',
                                        mt: 1.5,
                                        minWidth: 220,
                                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                                        color: 'white',
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: '#1a1a2e',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                {menuItems.map(item => (
                                    <MenuItem
                                        key={item.path}
                                        onClick={() => {
                                            navigate(item.path);
                                            handleMenuClose();
                                        }}
                                        dense
                                        sx={{
                                            '&:hover': {
                                                background: 'rgba(255, 255, 255, 0.1)',
                                            }
                                        }}
                                    >
                                        <Avatar
                                            src={item.avatarUrl || undefined}
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                mr: 1.5,
                                                background: item.avatarUrl
                                                    ? 'transparent'
                                                    : 'linear-gradient(135deg, #667eea, #764ba2)',
                                            }}
                                        >
                                            {/* Եթե src չկա, ցույց ենք տալիս Person իկոնը */}
                                            {!item.avatarUrl && <Person size={16} />}
                                        </Avatar>
                                        {item.label}
                                    </MenuItem>
                                ))}
                                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />
                                <LogoutComponent />
                            </Menu>
                        </>
                    ) : (
                        <>
                            <AuthButton
                                variant="outlined"
                                color="inherit"
                                startIcon={<Person />}
                                onClick={() => navigate('/login')}
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    mr: 1,
                                    borderColor: 'rgba(255, 255, 255, 0.3)',
                                    color: 'white',
                                    '&:hover': {
                                        borderColor: 'white',
                                        background: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Sign In
                            </AuthButton>
                            <AuthButton
                                variant="contained"
                                color="primary"
                                onClick={() => navigate('/register')}
                                sx={{
                                    display: { xs: 'none', sm: 'flex' },
                                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                    }
                                }}
                            >
                                Sign Up
                            </AuthButton>
                        </>
                    )}


                </HeaderActions>
            </HeaderContainer>

            {/* Mobile Menu */}
            <Overlay open={mobileMenuOpen} onClick={() => setMobileMenuOpen(false)} />
            <MobileMenu open={mobileMenuOpen}>
                <IconButton
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'white'
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Close />
                </IconButton>

                {!isAuthenticated ? (
                    <>
                        <Button
                            fullWidth
                            variant="outlined"
                            startIcon={<Person />}
                            onClick={() => navigateTo('/login')}
                            sx={{
                                mb: 2,
                                color: 'white',
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                                '&:hover': {
                                    borderColor: 'white',
                                    background: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={() => navigateTo('/register')}
                            sx={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5a67d8, #6b46c1)',
                                }
                            }}
                        >
                            Sign Up
                        </Button>
                    </>
                ) : (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 2,
                        padding: 2,
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2
                    }}>
                        <StyledAvatar
                            src={getUserAvatar()}
                            alt={getUserName()}
                            sx={{ width: 48, height: 48 }}
                        />
                        <Typography variant="subtitle1">
                            {getUserName()}
                        </Typography>
                    </Box>
                )}

                <Divider sx={{ my: 1, bgcolor: 'rgba(255, 255, 255, 0.1)' }} />

                <MenuItem
                    onClick={() => navigateTo('/wishlist')}
                    sx={{
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <FavoriteBorder sx={{ mr: 2 }} />
                    Wishlist
                </MenuItem>
                <MenuItem
                    onClick={() => navigateTo('/cart')}
                    sx={{
                        '&:hover': {
                            background: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <Badge
                        badgeContent={3}
                        color="error"
                        sx={{ mr: 2 }}
                    >
                        <ShoppingCart />
                    </Badge>
                    Cart
                </MenuItem>


            </MobileMenu>
        </>
    );
};

export default React.memo(Header);
