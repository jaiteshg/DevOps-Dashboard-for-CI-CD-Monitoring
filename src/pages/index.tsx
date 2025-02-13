import Auth from "@/components/Auth";
import Sidebar from "@/components/Sidebar";
import CICDChart from "@/components/CICDChart";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={""} setActiveTab={function (tab: string): void {
        throw new Error("Function not implemented.");
      } } />
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Dashboard Overview</h2>
          <Auth />
        </div>
        <CICDChart />
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
