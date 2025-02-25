import { useEffect, useState, useCallback } from "react";
import io, { Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function PipelineLogs() {
  interface Log {
    id: string;
    projectName: string;
    status: "Success" | "Failed" | "In Progress";
    createdAt: string;
  }

  const [logs, setLogs] = useState<Log[]>([]);
  const [projectFilter, setProjectFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", { path: "/api/socket_io" });

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket");
      newSocket.emit("filterLogs", { projectFilter, statusFilter });
    });

    newSocket.on("cicdUpdate", (data) => {
      setLogs(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const updateFilters = useCallback(() => {
    if (socket) {
      socket.emit("filterLogs", { projectFilter, statusFilter });
    }
  }, [projectFilter, statusFilter, socket]);

  useEffect(() => {
    updateFilters();
  }, [projectFilter, statusFilter, updateFilters]);

  const statusStyles = {
    Success: { icon: <CheckCircle className="text-green-500" size={24} />, color: "bg-green-100 text-green-800" },
    Failed: { icon: <XCircle className="text-red-500" size={24} />, color: "bg-red-100 text-red-800" },
    "In Progress": { icon: <Clock className="text-yellow-500 animate-spin" size={24} />, color: "bg-yellow-100 text-yellow-800" },
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pipeline Logs</h3>

      {/*  Filter Options */}
      <div className="flex gap-4 mb-4">
        <select
          className="border px-4 py-2 rounded text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="">All Projects</option>
          {Array.from(new Set(logs.map((log) => log.projectName))).map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="In Progress">In Progress</option>
        </select>
      </div>

      {/*  Log Container */}
      <div className="bg-gray-900 dark:bg-gray-800 p-6 shadow-md rounded-lg w-3/4 max-w-4xl">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center">No logs match your filters.</p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.li
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-lg bg-gray-800 dark:bg-gray-900`}
                >
                  <div className="flex items-center gap-4">
                    {statusStyles[log.status]?.icon}
                    <div>
                      <p className="text-white font-semibold">{log.projectName}</p>
                      <p className="text-sm text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg ${statusStyles[log.status]?.color}`}>
                    {log.status}
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </div>
  );
}
