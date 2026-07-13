import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "blob-count.json");
const SEED = 17;

export function getBlobCount(): number {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8")).count ?? SEED;
  } catch {
    return SEED;
  }
}

export function incrementBlobCount(by = 1): number {
  const next = getBlobCount() + by;
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ count: next }));
  return next;
}
