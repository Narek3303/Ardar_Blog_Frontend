import { useParams } from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import AxiosInstance from "../api/axiosInstance";
import { formatDate, formatCurrency } from '../components/utils/formatHelpers';
import {
    Paper,
    Typography,
    List,
    ListItem,
    Divider,
    Chip,
    CircularProgress,
    Box,
    Alert,
    Stack,
    Avatar,
    styled,
    useTheme
} from "@mui/material";
import {
    ShoppingBag as OrderIcon,
    CalendarToday as DateIcon,
    Payment as PaymentIcon,
    LocalShipping as ShippingIcon,
    CheckCircle as CompletedIcon,
    Cancel as CancelledIcon,
    WatchLater as PendingIcon
} from "@mui/icons-material";
import WebMoneyPayment from '../components/WebMoneyPayment';
import { CurrencyContext } from "../context/CurrencyContext";

// Styled components
const OrderPaper = styled(Paper)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[4],
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[8]
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
    fontWeight: 600,
    letterSpacing: 0.5,
    ...(status === 'completed' && {
        backgroundColor: theme.palette.success.light,
        color: theme.palette.success.dark
    }),
    ...(status === 'pending' && {
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark
    }),
    ...(status === 'cancelled' && {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.dark
    }),
    ...(status === 'shipped' && {
        backgroundColor: theme.palette.info.light,
        color: theme.palette.info.dark
    })
}));

const OrderItem = styled(ListItem)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    '&:last-child': {
        borderBottom: 'none'
    }
}));

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const { currency: selectedCurrency, currency, exchangeRate } = useContext(CurrencyContext);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                setError(null);
                const { data } = await AxiosInstance.get(`/orders/${id}/`);
                setOrder(data);
            } catch (err) {
                console.error("Order fetch error:", err);
                setError(err.response?.data?.message || "Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const getStatusIcon = (status) => {
        const icons = {
            pending: <PendingIcon fontSize="small" />,
            completed: <CompletedIcon fontSize="small" />,
            cancelled: <CancelledIcon fontSize="small" />,
            shipped: <ShippingIcon fontSize="small" />
        };
        return icons[status] || null;
    };

    const renderLoading = () => (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <Stack alignItems="center" spacing={2}>
                <CircularProgress size={60} thickness={4} />
                <Typography variant="h6" color="textSecondary">
                    Loading Order Details...
                </Typography>
            </Stack>
        </Box>
    );

    const renderError = () => (
        <Box mt={4}>
            <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                <Typography variant="subtitle1">{error}</Typography>
                <Typography variant="body2" mt={1}>
                    Please try refreshing the page or contact support if the problem persists.
                </Typography>
            </Alert>
        </Box>
    );

    const renderEmpty = () => (
        <Box mt={4}>
            <Alert severity="info" variant="outlined" sx={{ borderRadius: 2 }}>
                <Typography variant="subtitle1">No order found</Typography>
                <Typography variant="body2" mt={1}>
                    The order you're looking for doesn't exist or may have been removed.
                </Typography>
            </Alert>
        </Box>
    );

    if (loading) return renderLoading();
    if (error) return renderError();
    if (!order) return renderEmpty();

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', py: 4 }}>
            <OrderPaper elevation={3}>
                <Box sx={{
                    p: 4,
                    background: theme.palette.mode === 'light'
                        ? 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                        : theme.palette.background.paper
                }}>
                    <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                        <Avatar sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 56,
                            height: 56
                        }}>
                            <OrderIcon fontSize="large" />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" fontWeight="bold">
                                Order #{order.order_number}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                                <DateIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="textSecondary">
                                    {formatDate(order.created_at, 'MMMM D, YYYY [at] h:mm A')}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <PaymentIcon color="action" />
                            <Typography variant="subtitle1">
                                {order.payment_method ?
                                    `${order.payment_method.toUpperCase()} ${order.is_paid ? '(Paid)' : '(Pending)'}` :
                                    'Payment method not selected'}
                            </Typography>
                        </Stack>
                        <StatusChip
                            status={order.status}
                            icon={getStatusIcon(order.status)}
                            label={order.status_display || order.status}
                        />
                    </Stack>

                    <Typography variant="h6" fontWeight="medium" mb={2}>
                        Order Items
                    </Typography>

                    <List disablePadding>
                        {order.items?.map((item) => (
                            <OrderItem key={item.id}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Avatar
                                        src={item.first_image}
                                        alt={item.first_image}
                                        variant="rounded"
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="medium">
                                            {item.product_name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            SKU: {item.sku || 'N/A'}
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Typography variant="subtitle1" fontWeight="medium">
                                    {formatCurrency(item.total_price * exchangeRate)} {order.currency} {currency}
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textSecondary"
                                        ml={1}
                                    >
                                        (×{item.quantity})
                                    </Typography>
                                </Typography>
                            </OrderItem>
                        ))}
                    </List>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={2} alignItems="flex-end">
                        <Stack direction="row" spacing={4}>
                            <Typography variant="body1">Subtotal:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(order.subtotal * exchangeRate)} {order.currency} {currency}
                            </Typography>
                        </Stack>
                        {order.discount > 0 && (
                            <Stack direction="row" spacing={4}>
                                <Typography variant="body1">Discount:</Typography>
                                <Typography variant="body1" fontWeight="medium" color="error.main">
                                    -{formatCurrency(order.discount)} {order.currency}
                                </Typography>
                            </Stack>
                        )}
                        <Stack direction="row" spacing={4}>
                            <Typography variant="body1">Shipping:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(order.shipping_cost || 0)} {order.currency}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={4}>
                            <Typography variant="body1">Tax:</Typography>
                            <Typography variant="body1" fontWeight="medium">
                                {formatCurrency(order.tax || 0)} {order.currency}
                            </Typography>
                        </Stack>
                        <Divider sx={{ width: '100%', my: 1 }} />
                        <Stack direction="row" spacing={4}>
                            <Typography variant="h6">Total:</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                {formatCurrency(order.total * exchangeRate)} {order.currency} {currency}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </OrderPaper>

            {order.status === 'pending' && !order.is_paid && (
                <OrderPaper elevation={3} sx={{ mt: 4, p: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Complete Your Payment
                    </Typography>
                    <Typography variant="body1" color="textSecondary" mb={3}>
                        Please choose your preferred payment method to complete your order
                    </Typography>
                    <WebMoneyPayment
                        orderId={order.id}
                        total={order.total}
                        buttonText={`Pay ${formatCurrency(order.total * exchangeRate)} ${currency} with WebMoney`}
                    />
                </OrderPaper>
            )}
        </Box>
    );
};

export default OrderDetailPage;
