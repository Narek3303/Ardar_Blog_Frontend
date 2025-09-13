import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SalesOverTimeChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Revenue',
                data: data.map(item => item.total),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
                tension: 0.3,
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: true }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                title: { display: true, text: 'Date' }
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Revenue' }
            }
        }
    };

    return <Line data={chartData} options={options} />;
};

export default SalesOverTimeChart;
