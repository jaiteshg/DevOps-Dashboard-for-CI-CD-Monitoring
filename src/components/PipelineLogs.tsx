import { useEffect, useState } from "react";

export default function PipelineLogs({ runId }: { runId: number }) {
  const [logs, setLogs] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/cicd/logs?runId=${runId}`);
        const data = await res.json();

        setLogs(data.logs || "No logs found");
      } catch (error) {
        console.error("Error fetching logs:", error);
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
        <p>Loading logs...</p>
      ) : (
        <pre>{logs}</pre>
      )}
    </div>
  );
}