import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Auth() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          {/* User Avatar & Name */}
          {session.user?.image ? (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer"
              onClick={() => router.push("/settings")}
            />
          ) : (
            <div
              className="w-10 h-10 flex items-center justify-center bg-gray-400 rounded-full text-white font-bold cursor-pointer"
              onClick={() => router.push("/settings")}
            >
              {session.user?.name ? session.user.name[0] : "?"}
            </div>
          )}
          {/*  Logout Button */}
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Signout
          </button>
        </>
      ) : (
        <>
        <button
            onClick={() => signIn()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/signup")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
          >
            Sign Up
          </button>
        </>  
      )}
    </div>
  );
}
