import { Server } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import type { Server as IOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface SocketServer extends HTTPServer {
  io?: IOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log("✅ WebSocket is already running");
    res.end();
    return;
  }

  console.log("🔌 Setting up WebSocket...");
  const io = new Server(res.socket.server, {
    path: "/api/socket_io",
    cors: { origin: "*" },
  });

  res.socket.server.io = io;

  io.on("connection", (socket) => {
    console.log("🟢 New WebSocket connection established");

    const sendCICDUpdates = async () => {
      try {
        const cicdData = await prisma.cICD.findMany({
          orderBy: { createdAt: "desc" },
        });

        io.emit("cicdUpdate", cicdData); // 🔹 Send updates to all connected clients
      } catch (error) {
        console.error("❌ Error fetching CI/CD data:", error);
      }
    };

    // Fetch & send updates every 5 seconds
    const interval = setInterval(sendCICDUpdates, 5000);

    socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
      clearInterval(interval);
    });
  });

  res.end();
}
