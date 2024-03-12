import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import "../css/StatisticsModal.css"
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


Modal.setAppElement('#root'); // Thay đổi '#root' thành ID của element gốc của ứng dụng React nếu khác

const StatisticsModal = ({ isOpen, onRequestClose, uniCode, majorCode }) => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Điểm chuẩn trung bình qua các năm',
            data: [],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        }]
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };
    useEffect(() => {
        if (isOpen) {
            fetch(`http://localhost:2000/api/v1/admin/score/${uniCode}/majors/${majorCode}/scores`)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    const labels = [];
                    const scores = [];

                    // Duyệt qua các khóa của đối tượng (các năm)
                    for (const year in data) {
                        labels.push(year); // Thêm năm vào mảng labels

                        // Tính điểm chuẩn trung bình của mỗi năm
                        const yearlyData = data[year];
                        const averageScore = yearlyData.reduce((acc, curr) => acc + parseFloat(curr.admission_score), 0) / yearlyData.length;
                        scores.push(averageScore);
                    }
                    console.log(labels);
                    setChartData({
                        labels: labels,
                        datasets: [{
                            label: 'Điểm chuẩn trung bình qua các năm',
                            data: scores,
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        }],
                    });
                })
                .catch(error => console.error("Failed to fetch data: ", error));
        }
    }, [isOpen, uniCode, majorCode]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Điểm Chuẩn Qua Các Năm"
            className="Modal-Statistic"
            overlayClassName="Overlay-Statistic"
        >
            <h2>Thống kê điểm chuẩn: {majorCode}</h2>
            {chartData.labels.length > 0 && <Bar options={options} data={chartData} />}
        </Modal>
    );
};

export default StatisticsModal;
