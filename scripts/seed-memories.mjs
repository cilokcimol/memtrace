import { MemWal } from "@mysten-incubation/memwal";
import { config } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

const envPath = resolve(process.cwd(), ".env.local");
try {
  const raw = readFileSync(envPath, "utf-8");
  raw.split("\n").forEach(line => {
    const [k, ...v] = line.split("=");
    if (k && v.length) process.env[k.trim()] = v.join("=").trim();
  });
} catch {
  /* .env.local not found, relying on shell env */
}

const PRIVATE_KEY = process.env.MEMWAL_PRIVATE_KEY;
const ACCOUNT_ID = process.env.MEMWAL_ACCOUNT_ID;
const SERVER_URL = process.env.MEMWAL_SERVER_URL ?? "https://relayer.memory.walrus.xyz";

if (!PRIVATE_KEY || !ACCOUNT_ID) {
  console.error("Missing MEMWAL_PRIVATE_KEY or MEMWAL_ACCOUNT_ID in .env.local");
  process.exit(1);
}

function getMemwal(namespace) {
  return MemWal.create({ key: PRIVATE_KEY, accountId: ACCOUNT_ID, serverUrl: SERVER_URL, namespace });
}

async function store(namespace, content) {
  const memwal = getMemwal(namespace);
  console.log(`  Storing to [${namespace}]: ${content.slice(0, 60)}...`);
  const job = await memwal.remember(content);
  const result = await memwal.waitForRememberJob(job.job_id);
  console.log(`  Job done: ${job.job_id}`);
  return result;
}

const memories = {
  bugs: [
    "[PROJECT:memtrace] BUG: TypeError Cannot read properties of undefined reading map | ROOT CAUSE: async data not initialized before render | FIX: add optional chaining arr?.map() and default empty array | LESSON: always init async state with empty array not null | DATE: 2026-07-13",
    "[PROJECT:nextjs-app] BUG: CORS error on POST /api/auth from localhost:3000 | ROOT CAUSE: express cors middleware not configured for credentials | FIX: cors({ origin: 'http://localhost:3000', credentials: true }) | LESSON: credentials:true requires explicit origin not wildcard | DATE: 2026-07-13",
    "[PROJECT:postgres-service] BUG: connection timeout after 30 seconds on users table | ROOT CAUSE: missing index on email column with 2M rows | FIX: CREATE INDEX CONCURRENTLY idx_users_email ON users(email) | LESSON: always index columns used in WHERE clauses on large tables | DATE: 2026-07-13",
    "[PROJECT:react-app] BUG: useEffect infinite loop causing memory leak | ROOT CAUSE: object dependency in useEffect without useMemo | FIX: wrap object with useMemo or destructure primitive values as deps | LESSON: never put object literals directly in useEffect dependency array | DATE: 2026-07-13",
    "[PROJECT:nextjs-app] BUG: hydration mismatch error on dark mode toggle | ROOT CAUSE: localStorage access on server side during SSR | FIX: use useEffect for initial theme read, add suppressHydrationWarning to html element | LESSON: localStorage and window are not available server-side | DATE: 2026-07-13",
  ],
  fixes: [
    "[PROJECT:memtrace] FIX APPLIED: optional chaining + default state initialization fixed TypeError | CONFIDENCE: high | REUSABLE: yes applies to all async data rendering patterns",
    "[PROJECT:nextjs-app] FIX APPLIED: cors credentials config + explicit origin allows auth cookies to pass | CONFIDENCE: high | REUSABLE: yes standard pattern for auth APIs",
    "[PROJECT:postgres-service] FIX APPLIED: CONCURRENTLY index creation on hot table, zero downtime | CONFIDENCE: high | REUSABLE: yes standard for production DB optimization",
    "[PROJECT:react-app] FIX APPLIED: useMemo wrapping object prevents identity change on every render | CONFIDENCE: high | REUSABLE: yes core React performance pattern",
    "[PROJECT:nextjs-app] FIX APPLIED: suppressHydrationWarning on html + useEffect for client values | CONFIDENCE: high | REUSABLE: yes standard Next.js dark mode pattern",
  ],
  decisions: [
    "[DECISION] Using Walrus Memory over Redis for agent context because decentralized, verifiable, cross-app portable | ALTERNATIVES REJECTED: Redis (single server, no portability), IndexedDB (browser only, not agent-accessible) | DATE: 2026-07-13",
    "[DECISION] Using Next.js App Router over Pages Router for MemTrace because server components improve performance | ALTERNATIVES REJECTED: Vite+React (no SSR), Pages Router (legacy, no server components) | DATE: 2026-07-13",
    "[DECISION] Namespaced memory (bugs/fixes/decisions/patterns) over single namespace because parallel recall from multiple semantic buckets improves retrieval precision | DATE: 2026-07-13",
    "[DECISION] Multi-key AI rotation for chat because free tier limits are per key, rotation ensures near-zero downtime | ALTERNATIVES REJECTED: single key (quota exhausted quickly) | DATE: 2026-07-13",
  ],
  patterns: [
    "[PATTERN] nextjs-app tends to break at API boundaries when credentials and CORS interact | WATCH FOR: any new API route that involves cookies or auth headers | DATE: 2026-07-13",
    "[PATTERN] React apps consistently break at async initialization when state defaults to null instead of empty arrays | WATCH FOR: .map() .filter() .length calls on state that starts as null | DATE: 2026-07-13",
    "[SESSION SUMMARY] MemTrace initial setup session | 5 bugs fixed | Key learnings: CORS+credentials pattern, index strategy for large tables, React hydration SSR pattern | Remaining issues: none | DATE: 2026-07-13",
  ],
};

async function main() {
  console.log("MemTrace Walrus Memory Seed Script");
  console.log("====================================");
  console.log(`Account: ${ACCOUNT_ID}`);
  console.log(`Relayer: ${SERVER_URL}`);
  console.log("");

  const memwal = getMemwal("bugs");
  const health = await memwal.health();
  console.log("Health check:", health);
  console.log("");

  let total = 0;
  for (const [namespace, items] of Object.entries(memories)) {
    console.log(`\nNamespace: ${namespace} (${items.length} blobs)`);
    for (const content of items) {
      await store(namespace, content);
      total++;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log(`\nDone. Wrote ${total} blobs to Walrus Mainnet`);
  console.log(`  Account ID: ${ACCOUNT_ID}`);
  console.log(`  Blob count: ${total}`);
}

main().catch(console.error);
