import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, ArcElement } from "chart.js";

ChartJS.register(Tooltip, ArcElement);

const DeliveriesChart = () => {
  const data = {
    labels: ["Orders Delivered", "Orders Pending"],
    datasets: [
      {
        data: [73, 27],
        backgroundColor: ["#FF9AA2", "#FFB7B2"],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips
    },
    cutout: "50%", // Inner circle size for a minimalistic look
    responsive: true,
    maintainAspectRatio: false,
  };

  return <Doughnut data={data} options={options} />;
};

export default DeliveriesChart;
