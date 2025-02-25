import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeContext";
import { useEffect } from "react";

function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  useEffect(() => {
    // Ping WebSocket API to ensure it starts
    fetch("/api/socket").catch((err) => console.error("WebSocket init error:", err));
  }, []);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
