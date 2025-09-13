import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Typography,
    CircularProgress,
    Alert,
    Box,
    styled,
    useTheme
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';

// Styled components for better customization
const PaymentContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    maxWidth: '500px',
    margin: '0 auto'
}));

const PaymentButton = styled(Button)(({ theme }) => ({
    height: '48px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4]
    }
}));

const WebMoneyLogo = styled('span')({
    display: 'inline-block',
    marginRight: '8px',
    fontWeight: 'bold',
    color: '#045a9c',
    '&:before': {
        content: '"WM"',
        background: 'linear-gradient(135deg, #045a9c, #00aae7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
    }
});

const WebMoneyPayment = ({
                             orderId,
                             total,
                             merchantPurse,
                             onPaymentStart,
                             onPaymentError,
                             successUrl,
                             failUrl,
                             resultUrl,
                             buttonText = 'Pay with WebMoney',
                             description = `Order #${orderId}`,
                             disabled = false
                         }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const theme = useTheme();

    const handlePayment = async () => {
        setLoading(true);
        setError(null);

        try {
            // Optional callback before payment starts
            if (onPaymentStart) {
                await onPaymentStart({ orderId, amount: total });
            }

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://merchant.webmoney.ru/lmi/payment.asp';

            const fields = {
                LMI_PAYMENT_AMOUNT: total,
                LMI_PAYMENT_DESC: description,
                LMI_PAYMENT_NO: orderId,
                LMI_PAYEE_PURSE: merchantPurse,
                LMI_RESULT_URL: resultUrl || `${window.location.origin}/api/payment/webmoney/result/`,
                LMI_SUCCESS_URL: successUrl || `${window.location.origin}/payment/success/`,
                LMI_FAIL_URL: failUrl || `${window.location.origin}/payment/fail/`
            };

            Object.entries(fields).forEach(([name, value]) => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = name;
                input.value = value;
                form.appendChild(input);
            });

            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            const errorMsg = 'Payment initialization failed';
            setError(errorMsg);
            console.error('WebMoney payment error:', err);

            if (onPaymentError) {
                onPaymentError(err, { orderId, amount: total });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaymentContainer>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}

            <PaymentButton
                variant="contained"
                color="primary"
                onClick={handlePayment}
                disabled={loading || disabled}
                fullWidth
                startIcon={
                    loading ? (
                        <CircularProgress size={20} color="inherit" />
                    ) : (
                        <>
                            <WebMoneyLogo />
                            <PaymentIcon />
                        </>
                    )
                }
                sx={{
                    background: loading
                        ? theme.palette.action.disabledBackground
                        : 'linear-gradient(135deg, #045a9c, #00aae7)'
                }}
            >
                {loading ? 'Processing...' : buttonText}
            </PaymentButton>

            <Typography
                variant="body2"
                sx={{
                    mt: 1,
                    color: 'text.secondary',
                    textAlign: 'center',
                    fontStyle: 'italic'
                }}
            >
                You will be redirected to WebMoney's secure payment page
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                <Typography
                    variant="caption"
                    sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center' }}
                >
                    <PaymentIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                    Secure payment processed by WebMoney
                </Typography>
            </Box>
        </PaymentContainer>
    );
};

WebMoneyPayment.propTypes = {
    orderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    total: PropTypes.number.isRequired,
    merchantPurse: PropTypes.string.isRequired,
    onPaymentStart: PropTypes.func,
    onPaymentError: PropTypes.func,
    successUrl: PropTypes.string,
    failUrl: PropTypes.string,
    resultUrl: PropTypes.string,
    buttonText: PropTypes.string,
    description: PropTypes.string,
    disabled: PropTypes.bool
};

export default WebMoneyPayment;