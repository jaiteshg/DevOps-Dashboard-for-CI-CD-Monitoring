import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const status = {
    build: { status: "Success", time: new Date().toLocaleTimeString() },
    deployment: { status: "Pending", time: new Date().toLocaleTimeString() },
  };

  res.status(200).json(status);
}
