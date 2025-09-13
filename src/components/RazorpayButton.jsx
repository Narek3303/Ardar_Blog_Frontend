import axios from "axios";
import Razorpay from "razorpay"; // միայն եթե օգտագործում ես Razorpay frontend SDK-ն
import { useEffect } from "react";

const RazorpayButton = ({ token }) => {
    const handlePayment = async () => {
        try {
            const response = await axios.post(
                "/api/payments/create/",
                { discount_code: "MYCOUPON" }, // եթե ունես
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Currency: "INR",
                    },
                }
            );

            const { razorpay_order_id, amount, currency } = response.data;

            const options = {
                key: "RAZORPAY_PUBLIC_KEY", // փոխարինիր քո բանալով
                amount,
                currency,
                name: "My Shop",
                description: "Order Payment",
                order_id: razorpay_order_id,
                handler: function (response) {
                    // handle success, optionally redirect
                    alert("Payment successful");
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error", error);
        }
    };

    return <button onClick={handlePayment}>Pay with Razorpay</button>;
};

export default RazorpayButton;
