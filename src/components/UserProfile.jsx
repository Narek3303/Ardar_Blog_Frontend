import { useEffect, useState } from 'react';
import AxiosInstance from '../api/axiosInstance'; // Ձեր axios ինտերսեպտոր կամ օրինակ

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // API-ից տվյալների ստացում
                const response = await AxiosInstance.get('/users/users/profiles/');
                if (response.data && response.data.length > 0) {
                    setProfile(response.data[0]); // Ստանում ենք առաջին պրոֆիլը
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    if (loading) {
        return <div>Բեռնվում է...</div>;
    }

    if (!profile) {
        return <div>Պրոֆիլը չի գտնվել։</div>;
    }

    return (
        <div>
            <h1>Պրոֆիլը</h1>
            <p>Անուն: {profile.first_name} {profile.last_name}</p>
            <p>Էլ. հասցե: {profile.user_email}</p>
            <p>Հեռախոսահամար: {profile.phone_number}</p>
            <p>Հասցե: {profile.address}</p>
            <p>Քաղաք: {profile.city}</p>
            <p>Երկիր: {profile.country}</p>
            <p>Փոստային կոդ: {profile.postal_code}</p>
            <p>Ծննդյան ամսաթիվ: {profile.birth_date}</p>
        </div>
    );
};

export default UserProfile;
