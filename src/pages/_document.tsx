import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Basic SEO */}
        <meta name="description" content="DevOps Dashboard for CI/CD Monitoring" />
        
        {/* Prevent theme flash */}
        <meta name="color-scheme" content="dark light" />
      </Head>

      <body className="antialiased bg-white dark:bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}