"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Types ── */
interface Msg { role:"user"|"assistant"; content:string; ts:Date; writes?:string[]; err?:boolean; }
interface Chat { id:string; title:string; ws:string; ts:Date; msgs:Msg[]; }

/* ── Persist ── */
const LS = {
  get: (k:string) => { try { return JSON.parse(localStorage.getItem(k)??"null") } catch { return null } },
  set: (k:string, v:unknown) => localStorage.setItem(k, JSON.stringify(v)),
};

const loadChats = (u:string): Chat[] => {
  const raw = LS.get(`mt-chats-${u}`) ?? [];
  return raw.map((c:Chat) => ({ ...c, ts: new Date(c.ts), msgs: c.msgs.map((m:Msg) => ({ ...m, ts: new Date(m.ts) })) }));
};
const saveChats = (u:string, chats:Chat[]) => LS.set(`mt-chats-${u}`, chats.slice(0,40));

const mkId = () => Math.random().toString(36).slice(2,10);
const today = (d:Date) => { const t = new Date(); return d.toDateString() === t.toDateString(); };
const yesterday = (d:Date) => { const y = new Date(); y.setDate(y.getDate()-1); return d.toDateString() === y.toDateString(); };

/* ── User avatar palette ── */
const USER_AVATARS = [
  "/avatar-u1.png", // nerd glasses + hoodie
  "/avatar-u2.png", // headphones thumbs up
  "/avatar-u3.png", // beanie + coffee
  "/avatar-u4.png", // red cap + skateboard
  "/avatar-u5.png", // flower crown waving
];
const getAvatar = (u: string): string =>
  USER_AVATARS[u.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % USER_AVATARS.length];

/* ── Icons ── */
const I = {
  newChat: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  folder: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>,
  send: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  collapse: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>,
  sun: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  moon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
};

/* ── Login Screen ── */
function Login({ onLogin }: { onLogin:(u:string,w:string)=>void }) {
  const [u,setU]=useState(""); const [w,setW]=useState("myprojects");
  const go = () => { const uu=u.trim().toLowerCase().replace(/\s+/g,""); if(uu) onLogin(uu,w.trim()||"default"); };
  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0a0a0a",padding:24,fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:52,height:52,borderRadius:14,overflow:"hidden",margin:"0 auto 14px",boxShadow:"0 0 24px rgba(255,107,43,.4)"}}>
            <img src="/logo.png" alt="MemTrace" style={{width:"100%",height:"100%",objectFit:"cover"}} />
          </div>
          <h1 style={{fontSize:22,fontWeight:700,color:"#f0ebe3",marginBottom:6}}>Welcome to MemTrace</h1>
          <p style={{fontSize:14,color:"#9a9288",lineHeight:1.6}}>Your username scopes all memories to a private Walrus vault.<br/>No signup required.</p>
        </div>
        <div style={{background:"#161310",borderRadius:20,padding:"28px 24px",boxShadow:"0 4px 24px rgba(0,0,0,.4)",border:"1px solid #2a2520"}}>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#c8b99a",marginBottom:6}}>Username</label>
            <input value={u} onChange={e=>setU(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="e.g. vikajoestar" autoFocus
              style={{width:"100%",padding:"10px 16px",border:"1.5px solid #2a2520",background:"#1a1510",borderRadius:99,fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif",color:"#e8ddd0",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="#FF6B2B"} onBlur={e=>e.target.style.borderColor="#2a2520"} />
          </div>
          <div style={{marginBottom:24}}>
            <label style={{display:"block",fontSize:13,fontWeight:600,color:"#c8b99a",marginBottom:6}}>Workspace</label>
            <input value={w} onChange={e=>setW(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="e.g. myprojects"
              style={{width:"100%",padding:"10px 16px",border:"1.5px solid #2a2520",background:"#1a1510",borderRadius:99,fontSize:14,outline:"none",fontFamily:"'DM Sans',sans-serif",color:"#e8ddd0",transition:"border .2s"}}
              onFocus={e=>e.target.style.borderColor="#FF6B2B"} onBlur={e=>e.target.style.borderColor="#2a2520"} />
          </div>
          <button onClick={go} disabled={!u.trim()}
            style={{width:"100%",padding:"11px",borderRadius:99,border:"none",cursor:u.trim()?"pointer":"not-allowed",fontSize:14,fontWeight:600,color:"#fff",background:"linear-gradient(97deg,#FF6B2B,#EFCE96)",opacity:u.trim()?1:.4,fontFamily:"'DM Sans',sans-serif",transition:"opacity .2s,transform .2s"}}
            onMouseEnter={e=>u.trim()&&((e.currentTarget as HTMLElement).style.transform="translateY(-1px)")}
            onMouseLeave={e=>((e.currentTarget as HTMLElement).style.transform="translateY(0)")}>
            Enter MemTrace
          </button>
        </div>
        <p style={{textAlign:"center",fontSize:12,color:"#6b5e52",marginTop:16}}>Memory is stored on Walrus Mainnet. Your data never touches our servers.</p>
      </div>
    </div>
  );
}

/* ── Markdown renderer — strips raw symbols ── */
function renderInline(text: string, key: number) {
  // strip bold/italic markers
  const clean = text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1');
  const parts = clean.split(/(`[^`]+`)/g);
  return (
    <span key={key}>
      {parts.map((p,j) => p.startsWith('`') && p.endsWith('`')
        ? <code key={j} style={{background:'rgba(55,88,249,.08)',color:'#3758F9',padding:'1px 6px',borderRadius:4,fontSize:'0.9em',fontFamily:'monospace'}}>{p.slice(1,-1)}</code>
        : <span key={j}>{p}</span>)}
    </span>
  );
}
function MsgContent({ text }: { text:string }) {
  const lines = text.split('\n');
  let inCode = false;
  const codeLines: string[] = [];
  const out: React.ReactNode[] = [];
  lines.forEach((raw, i) => {
    const line = raw;
    if (line.startsWith('```')) { inCode = !inCode; if (!inCode && codeLines.length) { out.push(<pre key={i} style={{background:'#F3F4F6',borderRadius:8,padding:'10px 14px',fontSize:13,overflowX:'auto',margin:'8px 0',fontFamily:'monospace',color:'#1F2937'}}>{codeLines.join('\n')}</pre>); codeLines.length=0; } return; }
    if (inCode) { codeLines.push(line); return; }
    if (/^#{1,4} /.test(line)) { const t=line.replace(/^#+\s/,''); out.push(<div key={i} style={{fontWeight:700,fontSize:14,margin:'10px 0 4px'}}>{t}</div>); return; }
    if (line.startsWith('- ') || line.startsWith('* ')) { out.push(<div key={i} style={{display:'flex',gap:6,margin:'2px 0'}}><span style={{flexShrink:0}}>•</span>{renderInline(line.slice(2),i)}</div>); return; }
    if (/^\d+\.\s/.test(line)) { out.push(<div key={i} style={{margin:'2px 0'}}>{renderInline(line,i)}</div>); return; }
    if (line.startsWith('---')) { out.push(<hr key={i} style={{border:'none',borderTop:'1px solid rgba(0,0,0,.1)',margin:'10px 0'}}/>); return; }
    if (!line.trim()) { out.push(<div key={i} style={{height:6}}/>); return; }
    out.push(<div key={i} style={{margin:'2px 0'}}>{renderInline(line,i)}</div>);
  });
  return <div>{out}</div>;
}

/* ── Main Chat ── */
export default function Chat() {
  const [username, setUsername] = useState<string|null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string|null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sbOpen, setSbOpen] = useState(true);
  const [mobileSbOpen, setMobileSbOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [dark, setDark] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  const activeChat = chats.find(c => c.id === activeChatId) ?? null;
  const msgs = activeChat?.msgs ?? [];

  // Load user from localStorage
  useEffect(() => {
    const u = localStorage.getItem("mt-username");
    const w = localStorage.getItem("mt-workspace") ?? "myprojects";
    if (u) { setUsername(u); setChats(loadChats(u)); }
    const saved = localStorage.getItem("theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.body.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const toggleDark = () => {
    const nd = !dark; setDark(nd);
    document.body.classList.toggle("dark", nd);
    localStorage.setItem("theme", nd ? "dark" : "light");
  };

  const doLogin = (u:string, w:string) => {
    localStorage.setItem("mt-username", u);
    localStorage.setItem("mt-workspace", w);
    setUsername(u);
    setChats(loadChats(u));
  };

  // New Chat only if current active chat has at least 1 message (or no active chat)
  const newChat = useCallback(() => {
    if (!username) return;
    if (activeChatId) {
      const cur = chats.find(c => c.id === activeChatId);
      if (cur && cur.msgs.length === 0) { setInput(""); return; } // already empty
    }
    const ws = localStorage.getItem("mt-workspace") ?? "myprojects";
    const id = mkId();
    const c: Chat = { id, title: "New Chat", ws, ts: new Date(), msgs: [] };
    const next = [c, ...chats];
    setChats(next);
    saveChats(username, next);
    setActiveChatId(id);
    setInput("");
  }, [username, chats, activeChatId]);

  const deleteChat = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!username) return;
    const next = chats.filter(c => c.id !== id);
    setChats(next);
    saveChats(username, next);
    if (activeChatId === id) setActiveChatId(next[0]?.id ?? null);
  }, [username, chats, activeChatId]);

  const send = async () => {
    if (!input.trim() || loading || !username) return;
    const ws = activeChat?.ws ?? localStorage.getItem("mt-workspace") ?? "myprojects";
    let chatId = activeChatId;
    let currentChats = chats;

    // Create chat if none active
    if (!chatId) {
      const id = mkId();
      const title = input.slice(0, 40);
      const c: Chat = { id, title, ws, ts: new Date(), msgs: [] };
      currentChats = [c, ...chats];
      setChats(currentChats);
      chatId = id;
      setActiveChatId(id);
    }

    const um: Msg = { role: "user", content: input, ts: new Date() };
    const updC = currentChats.map(c => c.id === chatId ? { ...c, title: c.msgs.length === 0 ? input.slice(0,40) : c.title, msgs: [...c.msgs, um] } : c);
    setChats(updC);
    saveChats(username, updC);
    setInput("");
    setLoading(true);

    try {
      const allMsgs = (updC.find(c => c.id === chatId)?.msgs ?? []);
      const r = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: allMsgs.map(m => ({ role: m.role, content: m.content })), username, workspace: ws }) });
      const d = await r.json();
      const am: Msg = d.success
        ? { role: "assistant", content: d.message, ts: new Date(), writes: d.memoryWrites }
        : { role: "assistant", content: `Error: ${d.error}`, ts: new Date(), err: true };
      const final = updC.map(c => c.id === chatId ? { ...c, msgs: [...c.msgs, am] } : c);
      setChats(final);
      saveChats(username, final);
    } catch {
      const am: Msg = { role: "assistant", content: "Connection failed. Check your internet connection.", ts: new Date(), err: true };
      setChats(prev => { const f = prev.map(c => c.id === chatId ? { ...c, msgs: [...c.msgs, am] } : c); saveChats(username, f); return f; });
    } finally { setLoading(false); }
  };

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  const autoResize = () => {
    if (!taRef.current) return;
    taRef.current.style.height = "auto";
    taRef.current.style.height = Math.min(taRef.current.scrollHeight, 200) + "px";
  };

  if (!username) return <Login onLogin={doLogin} />;

  // Group chats
  const todayChats = chats.filter(c => today(c.ts));
  const yestChats = chats.filter(c => yesterday(c.ts));
  const olderChats = chats.filter(c => !today(c.ts) && !yesterday(c.ts));

  // Workspaces (unique from chats)
  const workspaces = [...new Set(chats.map(c => c.ws))];

  // Search results
  const searchResults = searchQ.trim()
    ? chats.filter(c => c.title.toLowerCase().includes(searchQ.toLowerCase()) || c.msgs.some(m => m.content.toLowerCase().includes(searchQ.toLowerCase())))
    : [];

  const hItem = (c: Chat) => (
    <div key={c.id} className={`hist-item ${c.id === activeChatId ? "active" : ""}`}
      style={{position:'relative'}}
      onClick={() => { setActiveChatId(c.id); setMobileSbOpen(false); }}
      onMouseEnter={e => { const b = e.currentTarget.querySelector('.del-btn') as HTMLElement; if(b) b.style.opacity='1'; }}
      onMouseLeave={e => { const b = e.currentTarget.querySelector('.del-btn') as HTMLElement; if(b) b.style.opacity='0'; }}>
      <div className="hist-title">{c.title}</div>
      <button className="del-btn" onClick={e => deleteChat(c.id, e)}
        style={{opacity:0,transition:'opacity .15s',background:'transparent',border:'none',cursor:'pointer',padding:'2px 4px',color:'#9CA3AF',flexShrink:0,lineHeight:1}}>
        {I.trash}
      </button>
    </div>
  );

  return (
    <>
      {/* Search overlay */}
      <div className={`search-overlay ${searchOpen ? "open" : ""}`} onClick={e => e.target === e.currentTarget && setSearchOpen(false)}>
        <div className="search-box">
          <input className="search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search chats..." autoFocus={searchOpen} />
          {searchQ && (
            <div className="search-results">
              {searchResults.length === 0
                ? <div className="search-empty">No results found</div>
                : searchResults.map(c => (
                  <div key={c.id} className="search-result-item" onClick={() => { setActiveChatId(c.id); setSearchOpen(false); setSearchQ(""); }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{c.ws} · {c.ts.toLocaleDateString()}</div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile overlay */}
      <div className={`sb-overlay ${mobileSbOpen ? "open" : ""}`} onClick={() => setMobileSbOpen(false)} />

      <div className="chat-root">
        {/* ── SIDEBAR ── */}
        <aside className={`chat-sb ${!sbOpen ? "collapsed" : ""} ${mobileSbOpen ? "mobile-open" : ""}`}>
          <div className="sb-top">
            <div className="sb-logo">
              <Link href="/" className="sb-logo-text" style={{textDecoration:'none',color:'inherit'}}>
                <img src="/logo.png" alt="MemTrace" style={{ width: 28, height: 28, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                MemTrace
              </Link>
              <button className="ch-icon-btn" onClick={() => setSbOpen(false)} title="Collapse">{I.collapse}</button>
            </div>
            <button className="sb-action-btn" onClick={newChat}>{I.newChat} New Chat</button>
            <button className="sb-action-btn" onClick={() => { setSearchOpen(true); setSearchQ(""); }}>{I.search} Search</button>
          </div>

          {/* Projects */}
          <div className="sb-section" style={{ flex: "none" }}>
            <div className="sb-section-label">
              Projects
              <button className="sb-add-btn" onClick={newChat} title="New chat">+</button>
            </div>
            {workspaces.length === 0 && <div style={{ fontSize: 12, color: "#9CA3AF", padding: "4px 2px" }}>No workspaces yet</div>}
            {workspaces.map(ws => {
              const cnt = chats.filter(c => c.ws === ws).length;
              return (
                <div key={ws} className={`proj-item ${activeChat?.ws === ws ? "active" : ""}`}>
                  <span style={{ color: "#6B7280" }}>{I.folder}</span>
                  <span className="proj-name">{ws}</span>
                  <span className="proj-badge">{String(cnt).padStart(2, "0")}</span>
                </div>
              );
            })}
          </div>

          {/* History */}
          <div style={{ flex: 1, overflowY: "auto", paddingBottom: 8 }}>
            {todayChats.length > 0 && <><div className="hist-group">Today</div>{todayChats.map(hItem)}</>}
            {yestChats.length > 0 && <><div className="hist-group">Yesterday</div>{yestChats.map(hItem)}</>}
            {olderChats.length > 0 && <><div className="hist-group">Older</div>{olderChats.map(hItem)}</>}
            {chats.length === 0 && <div style={{ padding: "16px 18px", fontSize: 13, color: "#9CA3AF" }}>No chats yet. Click New Chat to start.</div>}
          </div>

          {/* User card */}
          <div className="sb-user">
            <img src={getAvatar(username)} alt={username} style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',flexShrink:0}} />
            <div style={{ flex: 1, overflow: "hidden" }}>
              <div className="sb-user-name">{username}</div>
              <div className="sb-user-plan">Walrus Mainnet</div>
            </div>
            <button className="sb-upgrade-btn" onClick={() => { localStorage.removeItem("mt-username"); setUsername(null); }}>Logout</button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="chat-main">
          {/* Header */}
          <div className="chat-header">
            {!sbOpen && (
              <button className="ch-icon-btn" onClick={() => setSbOpen(true)} title="Expand sidebar">{I.collapse}</button>
            )}
            <div className="chat-header-title">{activeChat?.title ?? "MemTrace AI Agent"}</div>
            <button className="ch-icon-btn" onClick={() => setSearchOpen(true)} title="Search">{I.search}</button>
            <button className="ch-icon-btn" onClick={toggleDark} title="Toggle theme">{dark ? I.sun : I.moon}</button>
            <button className="ch-icon-btn" onClick={newChat} title="New chat">{I.newChat}</button>
          </div>

          {/* Messages */}
          <div className="chat-msgs">
            {msgs.length === 0 ? (
              <div className="chat-welcome">
                <div style={{ fontSize: 40, marginBottom: 16 }}>🧠</div>
                <div className="chat-welcome-title">Hey, How Can I Assist?</div>
                <p className="chat-welcome-sub">MemTrace is your AI debugging assistant with persistent memory on Walrus Mainnet. Every bug fix and decision is remembered across sessions.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginTop: 28 }}>
                  {["My Docker container exits immediately.", "TypeScript says Property does not exist on type.", "My API returns 500 only in production.", "CORS error when calling the API from frontend."].map((s, i) => (
                    <button key={i} onClick={() => { setInput(s); taRef.current?.focus(); }}
                      style={{ padding: "8px 16px", borderRadius: 99, border: "1.5px solid #2a2520", background: "#161310", fontSize: 13, color: "#c8b99a", cursor: "pointer", transition: "all .15s", fontFamily: "'DM Sans',sans-serif" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#FF6B2B"; (e.currentTarget as HTMLElement).style.color = "#FF6B2B"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2520"; (e.currentTarget as HTMLElement).style.color = "#c8b99a"; }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {msgs.map((m, i) => {
                  return (
                  <div key={i} className={`msg-row ${m.role}`}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:m.role==='user'?'flex-end':'flex-start',gap:2}}>
                      <div style={{fontSize:11,fontWeight:600,color:'#6B7280',padding:m.role==='user'?'0 4px 0 0':'0 0 0 4px'}}>
                        {m.role==='user' ? username : 'MemTrace AI Agent'}
                      </div>
                      <div style={{display:'flex',gap:8,alignItems:'flex-start',flexDirection:m.role==='user'?'row-reverse':'row'}}>
                        <div className={`msg-avatar ${m.role}`} style={{padding:0,overflow:'hidden'}}>
                          <img src={m.role==='user' ? getAvatar(username) : '/avatar-ai.png'} alt={m.role==='user'?username:'AI'} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                        </div>
                        <div>
                          <div className={`msg-bubble ${m.role}`} style={m.err ? { background: "#FEE2E2", color: "#991B1B" } : {}}>
                            {m.role === "assistant" && !m.err ? <MsgContent text={m.content} /> : m.content}
                          </div>
                          <div className="msg-meta">{m.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}{m.writes?.length ? ` · 💾 stored: ${m.writes.join(", ")}` : ""}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
                {loading && (
                  <div className="msg-row">
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      <div style={{fontSize:11,fontWeight:600,color:'#6B7280',padding:'0 0 0 4px'}}>MemTrace AI Agent</div>
                      <div style={{display:'flex',gap:8,alignItems:'flex-start'}}>
                        <div className="msg-avatar ai" style={{padding:0,overflow:'hidden'}}><img src="/avatar-ai.png" width={34} height={34} style={{borderRadius:'50%',objectFit:'cover'}} alt="AI" /></div>
                        <div className="msg-bubble ai" style={{ padding: "14px 16px" }}>
                          <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-wrap">
            <div className="chat-input-box">
              <textarea ref={taRef} className="chat-textarea" value={input} onChange={e => { setInput(e.target.value); autoResize(); }} onKeyDown={handleKey} placeholder="Ask me anything..." rows={1} />
              <div className="chat-toolbar">
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {activeChat?.ws ?? localStorage.getItem("mt-workspace") ?? "myprojects"} · MemTrace AI
                </div>
                <button className="ct-send ml-auto" onClick={send} disabled={loading || !input.trim()} title="Send">
                  {I.send}
                </button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>Enter to send · Shift+Enter for newline · Fixes stored to Walrus automatically</div>
          </div>
        </div>
      </div>
    </>
  );
}
