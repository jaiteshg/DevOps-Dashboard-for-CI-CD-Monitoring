import { useState } from "react";
import Auth from "@/components/Auth";
import CICDStatus from "@/components/CICDStatus";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/router";
import CICDChart from "@/components/CICDChart";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <Auth />
        </div>
        <CICDChart /> 
        <CICDStatus /> 
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
