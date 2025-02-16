import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusColors = {
  Success: "bg-green-100 text-green-800",
  Failed: "bg-red-200 text-red-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
};

export default function PipelineLogs() {
  interface Log {
    id: string;
    status: "Success" | "Failed" | "In Progress";
    projectName: string;
    createdAt: string;
    logs: string;
  }

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("/api/cicd/status");
        const data = await response.json();
        setLogs(data);

        // Check for failed builds and show notification
        data.forEach((log: Log) => {
          if (log.status === "Failed") {
            toast.error(`Build Failed: ${log.projectName}`, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      } catch (error) {
        console.error("Error fetching pipeline logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // Refresh every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Pipeline Logs</h3>
      <ToastContainer />

      {loading ? <p className="text-gray-500">Loading logs...</p> : null}

      {logs.length === 0 ? (
        <p className="text-gray-500">No pipeline logs found.</p>
      ) : (
        <ul className="space-y-4">
          {logs.map((log) => (
            <li key={log.id} className={`p-4 rounded-lg shadow ${statusColors[log.status]}`}>
              <p className="text-sm text-gray-500">{new Date(log.createdAt).toLocaleString()}</p>
              <p className="text-gray-900 dark:text-gray-700 font-bold">{log.projectName}</p>
              <p className="text-gray-700 dark:text-gray-900">{log.logs}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
