import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getServerSession } from "next-auth/next";
import authOptions from "../auth/[...nextauth]"; // Import NextAuth config
import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import type { User } from "@prisma/client";

const prisma = new PrismaClient();

interface UpdateRequestBody {
    name: string;
    email?: string;
    password?: string;
}

interface ErrorResponse {
    error: string;
}

interface SuccessResponse {
    message: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ErrorResponse | SuccessResponse>
) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

    const session: Session | null = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.email) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, email, password }: UpdateRequestBody = req.body;

    try {
        const updateData: Partial<User> = { name };
        if (email) updateData.email = email;
        if (password) updateData.password = await hash(password, 10);

        await prisma.user.update({
            where: { email: session.user.email },
            data: updateData,
        });

        return res.status(200).json({ message: "Profile updated successfully!" });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({ error: "Error updating profile" });
    }
}
