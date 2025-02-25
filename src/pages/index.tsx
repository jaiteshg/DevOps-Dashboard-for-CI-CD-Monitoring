import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Auth from "@/components/Auth";
import CICDChart from "@/components/CICDChart";
import CICDStatus from "@/components/CICDStatus";
import PipelineLogs from "@/components/PipelineLogs";
import Sidebar from "@/components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface CICDLog {
  status: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({ total: 0, failed: 0, success: 0, inProgress: 0 });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch("/api/cicd/status"); // Your API route
        const data = await res.json();
        console.log("📡 Received CI/CD update:", data);
  
        const total = data.length;
        const failed = data.filter((log: CICDLog) => log.status === "Failed").length;
        const success = data.filter((log: CICDLog) => log.status === "Success").length;
        const inProgress = data.filter((log: CICDLog) => log.status === "In Progress").length;
  
        setStats({ total, failed, success, inProgress });
      } catch (error) {
        console.error("❌ Error fetching CI/CD stats:", error);
      }
    };
  
    fetchUpdates();
    const interval = setInterval(fetchUpdates, 5000); // Poll every 5 seconds
  
    return () => clearInterval(interval);
  }, []);
  
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null;

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-900">
      <Sidebar activeTab={""} setActiveTab={() => {}} />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🚀 Dashboard Overview</h2>
          <Auth />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <DashboardCard title="Total Runs" value={stats.total} color="bg-blue-500" />
          <DashboardCard title="Success" value={stats.success} color="bg-green-500" />
          <DashboardCard title="Failed" value={stats.failed} color="bg-red-500" />
          <DashboardCard title="In Progress" value={stats.inProgress} color="bg-yellow-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CICDChart />
          <CICDStatus />
        </div>

        <div className="w-full">
          <PipelineLogs />
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
    <div className={`${color} text-white p-6 rounded-lg shadow-md flex flex-col items-center`}>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
