import Auth from "@/components/Auth";
import CICDChart from "@/components/CICDChart";
import CICDStatus from "@/components/CICDStatus";
import PipelineLogs from "@/components/PipelineLogs";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, failed: 0, success: 0, inProgress: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/cicd/status");
        const data = await res.json();
        
        const total = data.length;
        const failed = data.filter((log: { status: string; }) => log.status === "Failed").length;
        const success = data.filter((log: { status: string; }) => log.status === "Success").length;
        const inProgress = data.filter((log: { status: string; }) => log.status === "In Progress").length;

        setStats({ total, failed, success, inProgress });
      } catch (error) {
        console.error("Error fetching CI/CD stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={""} setActiveTab={() => {}} />
      
      <main className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🚀 Dashboard Overview</h2>
          <Auth />
        </div>

        {/* Key CI/CD Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard title="Total Runs" value={stats.total} color="bg-blue-500" />
          <DashboardCard title="Success" value={stats.success} color="bg-green-500" />
          <DashboardCard title="Failed" value={stats.failed} color="bg-red-500" />
          <DashboardCard title="In Progress" value={stats.inProgress} color="bg-yellow-500" />
        </div>

        {/* Charts & Live Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CICDChart />
          <CICDStatus />
        </div>

        {/* Pipeline Logs - Full Width */}
        <div className="w-full">
          <PipelineLogs />
        </div>

        {/* Sign Up Button - Centered */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/signup")}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>
        </div>
      </main>
    </div>
  );
}

// Small Card Component for Key Metrics
interface DashboardCardProps {
  title: string;
  value: number;
  color: string;
}

function DashboardCard({ title, value, color }: DashboardCardProps) {
  return (
    <div className={`${color} text-white p-6 rounded-lg shadow-md flex flex-col items-center`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
