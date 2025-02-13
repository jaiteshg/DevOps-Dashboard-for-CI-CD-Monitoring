import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Auth() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      {session ? (
        <>
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
          )}
          <p className="text-gray-900 dark:text-white">{session.user?.name}</p>
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
          >
            Sign Out
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
