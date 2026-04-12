import { useEffect, useState } from "react";

export default function PipelineLogs({ runId }: { runId: number }) {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!runId) return;

    setLoading(true);

    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/cicd/logs?runId=${runId}`);
        const data = await res.json();

        setLogs(data.logs || "No logs found");
      } catch (error) {
        console.error("Error fetching logs:", error);
        setLogs("Error fetching logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [runId]);

  return (
    <div className="mt-4 p-4 bg-black text-green-400 rounded-lg max-h-80 overflow-auto text-sm">
      <h4 className="text-white mb-2">Logs</h4>

      {loading ? (
        <p className="text-yellow-400">Loading logs...</p>
      ) : logs.includes("Error") ? (
        <p className="text-red-400">{logs}</p>
      ) : (
        <pre>{logs}</pre>
      )}

      <button
        className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        onClick={() => alert("AI Debugging coming next 🚀")}
      >
        Explain Logs (AI)
      </button>
    </div>
  );
}