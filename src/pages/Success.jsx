// File: pages/payment/Success.jsx

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            // Եթե ունես backend-ում endpoint՝ session_id-ի ստուգման, այստեղ կարող ես կանչել
            console.log("Payment succeeded with session ID:", sessionId);
        }
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 text-center px-4">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Վճարումը հաջողությամբ ավարտվեց ✅</h1>
            <p className="text-lg text-green-800">
                Շնորհակալություն ձեր գնումների համար։ Ձեր պատվերը մշակման փուլում է։
            </p>
        </div>
    );
};

export default Success;
