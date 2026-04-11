import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { runId } = req.query;

  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

  if (!runId) {
    return res.status(400).json({ error: "Missing runId" });
  }

  try {
    const logsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/actions/runs/${runId}/logs`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    
    if (!logsRes.ok) {
        const error = await logsRes.text();
        return res.status(logsRes.status).json({ error });
        }

        const buffer = await logsRes.arrayBuffer();
        return res.status(200).json({
        logs: "Logs fetched (ZIP format - will parse later)",
        });



  } catch (error) {
    console.error("Logs Error:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}