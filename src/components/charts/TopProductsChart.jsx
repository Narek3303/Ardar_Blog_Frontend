import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopProductsChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.product__name),
        datasets: [
            {
                label: 'Sold',
                data: data.map(item => item.total_sold),
                backgroundColor: '#10b981'
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Quantity Sold' }
            },
            x: {
                title: { display: true, text: 'Product Name' }
            }
        }
    };

    return <Bar data={chartData} options={options} />;
};

export default TopProductsChart;
