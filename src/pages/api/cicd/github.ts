import type { NextApiRequest, NextApiResponse } from "next";

interface GitHubRun {
  id: number;
  status: string;
  conclusion: string | null;
  created_at: string;
  updated_at: string;
  head_branch: string;
  head_commit?: {
    message: string;
  };
  html_url: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

  if (!GITHUB_TOKEN || !GITHUB_REPO_OWNER || !GITHUB_REPO_NAME) {
    return res.status(500).json({ error: "Missing GitHub API credentials" });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // ⏱ timeout protection

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/actions/runs`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      console.error("GitHub API Error:", data);
      return res.status(response.status).json({
        error: data.message || "GitHub API failed",
      });
    }

    if (!data.workflow_runs) {
      return res.status(200).json([]);
    }

    const formattedData = data.workflow_runs.map((run: GitHubRun) => ({
      id: run.id,
      status:
        run.status === "completed"
          ? run.conclusion === "success"
            ? "Success"
            : "Failed"
          : "In Progress",
      createdAt: run.created_at,
      updatedAt: run.updated_at,
      branch: run.head_branch,
      commit: run.head_commit?.message || "No commit message",
      url: run.html_url,
    }));

    return res.status(200).json(formattedData);
  } catch (error: any) {
    if (error.name === "AbortError") {
      return res.status(408).json({ error: "GitHub API timeout" });
    }

    console.error("Error fetching GitHub Actions data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}