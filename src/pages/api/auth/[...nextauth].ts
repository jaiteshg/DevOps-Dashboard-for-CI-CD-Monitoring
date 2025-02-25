import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Received Credentials:", credentials); // Debugging

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and Password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found.");

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/Signin", 
    error: "/Signin",  
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug mode
});
