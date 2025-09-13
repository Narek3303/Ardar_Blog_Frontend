import axios from "axios";

const StripePayButton = ({ orderId, token }) => {
    const handleStripeCheckout = async () => {
        try {
            const response = await axios.post(
                `/api/payments/stripe/checkout-session/`,
                { order_id: orderId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            window.location.href = response.data.checkout_url;
        } catch (error) {
            console.error("Stripe error:", error.response?.data || error.message);
        }
    };

    return <button onClick={handleStripeCheckout}>Pay with Stripe</button>;
};

export default StripePayButton;
