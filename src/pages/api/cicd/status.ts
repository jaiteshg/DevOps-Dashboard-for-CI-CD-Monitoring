import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const cicdData = await prisma.cICD.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(cicdData);
    } catch (error) {
      res.status(500).json({ message: "Error fetching CI/CD data", error });
    }
  } 
  else if (req.method === "POST") {  // ✅ Ensure this part exists!
    try {
      const { projectName, status, buildNumber, logs } = req.body;

      if (!projectName || !status || !buildNumber || !logs) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newCiCd = await prisma.cICD.create({
        data: { projectName, status, buildNumber, logs, createdAt: new Date() },
      });

      res.status(201).json({ message: "CI/CD data added", data: newCiCd });
    } catch (error) {
      res.status(500).json({ message: "Error adding CI/CD data", error });
    }
  } 
  else {
    res.status(405).json({ message: "Method Not Allowed" });  // ❌ Error happens here if POST isn't allowed
  }
}
