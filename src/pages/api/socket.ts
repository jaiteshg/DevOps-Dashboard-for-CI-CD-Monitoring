import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

// Function to fetch CI/CD status from GitHub Actions API
async function fetchCICDStatus() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/jaiteshg/DevOps-Dashboard-for-CI-CD-Monitoring/actions/runs",
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!response.ok) return { error: "Failed to fetch CI/CD runs" };

    const data = await response.json();
    if (!data.workflow_runs || data.workflow_runs.length === 0) return { error: "No CI/CD runs found" };

    return {
      build: {
        status: data.workflow_runs[0].status,
        time: data.workflow_runs[0].created_at,
      },
      deployment: {
        status: data.workflow_runs[0].conclusion || "in_progress",
        time: data.workflow_runs[0].updated_at,
      },
    };
  } catch (error) {
    return { error: "Server error" };
  }
}

// WebSocket handler
export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("WebSocket already set up");
    res.end();
    return;
  }

  console.log("Setting up WebSocket...");
  const io = new Server(res.socket.server, { path: "/api/socket" }); // Use correct path
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    setInterval(async () => {
      const data = await fetchCICDStatus();
      socket.emit("cicdUpdate", data);
    }, 10000);

    socket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
    });
  });

  res.end();
}
