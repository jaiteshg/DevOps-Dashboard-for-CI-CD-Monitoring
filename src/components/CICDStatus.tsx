import { useState, useEffect } from "react";

export default function CICDStatus() {
  const [status, setStatus] = useState({
    build: { status: "Loading...", time: "" },
    deployment: { status: "Loading...", time: "" },
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/cicd/status`);
        if (!res.ok) throw new Error("Failed to fetch CI/CD status");

        const data = await res.json();
        setStatus(data);
      } catch (error) {
        console.error("Error fetching CI/CD status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // Fetch every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Live CI/CD Status</h3>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Build:</strong> {status?.build?.status || "Fetching..."}{" "}
          <span className="text-sm">({status?.build?.time || "..."})</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Deployment:</strong> {status?.deployment?.status || "Fetching..."}{" "}
          <span className="text-sm">({status?.deployment?.time || "..."})</span>
        </p>
      </div>
    </div>
  );
}
