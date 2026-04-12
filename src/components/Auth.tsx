import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Auth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          {/* Avatar */}
          {session.user?.image ? (
            <Image
              src={session.user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full border border-gray-300 cursor-pointer"
              onClick={() => router.push("/settings")}
            />
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center bg-gray-500 rounded-full text-white font-bold cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              {session.user?.name?.[0] || "U"}
            </div>
          )}

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Sign In
          </button>

          <button
            onClick={() => router.push("/signup")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Sign Up
          </button>
        </>
      )}
    </div>
  );
}