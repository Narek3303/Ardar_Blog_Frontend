import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Սկսել Navigate օգտագործումը

    const handleLogout = async () => {
        setLoading(true);
        setError(null);

        try {
            // Ենթադրենք API-ն առկա է և config-ի մեջ անհրաժեշտ է ասել /logout/ endpoint-ի մասին
            const response = await axios.get('/logout/', { withCredentials: true });

            if (response.status === 200) {
                // Եթե հաջողությամբ logout-ը տեղի ունեցավ, redirect անել լոգինի էջ կամ գլխավոր էջ
                navigate('/login'); // Սա կուղղորդի /login էջ
            }
        } catch (err) {
            setError('Դուրս գալը ձախողվեց։ Փորձեք կրկին։');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handleLogout} disabled={loading}>
                {loading ? 'Դուրս գալ...' : 'Դուրս գալ'}
            </button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default LogoutButton;
