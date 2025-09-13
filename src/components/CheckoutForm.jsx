import React, { useState } from 'react';
import axios from 'axios';

const CheckoutForm = () => {
    const [formData, setFormData] = useState({
        phone: '',
        address: '',
        shipping_method: '',
        payment_method: ''
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('access'); // Եթե JWT token-ով ես authenticate անում

            const response = await axios.post(
                'http://127.0.0.1:8000/orders/checkout/',
                formData,
                {
                    headers: {
                        Authorization: `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage('Պատվերը հաջողությամբ ստեղծվեց։ Համարը՝ ' + response.data.order_id);
        } catch (error) {
            setMessage('Սխալ պատվիրման մեջ: ' + (error.response?.data?.detail || 'Ստուգիր տվյալները'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
                type="text"
                name="phone"
                placeholder="Հեռախոսահամար"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                name="address"
                placeholder="Հասցե"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="number"
                name="shipping_method"
                placeholder="Shipping Method ID"
                value={formData.shipping_method}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="number"
                name="payment_method"
                placeholder="Payment Method ID"
                value={formData.payment_method}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
            />

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Ուղարկել պատվերը
            </button>

            {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        </form>
    );
};

export default CheckoutForm;
