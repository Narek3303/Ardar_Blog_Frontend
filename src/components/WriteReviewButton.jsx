import { useNavigate } from "react-router-dom";

const WriteReviewButton = ({ productId }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products/${productId}/review/`);
    };

    return (
        <button
            onClick={handleClick}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition"
        >
            Write a Review
        </button>
    );
};

export default WriteReviewButton;
