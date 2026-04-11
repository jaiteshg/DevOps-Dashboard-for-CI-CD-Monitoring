import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { runId } = req.query;
  res.setHeader("Cache-Control", "no-store");  
  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

  if (!runId || runId === "undefined") {
    return res.status(400).json({ error: "Invalid runId" });
  }


  try {
    // ✅ Get jobs (fast)
    const jobsRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/actions/runs/${runId}/jobs`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const jobsData = await jobsRes.json();

    if (!jobsData.jobs || jobsData.jobs.length === 0) {
      return res.status(404).json({ logs: "No jobs found" });
    }

    // ✅ Extract readable logs from steps
    const logs = jobsData.jobs
      .map((job: any) => {
        const steps = job.steps
          .map((step: any) => {
            return `🔹 ${step.name} → ${step.conclusion || step.status}`;
          })
          .join("\n");

        return `📦 Job: ${job.name}\n${steps}`;
      })
      .join("\n\n");

    return res.status(200).json({ logs });

  } catch (error) {
    console.error("Logs Error:", error);
    return res.status(500).json({ error: "Failed to fetch logs" });
  }
}