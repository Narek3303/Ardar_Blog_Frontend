// File: pages/orders/OrderPDFView.jsx

import { useEffect, useState } from "react";
import axios from "axios";

const OrderPDFView = ({ orderId }) => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                const response = await axios.get(`/api/orders/${orderId}/invoice/pdf`, {
                    responseType: "blob"
                });
                const pdfBlob = response.data;
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfUrl(pdfUrl);
            } catch (err) {
                setError("Error fetching PDF invoice");
            } finally {
                setLoading(false);
            }
        };

        fetchPDF();
    }, [orderId]);

    if (loading) return <div>Loading PDF...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold">Order Invoice</h2>
            {pdfUrl ? (
                <iframe src={pdfUrl} width="100%" height="600px" title="Invoice PDF"></iframe>
            ) : (
                <p>Invoice not available</p>
            )}
        </div>
    );
};

export default OrderPDFView;
