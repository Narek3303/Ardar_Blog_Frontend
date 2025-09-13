import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#f43f5e'
];

const OrderStatusPieChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.status),
        datasets: [
            {
                data: data.map(item => item.count),
                backgroundColor: colors
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'right' }
        }
    };

    return <Pie data={chartData} options={options} />;
};

export default OrderStatusPieChart;
