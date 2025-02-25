import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.error) return setError("Invalid email or password");

    router.push("/"); // Redirect to dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white">Signin</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Signin"}
          </button>
          <p className="text-center text-gray-500">
            Don not have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
