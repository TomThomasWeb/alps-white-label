"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B, SERVICES } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Task = {
  id: string; client_id: string; project_id: string | null; created_by: string;
  title: string; description: string | null; priority: string; status: string;
  service: string | null; due_date: string | null; is_recurring: boolean;
  waiting_for: string | null; created_at: string;
};
type Msg = { id: string; text: string; user_id: string; created_at: string; user_name?: string };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const m: Record<string, [string, string]> = { green: ["#e8f5e9", B.green], amber: ["#fff8e1", "#b8860b"], red: ["#ffebee", B.red], blue: ["#e3f2fd", B.blue], purple: ["#f3e5f5", B.purple], grey: ["#eee", "#666"] };
  const [bg, fg] = m[color] || m.grey;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: fg }}>{children}</span>;
}

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 10 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };
const stColor: Record<string, string> = { pending: "amber", "in-progress": "blue", "waiting-client": "purple", completed: "green", paused: "grey" };
const priColor: Record<string, string> = { high: B.red, medium: B.amber, low: B.green };

export default function TasksPage() {
  const { user, isAdmin, isClientAdmin } = useUser();
  const supabase = createClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [detail, setDetail] = useState<Task | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [msgText, setMsgText] = useState("");
  const [form, setForm] = useState({ title: "", description: "", client_id: "", service: "", priority: "medium", due_date: "" });

  useEffect(() => { loadTasks(); if (isAdmin) loadClients(); }, [user]);

  async function loadTasks() {
    if (!user) return;
    let q = supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (!isAdmin && !isClientAdmin) q = q.eq("created_by", user.id);
    else if (!isAdmin && user.client_id) q = q.eq("client_id", user.client_id);
    const { data } = await q;
    if (data) setTasks(data as Task[]);
    setLoading(false);
  }

  async function loadClients() {
    const { data } = await supabase.from("clients").select("id, name").eq("status", "active").order("name");
    if (data) setClients(data);
  }

  async function openDetail(t: Task) {
    setDetail(t);
    const { data } = await supabase.from("messages").select("*").eq("task_id", t.id).order("created_at");
    if (data) setMsgs(data as Msg[]);
  }

  async function sendMsg() {
    if (!msgText.trim() || !detail || !user) return;
    const { data } = await supabase.from("messages").insert({
      task_id: detail.id, client_id: detail.client_id, type: "task",
      user_id: user.id, text: msgText.trim(),
    }).select().single();
    if (data) setMsgs(p => [...p, data as Msg]);
    setMsgText("");
  }

  async function updateStatus(taskId: string, status: string) {
    await supabase.from("tasks").update({ status }).eq("id", taskId);
    setTasks(p => p.map(t => t.id === taskId ? { ...t, status } : t));
    if (detail?.id === taskId) setDetail(p => p ? { ...p, status } : p);
  }

  async function createTask() {
    if (!form.title || !user) return;
    const clientId = isAdmin ? form.client_id : user.client_id;
    if (!clientId) return;
    const { data } = await supabase.from("tasks").insert({
      client_id: clientId, created_by: user.id, title: form.title,
      description: form.description || null, priority: form.priority,
      service: form.service || null, due_date: form.due_date || null, status: "pending",
    }).select().single();
    if (data) { setTasks(p => [data as Task, ...p]); setShowAdd(false); setForm({ title: "", description: "", client_id: "", service: "", priority: "medium", due_date: "" }); }
  }

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const today = new Date().toISOString().split("T")[0];

  return (
    <PortalShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: 0 }}>{isAdmin ? "Tasks" : "My Requests"}</h1>
          <p style={{ color: "#888", fontSize: 13, margin: "4px 0 0" }}>{filtered.length} {filter === "all" ? "total" : filter}</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ {isAdmin ? "Add Task" : "New Request"}</button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", "pending", "in-progress", "waiting-client", "completed", "paused"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f ? B.green : "#ddd"}`,
            backgroundColor: filter === f ? B.green + "10" : "transparent", color: filter === f ? B.green : "#888",
            fontSize: 12, fontWeight: filter === f ? 600 : 500, cursor: "pointer", textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      {/* Task list */}
      {loading ? <p style={{ color: "#888" }}>Loading...</p> :
        filtered.length === 0 ? <div style={{ ...card, textAlign: "center", padding: 40 }}><p style={{ color: "#888" }}>No tasks.</p></div> :
        filtered.map(t => {
          const svc = SERVICES.find(s => s.id === t.service);
          const cl = clients.find(c => c.id === t.client_id);
          const overdue = t.due_date && t.due_date < today && t.status !== "completed";
          return (
            <div key={t.id} onClick={() => openDetail(t)} style={{ ...card, cursor: "pointer", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                    <div style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: priColor[t.priority] || B.amber }} />
                    {svc && <span style={{ fontSize: 13 }}>{svc.icon}</span>}
                    <span style={{ fontWeight: 700, fontSize: 13, fontFamily: "'Kanit',sans-serif", color: B.gd }}>{t.title}</span>
                    {t.is_recurring && <span style={{ fontSize: 10, color: B.blue }}>🔄</span>}
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#999", flexWrap: "wrap" }}>
                    {isAdmin && cl && <span>{cl.name}</span>}
                    {t.due_date && <span>Due {t.due_date}</span>}
                    {overdue && <Badge color="red">Overdue</Badge>}
                    {t.status === "waiting-client" && t.waiting_for && <span style={{ color: B.purple }}>Waiting: {t.waiting_for}</span>}
                  </div>
                </div>
                <Badge color={stColor[t.status] || "grey"}>{t.status}</Badge>
              </div>
            </div>
          );
        })}

      {/* Task Detail Modal */}
      {detail && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setDetail(null)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 620, maxHeight: "90vh", overflow: "auto", padding: 0 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, backgroundColor: B.white, zIndex: 1 }}>
              <h3 style={{ margin: 0, fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd }}>{detail.title}</h3>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#999" }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge color={stColor[detail.status] || "grey"}>{detail.status}</Badge>
                <Badge color={detail.priority === "high" ? "red" : detail.priority === "medium" ? "amber" : "green"}>{detail.priority}</Badge>
                {detail.due_date && <span style={{ fontSize: 12, color: "#888" }}>Due: {detail.due_date}</span>}
              </div>
              {detail.description && <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{detail.description}</p>}

              {/* Status buttons (admin) */}
              {isAdmin && (
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {["pending", "in-progress", "waiting-client", "completed", "paused"].map(s => (
                    <button key={s} onClick={() => updateStatus(detail.id, s)} style={{
                      padding: "4px 10px", borderRadius: 6, border: `1px solid ${detail.status === s ? B.green : "#ddd"}`,
                      backgroundColor: detail.status === s ? B.green + "10" : "transparent",
                      color: detail.status === s ? B.green : "#888", fontSize: 10, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
                    }}>{s.replace("-", " ")}</button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <h4 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 13, color: B.gd, margin: "0 0 8px" }}>Messages ({msgs.length})</h4>
              <div style={{ maxHeight: 250, overflow: "auto", marginBottom: 12 }}>
                {msgs.length === 0 && <div style={{ color: "#888", fontSize: 13 }}>No messages yet.</div>}
                {msgs.map(m => {
                  const isMe = m.user_id === user?.id;
                  return (
                    <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 8 }}>
                      <div style={{ maxWidth: "75%", padding: "8px 12px", borderRadius: 10, backgroundColor: isMe ? B.green : "#f0f0f0", color: isMe ? B.white : B.black, fontSize: 12, lineHeight: 1.5 }}>
                        {m.text}
                        <div style={{ fontSize: 9, opacity: 0.5, marginTop: 3, textAlign: "right" }}>{new Date(m.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <input value={msgText} onChange={e => setMsgText(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()} placeholder="Message..." style={{ flex: 1, padding: "8px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontSize: 12, outline: "none" }} />
                <button onClick={sendMsg} disabled={!msgText.trim()} style={{ padding: "8px 14px", backgroundColor: msgText.trim() ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: msgText.trim() ? "pointer" : "not-allowed", fontWeight: 600, fontSize: 12 }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowAdd(false)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 540, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 16px" }}>{isAdmin ? "Create Task" : "Submit a Request"}</h2>
            <label style={lbl}>What do you need?</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Brief title" style={inp} />
            <label style={lbl}>Service Type</label>
            <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
            </select>
            <label style={lbl}>Details</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Context, deadlines, specifics" rows={3} style={{ ...inp, resize: "vertical" as const }} />
            {isAdmin && <>
              <label style={lbl}>Client</label>
              <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} style={inp}>
                <option value="">Select...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={lbl}>Priority</label><select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={inp}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
              <div><label style={lbl}>Due Date</label><input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} style={inp} /></div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={createTask} disabled={!form.title} style={{ padding: "9px 16px", backgroundColor: form.title ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.title ? "pointer" : "not-allowed", fontWeight: 600 }}>{isAdmin ? "Create" : "Submit"}</button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
