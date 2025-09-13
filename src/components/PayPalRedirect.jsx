const PayPalRedirect = ({ orderId }) => {
    const handlePayPal = () => {
        const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=your-paypal-email@example.com&amount=ORDER_AMOUNT&currency_code=USD&item_name=Order%20%23${orderId}&invoice=${orderId}&notify_url=https://yourdomain.com/api/payments/paypal/ipn/&return=https://yourdomain.com/payment/success&cancel_return=https://yourdomain.com/payment/cancel`;

        window.location.href = paypalUrl;
    };

    return <button onClick={handlePayPal}>Pay with PayPal</button>;
};

export default PayPalRedirect;
