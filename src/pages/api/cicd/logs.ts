import type { NextApiRequest, NextApiResponse } from "next";

interface Step {
  name: string;
  status: string;
  conclusion: string | null;
}

interface Job {
  name: string;
  steps: Step[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  const { runId } = req.query;
  const { GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME } = process.env;

  if (!runId || runId === "undefined") {
    return res.status(400).json({ error: "Invalid runId" });
  }

  if (!GITHUB_TOKEN) {
    return res.status(500).json({ error: "Missing GitHub token" });
  }

  try {
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

    if (!jobsRes.ok) {
      console.error("GitHub Jobs API Error:", jobsData);
      return res.status(jobsRes.status).json({
        error: jobsData.message || "Failed to fetch jobs",
      });
    }

    if (!jobsData.jobs || jobsData.jobs.length === 0) {
      return res.status(200).json({ logs: "No jobs found" });
    }

    const logs = jobsData.jobs
      .map((job: Job) => {
        if (!job.steps || job.steps.length === 0) {
          return `📦 Job: ${job.name}\n(No steps available)`;
        }

        const steps = job.steps
          .map((step: Step) => {
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