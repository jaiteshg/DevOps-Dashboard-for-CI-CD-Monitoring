 import { hash } from "bcryptjs";
import { getServerSession } from "next-auth/next";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { name, email, password } = req.body;

  try {
    const client = await clientPromise;
    const db = client.db();

    const updateData: Record<string, any> = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase().trim();
    if (password) updateData.password = await hash(password, 10);

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    return res.status(200).json({
      message: "Profile updated successfully!",
    });

  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ error: "Error updating profile" });
  }
}