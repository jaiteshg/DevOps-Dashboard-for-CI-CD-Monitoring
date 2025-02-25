import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import { useState, useEffect } from "react";
import io from "socket.io-client";

const NEXT_PUBLIC_SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";

Chart.register(...registerables, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function CICDChart() {
  const [builds, setBuilds] = useState([]);
  const [lineChartData, setLineChartData] = useState<LineChartData>({
    labels: [],
    datasets: [],
  });
  const [pieChartData, setPieChartData] = useState<PieChartData>({
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: [],
        },
      ],
    });

  useEffect(() => {
    const socket = io(NEXT_PUBLIC_SOCKET_URL, { path: "/api/socket_io" });

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected");
    });

    socket.on("cicdUpdate", (data) => {
      console.log("📥 Received CI/CD Update:", data);
      setBuilds(data);
      processChartData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  interface BuildLog {
    createdAt: string;
    status: "Success" | "Failed" | "In Progress";
  }

  interface LineChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  }

  interface PieChartData {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  }

  const processChartData = (data: BuildLog[]) => {
    const dates = Array.from(new Set(data.map((log) => new Date(log.createdAt).toLocaleDateString())));
    const successCounts = dates.map((date) => data.filter((log) => log.status === "Success" && new Date(log.createdAt).toLocaleDateString() === date).length);
    const failedCounts = dates.map((date) => data.filter((log) => log.status === "Failed" && new Date(log.createdAt).toLocaleDateString() === date).length);
    
    const lineData: LineChartData = {
      labels: dates,
      datasets: [
        {
          label: "Success Builds",
          data: successCounts,
          borderColor: "#22C55E",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          fill: true,
        },
        {
          label: "Failed Builds",
          data: failedCounts,
          borderColor: "#EF4444",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          fill: true,
        },
      ],
    };
    setLineChartData(lineData);

    // Pie Chart Data
    const success = data.filter((log) => log.status === "Success").length;
    const failed = data.filter((log) => log.status === "Failed").length;
    const inProgress = data.filter((log) => log.status === "In Progress").length;

    const pieData: PieChartData = {
      labels: ["Success", "Failed", "In Progress"],
      datasets: [
        {
          data: [success, failed, inProgress],
          backgroundColor: ["#22C55E", "#EF4444", "#FACC15"],
        },
      ],
    };
    setPieChartData(pieData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">CI/CD Insights</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow" style={{ height: "400px" }}>
          <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">Build Trends Over Time</h4>
          <div style={{ height: "350px" }}>
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg shadow" style={{ height: "400px" }}>
          <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">Build Status Distribution</h4>
          <div style={{ height: "350px" }}>
            <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
