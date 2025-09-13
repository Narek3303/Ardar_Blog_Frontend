import { useMutation } from 'react-query';
import axios from 'axios';

export default function CreateOrderFromCart() {
    const mutation = useMutation(() =>
        axios.post('/api/orders/', {
            status: 'pending',
            discount: 0,
            tax: 0
        })
    );

    const handleCreateOrder = () => {
        mutation.mutate();
    };

    return (
        <div>
            <button onClick={handleCreateOrder} disabled={mutation.isLoading}>
                Ստեղծել պատվեր
            </button>
            {mutation.isSuccess && <p>Պատվերը հաջողությամբ ստեղծվել է։</p>}
            {mutation.isError && <p>Սխալ է տեղի ունեցել</p>}
        </div>
    );
}
