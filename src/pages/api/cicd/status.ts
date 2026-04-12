import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";

interface CICDData {
  projectName: string;
  status: string;
  buildNumber: number;
  logs: string;
  createdAt: Date;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();

  if (req.method === "GET") {
    try {
      const cicdData = await db
        .collection("cicd")
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(cicdData);
    } catch (error) {
      console.error("Fetch Error:", error);
      return res.status(500).json({ message: "Error fetching CI/CD data" });
    }
  }

  if (req.method === "POST") {
    try {
      const { projectName, status, buildNumber, logs } = req.body;

      if (!projectName || !status || !buildNumber || !logs) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newCiCd: CICDData = {
        projectName,
        status,
        buildNumber,
        logs,
        createdAt: new Date(),
      };

      const result = await db.collection("cicd").insertOne(newCiCd);

      return res.status(201).json({
        message: "CI/CD data added",
        data: { ...newCiCd, _id: result.insertedId },
      });
    } catch (error) {
      console.error("Insert Error:", error);
      return res.status(500).json({ message: "Error adding CI/CD data" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}