import { NextRequest, NextResponse } from "next/server";
import { MemWal } from "@mysten-incubation/memwal";

function getMemwal(namespace: string) {
  return MemWal.create({
    key: process.env.MEMWAL_PRIVATE_KEY!,
    accountId: process.env.MEMWAL_ACCOUNT_ID!,
    serverUrl: process.env.MEMWAL_SERVER_URL ?? "https://relayer.memory.walrus.xyz",
    namespace,
  });
}

export async function POST(request: NextRequest) {
  try {
    const { action, data, namespace = "bugs" } = await request.json();
    const memwal = getMemwal(namespace);

    switch (action) {
      case "remember": {
        const job = await memwal.remember(data.content);
        const result = await memwal.waitForRememberJob(job.job_id);
        return NextResponse.json({ success: true, job_id: job.job_id, result });
      }
      case "recall": {
        const result = await memwal.recall({ query: data.query, limit: data.limit ?? 8 });
        return NextResponse.json({ success: true, results: result.results });
      }
      case "analyze": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const job = await memwal.analyze(data.content) as any;
        const jobId = job.job_id ?? job.job_ids?.[0];
        const result = jobId ? await memwal.waitForRememberJob(jobId) : null;
        return NextResponse.json({ success: true, job_id: jobId, result });
      }
      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function GET() {
  try {
    const memwal = getMemwal("health-check");
    const health = await memwal.health();
    return NextResponse.json({ success: true, health });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
