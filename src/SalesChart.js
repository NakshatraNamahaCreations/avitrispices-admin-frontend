import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const SalesChart = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: [400, 300, 350, 320, 450, 300, 280, 350, 420, 480, 430, 390],
        backgroundColor: [
          ...Array(4).fill("rgba(150, 75, 100, 0.7)"),
          "rgba(255, 175, 180, 0.8)",
          ...Array(7).fill("rgba(150, 75, 100, 0.7)"),
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "rgba(200, 200, 200, 0.3)" } },
    },
  };

  return <Bar data={data} options={options}  />;
};

export default SalesChart;
