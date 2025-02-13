import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists." });
  }

  // Hash password before saving
  const hashedPassword = await hash(password, 10);

  // Create new user
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  return res.status(201).json({ message: "User registered successfully!", user: newUser });
}
