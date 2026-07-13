"use client";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";

const FEATURES = [
  { icon: "🧠", h: "Persistent Memory", p: "Every bug fix and decision stored permanently on Walrus Mainnet. Pick up exactly where you left off." },
  { icon: "⚡", h: "Instant Recall", p: "Before responding, MemTrace searches your vault across bugs, fixes, and decisions automatically." },
  { icon: "🔒", h: "User Isolation", p: "Each username has a completely private vault. Your data is never mixed with other users." },
  { icon: "🔄", h: "Pattern Detection", p: "After recurring bugs, MemTrace identifies how your codebase tends to fail and warns you proactively." },
  { icon: "🤖", h: "AI Powered", p: "Backed by a robust multi-key AI engine with automatic fallback ensuring near-100% uptime." },
  { icon: "🌊", h: "Walrus Mainnet", p: "Memory blobs stored on decentralised Walrus storage. Not on our servers, not in your browser." },
];

const FAQS = [
  { q: "Is MemTrace free to use?", a: "Yes. MemTrace is fully free. No credit card required." },
  { q: "What does 'per user isolation' mean?", a: "Your username scopes all memory namespaces. vikajoestar and any other user have completely separate vaults, nothing leaks." },
  { q: "What gets stored automatically?", a: "Bug reports with their root cause and fix, architectural decisions, and recurring failure patterns detected across your session." },
  { q: "Does memory persist when I close the tab?", a: "Yes. Memory lives on Walrus Mainnet, not in localStorage. Return under the same username and the agent remembers everything." },
  { q: "How is this different from a normal AI chat?", a: "A normal AI chat forgets when the session ends. MemTrace writes every resolution to the blockchain. Next session, it already knows your history." },
];

function useCountUp(target: number, duration = 1800, startDelay = 400) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);
  useEffect(() => {
    if (!started) return;
    const steps = 40;
    const step = duration / steps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVal(Math.round((target * i) / steps));
      if (i >= steps) clearInterval(id);
    }, step);
    return () => clearInterval(id);
  }, [started, target, duration]);
  return val;
}

function BlobCount() {
  const [n, setN] = useState(17);
  useEffect(() => { fetch("/api/stats").then(r => r.json()).then(d => d.count && setN(d.count)).catch(() => {}); }, []);
  return <>{n}</>;
}

function Ticks() {
  const ticks = Array.from({ length: 61 }, (_, i) => i);
  const set = [...ticks, ...ticks];
  return (
    <div className="hv-ticker-inner">
      {set.map((t, i) => {
        const h = t % 10 === 0 ? 26 : t % 5 === 0 ? 22 : 16;
        return <div key={i} className="hv-tick" style={{ height: h }} />;
      })}
    </div>
  );
}

function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [expandCard, setExpandCard] = useState(false);
  const count = useCountUp(128, 1800, 600);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => v.classList.add("loaded");
    v.addEventListener("canplay", onCanPlay);
    if (v.readyState >= 3) v.classList.add("loaded");
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  const ArrowRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
  const ArrowUp = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
  const ArrowDown = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );

  return (
    <section className="hero-video-section">
      <video
        ref={videoRef}
        className="hero-video-bg"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_044635_8daabe05-1a5c-491c-920f-4b0bd8f04812.mp4"
        autoPlay loop muted playsInline
      />
      <div className="hero-overlay" />

      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 0", flexShrink: 0, flexWrap: "wrap", gap: 12 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <img src="/logo.png" alt="MemTrace" style={{ height: 36, width: 36, borderRadius: 8, objectFit: "cover" }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-.03em" }}>MemTrace</span>
          <span style={{ background: "rgba(255,107,43,.3)", border: "1px solid rgba(255,107,43,.5)", color: "#EFCE96", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 }}>Beta</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[{ href: "/#features", l: "Features" }, { href: "/#faq", l: "FAQ" }].map(x => (
            <Link key={x.href} href={x.href} style={{ padding: "7px 14px", borderRadius: 99, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.7)", textDecoration: "none", transition: "all .2s" }}>{x.l}</Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/chat" style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,.6)", textDecoration: "none", padding: "7px 14px" }}>Sign In</Link>
          <Link href="/chat" className="grad-btn" style={{ fontSize: 13, padding: "9px 22px" }}>Get Started</Link>
        </div>
      </nav>

      <div className="hv-content">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="hv-age-card hv-anim visible" style={{ transitionDelay: "300ms" }}>
            <div className="hv-age-bg" />
            <div className="hv-age-content">
              <div className="hv-age-label">Memories Stored</div>
              <div className="hv-age-label2">on Walrus Mainnet</div>
              <div className="hv-age-number">{count}</div>
              <div className="hv-badge">Zero Context Amnesia</div>
            </div>
          </div>
          <div className="hv-ticker-wrap">
            <div className="hv-ticker-center" />
            <Ticks />
          </div>
        </div>

        <div className="hv-cards hv-anim visible" style={{ transitionDelay: "500ms" }}>
          <div className="hv-card hv-card-dark">
            <div className="hv-card-title">Active Namespaces</div>
            <div className="hv-card-bottom">
              <span className="hv-card-sub">bugs, fixes, decisions, patterns</span>
            </div>
          </div>

          <div className="hv-card hv-card-img" style={{ backgroundImage: "url('https://polo-pecan-73837341.figma.site/_assets/v11/94903fdf21e145cd4ba873c15fc03251c0600ee5.png')" }}>
            <div className="hv-card-title">Memory Vault</div>
            <div className="hv-card-bottom">
              <span className="hv-card-pill">4 types</span>
            </div>
          </div>

          <div
            className={`hv-card hv-card-expand ${expandCard ? "open" : ""}`}
            style={{ gridColumn: "1/-1" }}
            onMouseEnter={() => setExpandCard(true)}
            onMouseLeave={() => setExpandCard(false)}
            onClick={() => setExpandCard(e => !e)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="hv-card-title">How It Works</div>
                {!expandCard && <div style={{ fontSize: 12, color: "rgba(255,255,255,.5)", marginTop: 4 }}>Persistent AI Memory</div>}
              </div>
              <div className="hv-card-btn" style={{ background: expandCard ? "rgba(255,107,43,.3)" : "#000", flexShrink: 0 }}>
                {expandCard ? <ArrowDown /> : <ArrowUp />}
              </div>
            </div>
            <div className="hv-card-expand-body">
              Every bug you debug, every fix you apply, every decision you make — MemTrace stores them to Walrus Mainnet under your private namespace. Next session, the AI recalls your full history before you even type a question. No more repeating yourself to an amnesiac AI.
            </div>
            {!expandCard && (
              <div className="hv-card-bottom">
                <span className="hv-card-sub">Hover to learn more</span>
              </div>
            )}
          </div>

          <div className="hv-card hv-card-img" style={{ backgroundImage: "url('https://polo-pecan-73837341.figma.site/_assets/v11/0c38fdb8a933b0da384a5a3f8b0d9986bb919838.png')", gridColumn: "1/-1" }}>
            <div className="hv-card-title">Start Debugging</div>
            <div className="hv-card-bottom">
              <span className="hv-card-pill">Try it free</span>
              <Link href="/chat" style={{ textDecoration: "none" }}>
                <div className="hv-card-btn hv-card-btn-light" style={{ color: "#000" }}><ArrowRight /></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.body.classList.add("dark");
  }, []);

  return (
    <>
      <HeroSection />
      <main>
        <section id="features" style={{ padding: "80px 24px" }}>
          <div className="l-wrap" style={{ textAlign: "center" }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Core Features</div>
            <h2 className="section-h2" style={{ marginBottom: 12 }}>Memory that works the way developers think</h2>
            <p className="section-sub" style={{ maxWidth: 480, margin: "0 auto" }}>Everything needed for persistent, isolated, automatic debugging memory on a decentralised network.</p>
            <div className="feat-grid">
              {FEATURES.map((f, i) => (
                <div key={i} className="card" style={{ textAlign: "left" }}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-h">{f.h}</div>
                  <div className="feat-p">{f.p}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DARK BAND ── */}
        <section className="dark-band">
          <div className="l-wrap">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 16 }}>Why MemTrace</div>
              <h2 className="section-h2" style={{ color: "#f0ebe3" }}>The key benefits of persistent AI memory</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ background: "linear-gradient(135deg,rgba(255,107,43,.2),rgba(255,107,43,.06))", border: "1px solid rgba(255,107,43,.3)", borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>🔁</div>
                <h3 style={{ color: "#f0ebe3", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>Compound knowledge across sessions</h3>
                <p style={{ color: "#9a9288", fontSize: 14, lineHeight: 1.75 }}>Each session builds on the last. The agent remembers your stack, your patterns, your past mistakes and applies them automatically.</p>
              </div>
              <div style={{ background: "linear-gradient(135deg,rgba(239,206,150,.15),rgba(239,206,150,.04))", border: "1px solid rgba(239,206,150,.25)", borderRadius: 20, padding: 32 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>⚡</div>
                <h3 style={{ color: "#f0ebe3", fontSize: 18, fontWeight: 700, marginBottom: 10 }}>10x faster time-to-fix on recurring bugs</h3>
                <p style={{ color: "#9a9288", fontSize: 14, lineHeight: 1.75 }}>When you hit a class of error you have seen before, the agent surfaces the previous fix in the first message before you even ask.</p>
              </div>
              <div style={{ gridColumn: "1/-1", background: "linear-gradient(135deg,rgba(255,107,43,.15),rgba(239,206,150,.08))", border: "1px solid rgba(255,107,43,.3)", borderRadius: 20, padding: 32, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
                <div>
                  <h3 style={{ color: "#f0ebe3", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Overcome context amnesia today</h3>
                  <p style={{ color: "#9a9288", fontSize: 14, lineHeight: 1.75, maxWidth: 480 }}>Every AI chat starts blank. MemTrace starts with everything you have already taught it.</p>
                </div>
                <Link href="/chat" className="grad-btn" style={{ flexShrink: 0 }}>Try it now</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" style={{ padding: "80px 24px", background: "var(--surface-2)" }}>
          <div className="l-wrap" style={{ maxWidth: 680 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="section-label" style={{ marginBottom: 16 }}>FAQ</div>
              <h2 className="section-h2">Frequently Asked Questions</h2>
            </div>
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <button className="faq-btn" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <div className="faq-icon">{openFaq === i ? "−" : "+"}</div>
                </button>
                <div className="faq-body">{f.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: "80px 24px", textAlign: "center", background: "var(--surface)" }}>
          <div className="l-wrap" style={{ maxWidth: 560 }}>
            <h2 className="section-h2" style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)", marginBottom: 16 }}>Ready to stop forgetting your own fixes?</h2>
            <p className="section-sub" style={{ marginBottom: 32 }}>Free. Private. Permanent on Walrus Mainnet.</p>
            <Link href="/chat" className="grad-btn" style={{ fontSize: 15, padding: "13px 36px" }}>Open MemTrace</Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="l-footer">
        <div className="l-wrap">
          <div className="footer-grid">
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <img src="/logo.png" alt="MemTrace" style={{ width: 24, height: 24, borderRadius: 6, objectFit: "cover" }} />
                MemTrace
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.75, maxWidth: 240, color: "#9CA3AF" }}>A persistent AI debugging assistant built on Walrus Mainnet. Walrus Sessions 5 hackathon submission.</p>
            </div>
            <div>
              <div className="footer-h">Product</div>
              {[{ h: "/chat", l: "Try It" }, { h: "/#features", l: "Features" }, { h: "/#faq", l: "FAQ" }].map(x => <Link key={x.h} href={x.h} className="footer-link">{x.l}</Link>)}
            </div>
            <div>
              <div className="footer-h">Stack</div>
              {["Walrus Mainnet", "Next.js 16", "TypeScript", "Decentralised Storage"].map(x => <div key={x} className="footer-link">{x}</div>)}
            </div>
            <div>
              <div className="footer-h">Hackathon</div>
              <div className="footer-link">Walrus Sessions 5</div>
              <div className="footer-link">Memory Prompt Jam</div>
            </div>
          </div>
          <div className="footer-bottom">© 2026 MemTrace · Built for Walrus Sessions 5</div>
        </div>
      </footer>
    </>
  );
}
