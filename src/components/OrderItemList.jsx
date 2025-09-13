// src/components/OrderItemList.jsx
import React from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { toast } from 'react-toastify';

const fetchOrderItems = async (orderId) => {
    const { data } = await axios.get(`/orders/order-items/?order=${orderId}`);
    return data;
};

const deleteOrderItem = async (itemId) => {
    await axios.delete(`/orders/order-items/${itemId}/`);
};

export default function OrderItemList({ orderId }) {
    const queryClient = useQueryClient();

    const { data: items, isLoading, isError } = useQuery(
        ['order-items', orderId],
        () => fetchOrderItems(orderId),
        { enabled: !!orderId } // only fetch when orderId is provided
    );

    const mutation = useMutation(deleteOrderItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(['order-items', orderId]);
            toast.success('Ապրանքը ջնջված է պատվերից');
        },
        onError: () => {
            toast.error('Ջնջման սխալ');
        }
    });

    const handleDelete = (itemId) => {
        if (window.confirm('Վստա՞հ եք, որ ուզում եք ջնջել այս ապրանքը')) {
            mutation.mutate(itemId);
        }
    };

    if (isLoading) return <p>Բեռնում է...</p>;
    if (isError) return <p>Սխալ է տեղի ունեցել</p>;

    return (
        <div>
            <h3 className="text-lg font-semibold mt-4">Պատվերի ապրանքներ</h3>
            <ul className="mt-2 space-y-2">
                {items.map(item => (
                    <li key={item.id} className="border p-3 rounded flex justify-between items-center">
                        <div>
                            <strong>{item.product_name}</strong> × {item.quantity} = {item.total_price} ֏
                        </div>
                        <button
                            className="text-red-500 hover:underline"
                            onClick={() => handleDelete(item.id)}
                        >
                            Ջնջել
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
