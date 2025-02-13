import { Bar } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, Tooltip, Legend } from "chart.js";

Chart.register(...registerables, CategoryScale, Tooltip, Legend);

export default function CICDChart() {
  const data = {
    labels: ["Builds", "Deployments", "Failures"],
    datasets: [
      {
        label: "CI/CD Stats",
        data: [12, 8, 2],
        backgroundColor: ["#3B82F6", "#22C55E", "#EF4444"],
        borderColor: ["#1E40AF", "#166534", "#991B1B"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E5E7EB",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg h-80">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">CI/CD Stats</h3>
      <Bar data={data} options={options} />
    </div>
  );
}