"use client";
import Link from "next/link";

const SECTIONS = [
  { n: "01", title: "The problem", body: "Developers debug the same categories of bugs repeatedly. Every AI chat starts from zero. The fix from last Tuesday is gone. The architectural decision from last month is gone. The pattern that keeps crashing the project is invisible. This wastes hours every week across every developer who uses AI for debugging." },
  { n: "02", title: "The solution", body: "MemTrace wraps a debugging agent with Walrus Memory — decentralized, on-chain storage on the Walrus protocol. Every bug fix, architectural decision, and failure pattern is stored as a verifiable blob on Walrus Mainnet. The next session, the agent recalls what it already knows before it generates a single word." },
  { n: "03", title: "Why Walrus", body: "Walrus provides cryptographically owned, portable, verifiable storage. Memories are not locked in a vendor database. They are blobs on a decentralized network, scoped per user, owned by the account that wrote them. You can verify them independently of any service." },
];

const TECH = [
  { name: "Walrus Memory", role: "All memories stored as blobs on Walrus Mainnet. Per-user namespace isolation.", color: "#6366F1" },
  { name: "Google Gemini", role: "AI reasoning engine with 6-key rotation and model cascade fallback.", color: "#a78bfa" },
  { name: "Next.js 15", role: "Full-stack framework with App Router and server-side API routes.", color: "#60a5fa" },
  { name: "Sui Network", role: "Ownership and access control for Walrus memory accounts.", color: "#4ade80" },
];

export default function AboutPage() {
  return (
    <main style={{ paddingTop: 64, minHeight: "100vh" }}>
      <section style={{ padding: "80px 24px 60px", background: "var(--atm-bg)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-label" style={{ marginBottom: 14 }}>About MemTrace</div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20, color: "#f1f5f9" }}>
            A debugging agent that <em className="gradient-text" style={{ fontStyle: "italic" }}>compounds knowledge</em> over time
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", lineHeight: 1.8, maxWidth: 600 }}>
            Built for Walrus Sessions 5, MemTrace demonstrates what becomes possible when AI agents have permanent, verifiable, cross-session memory.
          </p>
        </div>
      </section>

      <section style={{ padding: "20px 24px 80px", background: "var(--atm-bg)" }}>
        <div className="container" style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 20 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} className="atm-card" style={{ padding: "32px 28px", display: "flex", gap: 24 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#6366F1", opacity: 0.3, flexShrink: 0, lineHeight: 1 }}>{s.n}</div>
              <div>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: 10, color: "#e2e8f0", textTransform: "capitalize" }}>{s.title}</h2>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.85 }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: "60px 24px", background: "var(--atm-bg2)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>Technology Stack</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {TECH.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.color, flexShrink: 0, boxShadow: `0 0 10px ${t.color}60` }} />
                <div style={{ fontWeight: 600, fontSize: 14, color: "#e2e8f0", minWidth: 160 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "#64748b" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "80px 24px", background: "var(--atm-bg)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 480 }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Try it now</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 28, lineHeight: 1.7 }}>Enter a username and start a workspace. Memories persist across every future visit.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <Link href="/chat" className="btn-indigo">Open Chat</Link>
            <Link href="/prompt" className="btn-ghost-light">View the Prompt</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
