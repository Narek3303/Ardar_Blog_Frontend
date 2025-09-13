import React, { useState } from 'react';
import axios from 'axios';

const CheckoutButton = ({ cartItems, total, onOrderCreated }) => {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);

        const orderData = {
            items: cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                price: item.price,
            })),
            total: total,
            tax: calculateTax(total),
            shipping: calculateShipping(),
            currency: 'USD', // կամ ձեր արժույթը
        };

        try {
            const response = await axios.post('/orders/create', orderData);
            if (response.status === 201) {
                onOrderCreated(response.data.order_id); // Օգտագործեք սա, երբ պատվերը հաջողությամբ ստեղծվի
            }
        } catch (error) {
            console.error("Order creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            disabled={loading || cartItems.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {loading ? 'Processing...' : 'Checkout'}
        </button>
    );
};

export default CheckoutButton;
