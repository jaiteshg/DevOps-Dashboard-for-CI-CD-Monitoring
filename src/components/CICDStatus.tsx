import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";



export default function CICDStatus() {
  interface CICDStatusType {
    build: { status: string } | null;
    deployment: { status: string } | null;
  }

  const [status, setStatus] = useState<CICDStatusType>({ build: null, deployment: null });

  const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000", {
    path: "/api/socket",
  });

  useEffect(() => {
    socket.on("cicdUpdate", (data) => {
      console.log("Received update:", data);
      setStatus(data);
    });

    return () => {
      socket.off("cicdUpdate");
    };
  }, []);

  

  return (
    <div>
      <h2>CI/CD Status</h2>
      <p><strong>Build:</strong> {status.build?.status || "Fetching..."}</p>
      <p><strong>Deployment:</strong> {status.deployment?.status || "Fetching..."}</p>
    </div>
  );
}
