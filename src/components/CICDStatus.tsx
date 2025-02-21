import { useEffect, useState } from "react";

export default function CICDStatus() {
  const [status, setStatus] = useState({
    build: { status: "Checking...", time: "" },
    deployment: { status: "Checking...", time: "" },
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/cicd/github");
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.error("No CI/CD runs found.");
          return;
        }

        const latestBuild = data[0]; // Get the latest workflow run

        setStatus({
          build: {
            status: latestBuild.status,
            time: new Date(latestBuild.createdAt).toLocaleTimeString(),
          },
          deployment: {
            status: latestBuild.status, // Can add separate deployment logic later
            time: new Date(latestBuild.updatedAt).toLocaleTimeString(),
          },
        });
      } catch (error) {
        console.error(" Error fetching CI/CD status:", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Fetch every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 shadow-md rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Live CI/CD Status</h3>
      <div className="space-y-2">
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Build:</strong> {status.build.status} <span className="text-sm">({status.build.time})</span>
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          <strong>Deployment:</strong> {status.deployment.status} <span className="text-sm">({status.deployment.time})</span>
        </p>
      </div>
    </div>
  );
}
