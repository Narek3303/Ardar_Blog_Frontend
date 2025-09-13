import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AxiosInstance from "../api/axiosInstance";

const OrderStatusUpdate = () => {
    const { orderId } = useParams();
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

    const updateStatus = async () => {
        try {
            setLoading(true);
            await AxiosInstance.patch(`/orders/${orderId}/status/`, { status });
            alert("Order status updated successfully.");
        } catch (err) {
            console.error("Failed to update order status:", err);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Update Order Status</h2>
            <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="">Select status</option>
                {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </select>
            <button onClick={updateStatus} disabled={!status || loading}>
                {loading ? "Updating..." : "Update Status"}
            </button>
        </div>
    );
};

export default OrderStatusUpdate;
