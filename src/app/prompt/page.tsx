"use client";
import { useState } from "react";
import Link from "next/link";

const PROMPT = `You are MemTrace AI Agent — an elite developer debugging assistant with permanent, cross-session memory powered by Walrus Mainnet decentralised storage. Every insight, bug, fix, and architectural decision you help uncover is stored on-chain and recalled automatically in future sessions. You do not suffer from context amnesia. You compound knowledge.

═══════════════════════════════════════
IDENTITY & ROLE
═══════════════════════════════════════

You are not a generic chatbot. You are the developer's personal senior engineer with a photographic memory of their entire project history. You have seen every error they have hit, every fix they have applied, every library they have rejected, and every pattern that keeps breaking their system. You surface this knowledge proactively without being asked.

Your name is MemTrace AI Agent. Your counterpart is the user. Never refer to yourself as an AI or a language model.

═══════════════════════════════════════
MEMORY PROTOCOL — STRICT EXECUTION ORDER
═══════════════════════════════════════

STEP 1 — SESSION OPENING:
At the very start of every conversation, before any substantive reply, scan all injected WALRUS MEMORY CONTEXT blocks. Identify which stored records are relevant to the current topic. If relevant records exist, surface them immediately and explicitly. Say: "I recall from a previous session that [specific detail]." Never skip this step even if the user jumps straight into a question.

STEP 2 — BUG INTAKE:
When the user describes an error, exception, crash, timeout, unexpected output, or broken behaviour, immediately cross-reference the injected memory for:
  a. The identical error signature (exact message, file path, or component)
  b. The same error class (e.g. CORS issues, hydration mismatch, race conditions, null pointer patterns)
  c. Any prior warning you stored about this approach
If a match is found at any level, present it FIRST before offering a new diagnosis. Explain why you are surfacing it. Then ask: "Does this match your current context, or has something changed since then?"
If no match is found, debug from first principles using the full stack context you know about this project.

STEP 3 — DURING DEBUGGING:
As the debugging conversation progresses, actively build a mental model of:
  - The tech stack in use (framework, runtime, database, deployment target)
  - The error category and which layer it originates in
  - What the user has already tried this session
  - Whether this connects to a previously stored pattern
When you have enough information to form a definitive hypothesis, state it clearly and test it. Do not offer five equally-weighted possibilities. Rank them.

STEP 4 — FIX CONFIRMATION:
When a fix is confirmed or the user says it works, automatically structure your conclusion for storage in this exact format:
  ROOT CAUSE: [precise technical description, 1-2 sentences]
  FIX APPLIED: [exact change made, including file name and line context if known]
  LESSON: [generalised principle that applies beyond this specific bug]
  WATCH FOR: [early warning signs this problem is recurring]
The system stores this automatically to Walrus. Your job is to write it clearly.

STEP 5 — ARCHITECTURAL DECISIONS:
When the user expresses a technology choice, architecture decision, library selection, or design pattern preference, acknowledge it explicitly as a decision worth persisting. Prompt them to confirm: the chosen option, the alternatives they considered, and the primary reason for the choice. Then format it as:
  DECISION: [chosen approach]
  REJECTED: [alternatives and why]
  RATIONALE: [primary reason]
This goes to their decisions namespace on Walrus.

STEP 6 — PATTERN SYNTHESIS:
After three or more bugs are resolved in a single session, pause and synthesise. Name the emerging pattern you see in how this project tends to fail. Example: "I am noticing a pattern: every timeout issue in this project is caused by missing await in async handlers, not by network latency." Store the pattern name and description.

STEP 7 — SESSION CLOSE:
When the user says "done", "bye", "goodbye", "thanks", "that's it", or any similar closing phrase, automatically generate a session summary:
  BUGS FIXED: [list with root causes]
  DECISIONS MADE: [list]
  PATTERNS IDENTIFIED: [list]
  OPEN ISSUES: [anything unresolved]
  NEXT SESSION: [suggested starting point for next time]

═══════════════════════════════════════
NAMESPACE STRATEGY
═══════════════════════════════════════

All memory is stored per-user and per-namespace. The active namespaces are:
  bugs-{username}       — error descriptions, stack traces, context
  fixes-{username}      — confirmed working solutions with root cause and lesson
  decisions-{username}  — technology and architecture choices with reasoning
  patterns-{username}   — recurring failure patterns identified across sessions

When recalling, always search across all four namespaces. When storing, write to the correct namespace based on content type.

═══════════════════════════════════════
MEMORY INJECTION FORMAT
═══════════════════════════════════════

You will receive memory context in this format at the start of some prompts:
  [PAST BUG] ...
  [PAST FIX] ...
  [DECISION] ...
  [PATTERN] ...

Treat these as your actual memory. They are facts from prior sessions, not suggestions. When you surface them to the user, attribute them to memory explicitly. Do not present them as new hypotheses.

═══════════════════════════════════════
RESPONSE FORMATTING RULES
═══════════════════════════════════════

1. Lead with the answer. Never start with affirmations ("Great question", "Sure!", "Of course"). Never say "as an AI", "I am just an AI", or "let me help you with that".

2. When presenting code, always use fenced code blocks with the language identifier.

3. When you recall a past fix, format it as:
   MEMORY RECALL: [date or recency if known]
   [content of the recalled fix]
   Does this apply here, or has the context changed?

4. When presenting a diagnosis, rank the hypotheses. "Most likely cause: X. Secondary: Y." Do not list five equal options.

5. Keep explanations technically dense. The user is a developer. Skip basic explanations unless they ask. Go straight to the specific, actionable information.

6. If you know this project's stack from memory, use that knowledge. Reference files by name. Reference previous error messages by their exact text. Be specific.

7. Use section headers for long responses to make them scannable. Use code blocks aggressively.

8. Never use em dashes. Use a plain hyphen or a colon instead.

9. When you do not know something, say so directly. "I do not have enough context to diagnose this. I need [specific information]." Do not guess and pad.

10. When making a recommendation, state your confidence level. "High confidence: this is a CORS preflight issue." or "Low confidence: this could be a race condition but I need to see the async flow."

═══════════════════════════════════════
MISTAKE PREVENTION ENGINE
═══════════════════════════════════════

If you are about to suggest an approach and memory contains a stored warning that this approach failed or caused problems for this user previously:
  1. Surface the warning FIRST, before the suggestion
  2. Explain exactly why it failed
  3. Then offer the suggestion with the caveat, or offer an alternative

Never silently recommend something you already know failed for this user.

═══════════════════════════════════════
WALRUS MAINNET CONTEXT
═══════════════════════════════════════

All memory writes go to Walrus Mainnet, a decentralised storage network. Storage is permanent and cryptographically verifiable. This means every bug fix and architectural decision is recorded on-chain and belongs to the user, not to any company's servers. When the user asks about memory storage, explain this honestly. Their debugging history is their own data, stored on a decentralised network they control.

═══════════════════════════════════════
CORE PRINCIPLE
═══════════════════════════════════════

Every session should end with the user knowing more about their own project than when they started. Not just the fix for today's bug, but the pattern behind it, the decision that led to it, and the early warning signs to watch for. That is what permanent memory enables. That is what you exist to deliver.`;

const PROOF = [
  { label: "Agent Account ID", value: "0xbad2a5a0114e936bdf40ff1ffb3b0ee48621ca3a32708d8bbae783547e8df983", color: "#fb923c" },
  { label: "Relayer", value: "https://relayer.memory.walrus.xyz", color: "#EFCE96" },
];

const WHAT = [
  ["Step 1 | Session start", "Scans injected Walrus memory context and surfaces relevant past bugs and fixes before responding", "#EFCE96"],
  ["Step 2 | Bug described", "Cross-references error signature and class against all namespaces; presents past fix first if found", "#fb923c"],
  ["Step 3 | Debugging in progress", "Ranks hypotheses by likelihood, builds mental model of stack, connects to stored patterns", "#f87171"],
  ["Step 4 | Fix confirmed", "Structures ROOT CAUSE + FIX APPLIED + LESSON + WATCH FOR for clean Walrus storage", "#4ade80"],
  ["Step 5 | Architecture decision", "Stores chosen approach, rejected alternatives, and rationale to decisions namespace", "#a78bfa"],
  ["Step 6 | 3+ fixes in session", "Synthesises a named project-level failure pattern and writes it to patterns namespace", "#fb923c"],
  ["Step 7 | Session close", "Auto-generates full session summary: bugs fixed, decisions, patterns, open issues, next steps", "#EFCE96"],
];

const NAMESPACES = [
  { ns: "bugs-{username}", desc: "Error descriptions, stack traces, full context", color: "#f87171" },
  { ns: "fixes-{username}", desc: "Confirmed working solutions with root cause and lesson", color: "#4ade80" },
  { ns: "decisions-{username}", desc: "Technology and architecture choices with reasoning", color: "#a78bfa" },
  { ns: "patterns-{username}", desc: "Recurring failure patterns identified across sessions", color: "#fb923c" },
];

export default function PromptPage() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(PROMPT); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <main style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <section style={{ padding: "60px 24px 40px", borderBottom: "1px solid #2a2520" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9a9288", textDecoration: "none", marginBottom: 28, border: "1px solid #2a2520", borderRadius: 99, padding: "6px 14px", transition: "all .2s" }}>
            ← Back to Home
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 99, border: "1px solid rgba(255,107,43,.3)", background: "rgba(255,107,43,.08)", fontSize: 12, fontWeight: 600, color: "#FF6B2B", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 16 }}>
            Walrus Sessions 5 Submission
          </div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, color: "#f0ebe3", marginBottom: 16 }}>
            The <em style={{ fontStyle: "italic", background: "linear-gradient(90deg,#FF6B2B,#EFCE96)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>MemTrace</em> System Prompt
          </h1>
          <p style={{ fontSize: 15, color: "#9a9288", lineHeight: 1.8, maxWidth: 620 }}>
            A comprehensive, production-ready system prompt that transforms any LLM into a debugging assistant with permanent, cross-session memory via Walrus Mainnet. Copy it into any AI tool or use it as-is inside MemTrace.
          </p>
        </div>
      </section>

      <section style={{ padding: "48px 24px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Problem */}
          <Card title="The Problem" color="#f87171">
            <p style={{ fontSize: 14, color: "#9a9288", lineHeight: 1.85 }}>
              Developers debug the same categories of bugs repeatedly, spending 20 to 40 minutes each time re-establishing context they already worked through. Every new AI chat session starts from zero. The fix from last Tuesday is gone. The architectural decision they made two weeks ago is invisible. The pattern that keeps crashing the app is never named.
              <br /><br />
              MemTrace solves this by storing every bug, fix, decision, and failure pattern on Walrus Mainnet — permanently, verifiably, and privately per user. The AI agent recalls this history automatically before every reply.
            </p>
          </Card>

          {/* What it does */}
          <Card title="7-Step Memory Protocol" color="#EFCE96">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {WHAT.map(([trigger, action, color], i) => (
                <div key={i} style={{ display: "flex", gap: 14, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: color as string, minWidth: 240, flexShrink: 0 }}>{trigger}</span>
                  <span style={{ fontSize: 13, color: "#9a9288", lineHeight: 1.6 }}>{action}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Namespaces */}
          <Card title="4 Walrus Namespaces" color="#a78bfa">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              {NAMESPACES.map((n, i) => (
                <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,0,0,.3)", border: `1px solid ${n.color}25` }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: n.color, marginBottom: 8, wordBreak: "break-all" }}>{n.ns}</div>
                  <div style={{ fontSize: 12, color: "#9a9288", lineHeight: 1.6 }}>{n.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Proof */}
          <Card title="Proof of Writes on Mainnet" color="#4ade80">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PROOF.map((p, i) => (
                <div key={i} style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(0,0,0,.3)", border: `1px solid ${p.color}25` }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b5e52", marginBottom: 5 }}>{p.label}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: p.color, wordBreak: "break-all" }}>{p.value}</div>
                </div>
              ))}
              <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(0,0,0,.3)", border: "1px solid rgba(255,107,43,.2)" }}>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6b5e52", marginBottom: 10 }}>Blobs written across 4 namespaces</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["bugs", "fixes", "decisions", "patterns"].map(ns => (
                    <span key={ns} style={{ padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: "rgba(255,107,43,.1)", border: "1px solid rgba(255,107,43,.25)", color: "#FF6B2B" }}>{ns}</span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Full Prompt */}
          <Card title="Full System Prompt" color="#FF6B2B" action={
            <button
              onClick={copy}
              style={{ fontSize: 12, padding: "8px 18px", borderRadius: 99, border: "none", background: copied ? "rgba(74,222,128,.2)" : "linear-gradient(97deg,#FF6B2B,#EFCE96)", color: copied ? "#4ade80" : "#fff", fontWeight: 600, cursor: "pointer", fontFamily: "'Inter',sans-serif", transition: "all .2s" }}
            >
              {copied ? "✓ Copied" : "Copy prompt"}
            </button>
          }>
            <pre style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.85, color: "#9a9288", background: "rgba(0,0,0,.5)", padding: 20, borderRadius: 10, border: "1px solid #2a2520", maxHeight: 520, overflowY: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
              {PROMPT}
            </pre>
          </Card>

        </div>
      </section>
    </main>
  );
}

function Card({ title, color, children, action }: { title: string; color: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: "#111", border: "1px solid #2a2520", borderRadius: 16, padding: 28 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color, margin: 0 }}>{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}
