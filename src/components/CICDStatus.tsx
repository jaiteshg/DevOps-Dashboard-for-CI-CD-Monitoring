import { useEffect, useState } from "react";
import PipelineLogs from "./PipelineLogs";

interface Run {
  id: number;
  status: string;
  branch: string;
  commit: string;
  createdAt: string;
}

export default function CICDStatus() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRun, setSelectedRun] = useState<number | null>(null);

  const handleSelect = (runId: number) => {
    setSelectedRun(runId);
  };

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/cicd/github");
        const data = await res.json();

        if (Array.isArray(data)) {
          setRuns(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching CI/CD status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    if (status === "Success") return "text-green-500";
    if (status === "Failed") return "text-red-500";
    return "text-yellow-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        Live CI/CD Status
      </h3>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : runs.length === 0 ? (
        <p className="text-gray-500">No pipeline data found</p>
      ) : (
        <div className="space-y-3">
          {runs.map((run) => (
  <div key={run.id}>
    
    <div
      onClick={() => handleSelect(run.id)}
      className={`flex justify-between items-center border-b pb-2 cursor-pointer transition ${
        selectedRun === run.id
          ? "bg-gray-200 dark:bg-gray-600"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div>
        <p className="text-sm font-medium text-gray-800 dark:text-white">
          {run.branch}
        </p>
        <p className="text-xs text-gray-500">
          {run.commit.slice(0, 50)}
        </p>
      </div>

      <div className="text-right">
        <p className={`font-semibold ${getStatusColor(run.status)}`}>
          {run.status}
        </p>
        <p className="text-xs text-gray-500">
          {new Date(run.createdAt).toLocaleTimeString()}
        </p>
      </div>
    </div>

    {/* ✅ THIS is the correct placement */}
    {selectedRun === run.id && (
      <PipelineLogs runId={run.id} />
    )}

  </div>
))}
        </div>
      )}
    </div>
  );
}