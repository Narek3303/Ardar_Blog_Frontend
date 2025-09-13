// File: components/InvoiceDownloadButton.jsx

import React from "react";

const InvoiceDownloadButton = ({ orderId }) => {
    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = `/api/orders/${orderId}/invoice/pdf`; // API endpoint for downloading PDF
        link.download = `invoice_${orderId}.pdf`;
        link.click();
    };

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            Download Invoice PDF
        </button>
    );
};

export default InvoiceDownloadButton;
