import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AxiosInstance from '../api/axiosInstance';
import { formatDate, formatCurrency } from '../components/utils/formatHelpers';
import { CurrencyContext } from '../context/CurrencyContext';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Typography,
    Box,
    Alert,
    Avatar,
    Stack,
    Skeleton,
    Tooltip,
    Button,
    IconButton
} from '@mui/material';
import {
    ShoppingBag as OrderIcon,
    CalendarToday as DateIcon,
    CheckCircle as CompletedIcon,
    Cancel as CancelledIcon,
    WatchLater as PendingIcon,
    LocalShipping as ShippedIcon,
    Receipt as ReceiptIcon,
    CurrencyExchange as CurrencyIcon,
    ArrowForward as ArrowIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';

// Fixed Styled Components with proper theme access
const GlassPaper = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape?.borderRadius ? theme.shape.borderRadius * 3 : 12,
    backdropFilter: 'blur(16px)',
    backgroundColor: theme.palette?.mode === 'dark'
        ? 'rgba(30, 30, 40, 0.7)'
        : 'rgba(255, 255, 255, 0.8)',
    boxShadow: theme.shadows?.[10] || '0px 5px 22px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${theme.palette?.divider || 'rgba(0, 0, 0, 0.12)'}`,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows?.[15] || '0px 10px 25px rgba(0, 0, 0, 0.25)'
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const defaultTheme = {
        palette: {
            success: { light: '#81c784', main: '#4caf50', contrastText: '#fff' },
            warning: { light: '#ffb74d', main: '#ff9800', contrastText: '#fff' },
            error: { light: '#e57373', main: '#f44336', contrastText: '#fff' },
            info: { light: '#64b5f6', main: '#2196f3', contrastText: '#fff' }
        }
    };

    const activeTheme = theme || defaultTheme;
    const styles = {
        fontWeight: 700,
        letterSpacing: 0.5,
        borderRadius: 16,
        padding: activeTheme.spacing?.(0.5) || '4px',
        textTransform: 'capitalize',
        transition: 'all 0.3s ease',
        '& .MuiChip-icon': {
            marginLeft: activeTheme.spacing?.(0.5) || '4px'
        }
    };

    if (status === 'completed') {
        return {
            ...styles,
            background: `linear-gradient(135deg, ${activeTheme.palette?.success?.light || '#81c784'} 0%, ${activeTheme.palette?.success?.main || '#4caf50'} 100%)`,
            color: activeTheme.palette?.success?.contrastText || '#fff'
        };
    }
    if (status === 'pending') {
        return {
            ...styles,
            background: `linear-gradient(135deg, ${activeTheme.palette?.warning?.light || '#ffb74d'} 0%, ${activeTheme.palette?.warning?.main || '#ff9800'} 100%)`,
            color: activeTheme.palette?.warning?.contrastText || '#fff'
        };
    }
    if (status === 'cancelled') {
        return {
            ...styles,
            background: `linear-gradient(135deg, ${activeTheme.palette?.error?.light || '#e57373'} 0%, ${activeTheme.palette?.error?.main || '#f44336'} 100%)`,
            color: activeTheme.palette?.error?.contrastText || '#fff'
        };
    }
    if (status === 'shipped') {
        return {
            ...styles,
            background: `linear-gradient(135deg, ${activeTheme.palette?.info?.light || '#64b5f6'} 0%, ${activeTheme.palette?.info?.main || '#2196f3'} 100%)`,
            color: activeTheme.palette?.info?.contrastText || '#fff'
        };
    }
    if (status === 'delivered') {
        return {
            ...styles,
            background: `linear-gradient(135deg, ${activeTheme.palette?.success?.light || '#81c784'} 0%, ${activeTheme.palette?.success?.main || '#4caf50'} 100%)`,
            color: activeTheme.palette?.success?.contrastText || '#fff'
        };
    }
    return styles;
});

const OrderLink = styled(Link)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme?.spacing?.(1) || '8px',
    textDecoration: 'none',
    color: theme?.palette?.text?.primary || '#000',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    padding: theme?.spacing?.(0.5, 1) || '4px 8px',
    borderRadius: theme?.shape?.borderRadius || 4,
    '&:hover': {
        color: theme?.palette?.primary?.main || '#1976d2',
        backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)',
        transform: 'translateX(4px)'
    }
}));

const CurrencyBadge = styled(Box)(({ theme }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    padding: theme?.spacing?.(0.5, 1.5) || '4px 12px',
    borderRadius: 20,
    background: theme?.palette?.mode === 'dark'
        ? 'linear-gradient(135deg, rgba(100,100,120,0.3) 0%, rgba(70,70,90,0.3) 100%)'
        : 'linear-gradient(135deg, rgba(230,230,250,0.7) 0%, rgba(210,210,230,0.7) 100%)',
    color: theme?.palette?.text?.secondary || 'rgba(0, 0, 0, 0.6)',
    fontSize: '0.75rem',
    fontWeight: 600,
    backdropFilter: 'blur(4px)',
    border: `1px solid ${theme?.palette?.divider || 'rgba(0, 0, 0, 0.12)'}`
}));

const AnimatedTableRow = styled(motion.tr)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)'
    }
}));

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const { currency: currentCurrency, exchangeRate } = useContext(CurrencyContext);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await AxiosInstance.get('/orders/');
            setOrders(data);
        } catch (err) {
            console.error("Orders fetch error:", err);
            setError(err.response?.data?.message || "Failed to load orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        const icons = {
            pending: <PendingIcon fontSize="small" />,
            completed: <CompletedIcon fontSize="small" />,
            cancelled: <CancelledIcon fontSize="small" />,
            shipped: <ShippedIcon fontSize="small" />,
            delivered: <CompletedIcon fontSize="small" />
        };
        return icons[status] || null;
    };

    const convertCurrency = (amount) => {
        if (amount == null || isNaN(amount) || !exchangeRate) return 0;
        return parseFloat((amount * exchangeRate).toFixed(2));
    };

// 2) calculateOrderTotal builds a raw total and passes it to convertCurrency
    const calculateOrderTotal = (order) => {
        // use order.total if provided
        let rawTotal;
        if (order.total != null && !isNaN(order.total)) {
            rawTotal = parseFloat(order.total);
        } else if (Array.isArray(order.items)) {
            const subtotal = order.items.reduce((sum, item) => {
                const itemPrice = parseFloat(item.total_price || (item.price * item.quantity) || 0);
                return sum + itemPrice;
            }, 0);
            const discount = parseFloat(order.discount) || 0;
            const tax = parseFloat(order.tax) || 0;
            const shipping = parseFloat(order.shipping_cost) || 0;
            rawTotal = subtotal - discount + tax + shipping;
        } else {
            rawTotal = 0;
        }

        return convertCurrency(rawTotal);
    };

// 3) calculateOriginalTotal stays as-is
    const calculateOriginalTotal = (order) => {
        let rawTotal;
        if (order.total != null && !isNaN(order.total)) {
            rawTotal = parseFloat(order.total);
        } else if (Array.isArray(order.items)) {
            rawTotal = order.items.reduce((sum, item) =>
                    sum + parseFloat(item.total_price || (item.price * item.quantity) || 0)
                , 0);
        } else {
            rawTotal = 0;
        }

        // now apply the same exchangeRate
        return convertCurrency(rawTotal);
    };

    const renderLoading = () => (
        <Box sx={{ width: '100%' }}>
            {[...Array(5)].map((_, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
                >
                    <Skeleton
                        variant="rectangular"
                        height={72}
                        sx={{
                            mb: 2,
                            borderRadius: 2
                        }}
                    />
                </motion.div>
            ))}
        </Box>
    );

    const renderError = () => (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Alert
                severity="error"
                variant="outlined"
                sx={{
                    borderRadius: 3,
                    backdropFilter: 'blur(4px)',
                    '& .MuiAlert-message': {
                        width: '100%'
                    }
                }}
                action={
                    <Button
                        color="inherit"
                        size="small"
                        startIcon={<RefreshIcon />}
                        onClick={fetchOrders}
                    >
                        Retry
                    </Button>
                }
            >
                <Typography variant="subtitle1">{error}</Typography>
                <Typography variant="body2" mt={1}>
                    Please try refreshing the page or contact support if the problem persists.
                </Typography>
            </Alert>
        </motion.div>
    );

    const renderEmpty = () => (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="400px"
                textAlign="center"
                p={4}
            >
                <ReceiptIcon
                    color="disabled"
                    sx={{
                        fontSize: 80,
                        mb: 2,
                        opacity: 0.5
                    }}
                />
                <Typography variant="h5" color="textSecondary" gutterBottom>
                    Your order history is empty
                </Typography>
                <Typography variant="body1" color="textSecondary" mb={3}>
                    Start shopping to see your orders here
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/')}
                    sx={{
                        borderRadius: 3,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        boxShadow: theme.shadows[4],
                        '&:hover': {
                            boxShadow: theme.shadows[8]
                        }
                    }}
                >
                    Browse Products
                </Button>
            </Box>
        </motion.div>
    );

    if (loading) return renderLoading();
    if (error) return renderError();
    if (!orders || orders.length === 0) return renderEmpty();

    return (
        <Box sx={{ maxWidth: '1400px', margin: '0 auto', py: 4, px: { xs: 2, sm: 4 } }}>
            <GlassPaper elevation={3}>
                <Box sx={{
                    p: { xs: 2, md: 4 },
                    background: theme.palette?.mode === 'light'
                        ? 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                        : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
                }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={4}>
                        <Avatar sx={{
                            bgcolor: 'transparent',
                            width: 60,
                            height: 60,
                            border: `2px solid ${theme.palette?.primary?.main || '#1976d2'}`,
                            color: theme.palette?.primary?.main || '#1976d2'
                        }}>
                            <OrderIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                                Order History
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                                <Typography variant="body2" color="text.secondary">
                                    {orders.length} orders
                                </Typography>
                                <CurrencyBadge>
                                    <CurrencyIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    {currentCurrency}
                                </CurrencyBadge>
                            </Stack>
                        </Box>
                        <Box flexGrow={1} />
                        <IconButton
                            onClick={fetchOrders}
                            sx={{
                                backgroundColor: theme.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)',
                                '&:hover': {
                                    backgroundColor: theme.palette?.action?.selected || 'rgba(0, 0, 0, 0.08)'
                                }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Stack>

                    <TableContainer component={Paper} sx={{
                        borderRadius: 3,
                        backdropFilter: 'blur(8px)',
                        backgroundColor: theme.palette?.mode === 'dark'
                            ? 'rgba(30, 30, 40, 0.6)'
                            : 'rgba(255, 255, 255, 0.7)',
                        border: `1px solid ${theme.palette?.divider || 'rgba(0, 0, 0, 0.12)'}`
                    }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{
                                    backgroundColor: theme.palette?.mode === 'light'
                                        ? 'rgba(240, 240, 250, 0.8)'
                                        : 'rgba(40, 40, 60, 0.8)'
                                }}>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Order</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Status</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Total</TableCell>
                                    <TableCell width="50px" />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {orders.map((order) => {
                                        const total = calculateOrderTotal(order);
                                        const originalTotal = calculateOriginalTotal(order);
                                        const status = order.status_display ? order.status_display.toLowerCase() : order.status;

                                        return (
                                            <AnimatedTableRow
                                                key={order.id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                hover
                                                sx={{
                                                    '&:last-child td': { borderBottom: 0 },
                                                    cursor: 'pointer'
                                                }}
                                                onClick={() => navigate(`/order-detail/${order.id}`)}
                                            >
                                                <TableCell>
                                                    <OrderLink to={`/order-detail/${order.id}`}>
                                                        <OrderIcon fontSize="small" />
                                                        {order.order_number}
                                                    </OrderLink>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" alignItems="center" spacing={1}>
                                                        <DateIcon color="action" fontSize="small" />
                                                        <Typography>
                                                            {formatDate(order.created_at, 'MMM D, YYYY')}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusChip
                                                        status={status}
                                                        icon={getStatusIcon(status)}
                                                        label={order.status_display || order.status}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack alignItems="flex-end" spacing={0.5}>
                                                        <Typography fontWeight="600" fontSize="1.05rem">
                                                            {formatCurrency(total, currentCurrency)}
                                                        </Typography>
                                                        {order.currency_code !== currentCurrency && (
                                                            <Tooltip
                                                                title={`Original amount: ${formatCurrency(originalTotal, order.currency_code)}`}
                                                                arrow
                                                            >
                                                                <Typography variant="caption" color="text.secondary">
                                                                    ≈ {formatCurrency(originalTotal, order.currency_code)}
                                                                </Typography>
                                                            </Tooltip>
                                                        )}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small">
                                                        <ArrowIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </AnimatedTableRow>
                                        );
                                    })}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </GlassPaper>
        </Box>
    );
};

export default OrderListPage;
