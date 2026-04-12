import { useEffect, useState } from "react";
import Auth from "@/components/Auth";
import CICDChart from "@/components/CICDChart";
import CICDStatus from "@/components/CICDStatus";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface CICDLog {
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [stats, setStats] = useState({
    total: 0,
    failed: 0,
    success: 0,
    inProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");

  // 🔐 Auth protection
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  // 📡 Fetch CI/CD stats
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch("/api/cicd/github", {
          cache: "no-store", // ✅ avoid 304 confusion
        });

        const data = await res.json();

        if (!Array.isArray(data)) return;

        const total = data.length;
        const failed = data.filter((log: CICDLog) => log.status === "Failed").length;
        const success = data.filter((log: CICDLog) => log.status === "Success").length;
        const inProgress = data.filter((log: CICDLog) => log.status === "In Progress").length;

        setStats({ total, failed, success, inProgress });
      } catch (error) {
        console.error("Error fetching CI/CD stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();

    const interval = setInterval(fetchUpdates, 10000); // ✅ less aggressive
    return () => clearInterval(interval);
  }, []);

  if (status === "loading" || loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            🚀 Dashboard Overview
          </h2>
          <Auth />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard title="Total Runs" value={stats.total} color="bg-blue-500" />
          <DashboardCard title="Success" value={stats.success} color="bg-green-500" />
          <DashboardCard title="Failed" value={stats.failed} color="bg-red-500" />
          <DashboardCard title="In Progress" value={stats.inProgress} color="bg-yellow-500" />
        </div>

        {/* Charts + Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CICDChart />
          <CICDStatus />
        </div>
      </main>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number;
  color: string;
}

function DashboardCard({ title, value, color }: DashboardCardProps) {
  return (
    <div
      className={`${color} text-white p-6 rounded-lg shadow-md flex flex-col items-center transition hover:scale-105`}
    >
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}