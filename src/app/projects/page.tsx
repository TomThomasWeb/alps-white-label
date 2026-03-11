"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B, SERVICES, STAGES } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Project = {
  id: string; client_id: string; name: string; description: string | null;
  service: string; stage: number; status: string; category: string | null;
  deadline: string | null; scope: string | null; brief: string | null;
  deliverables: string[] | null; budget_hours: number; budget_amount: number;
  kickoff: { item: string; done: boolean }[] | null; created_at: string;
};
type Task = { id: string; title: string; status: string; due_date: string | null; priority: string };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const m: Record<string, [string, string]> = { green: ["#e8f5e9", B.green], amber: ["#fff8e1", "#b8860b"], red: ["#ffebee", B.red], blue: ["#e3f2fd", B.blue], purple: ["#f3e5f5", B.purple], grey: ["#eee", "#666"] };
  const [bg, fg] = m[color] || m.grey;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: fg }}>{children}</span>;
}

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };

export default function ProjectsPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("active");
  const [sel, setSel] = useState<Project | null>(null);
  const [tab, setTab] = useState("overview");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", client_id: "", service: "", description: "", brief: "", deadline: "", budget_hours: "" });

  useEffect(() => { loadProjects(); if (isAdmin) loadClients(); }, [user]);

  async function loadProjects() {
    if (!user) return;
    let q = supabase.from("projects").select("*").order("created_at", { ascending: false });
    if (!isAdmin && user.client_id) q = q.eq("client_id", user.client_id);
    const { data } = await q;
    if (data) setProjects(data as Project[]);
    setLoading(false);
  }

  async function loadClients() {
    const { data } = await supabase.from("clients").select("id, name").eq("status", "active").order("name");
    if (data) setClients(data);
  }

  async function selectProject(p: Project) {
    setSel(p); setTab("overview");
    const { data } = await supabase.from("tasks").select("id, title, status, due_date, priority").eq("project_id", p.id).order("created_at");
    if (data) setTasks(data as Task[]);
  }

  async function updateStage(id: string, stage: number) {
    await supabase.from("projects").update({ stage }).eq("id", id);
    setProjects(p => p.map(pr => pr.id === id ? { ...pr, stage } : pr));
    if (sel?.id === id) setSel(p => p ? { ...p, stage } : p);
  }

  async function createProject() {
    if (!form.name || !form.client_id || !form.service || !user) return;
    const budgetHrs = parseInt(form.budget_hours) || 0;
    const { data: proj } = await supabase.from("projects").insert({
      client_id: form.client_id, name: form.name, service: form.service,
      description: form.description || null, brief: form.brief || null,
      deadline: form.deadline || null, budget_hours: budgetHrs, budget_amount: budgetHrs * 20,
      status: "active", stage: 0, category: "one-off",
    }).select().single();

    if (proj) {
      // Auto-create template tasks
      const svc = SERVICES.find(s => s.id === form.service);
      const tmpl = svc?.label ? [] : []; // Templates would come from expanded SERVICES
      setProjects(p => [proj as Project, ...p]);
      setShowAdd(false);
      setForm({ name: "", client_id: "", service: "", description: "", brief: "", deadline: "", budget_hours: "" });
    }
  }

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter);

  // DETAIL VIEW
  if (sel) {
    const p = sel;
    const svc = SERVICES.find(s => s.id === p.service);
    const cl = clients.find(c => c.id === p.client_id);
    const done = tasks.filter(t => t.status === "completed").length;
    const stColor: Record<string, string> = { pending: "amber", "in-progress": "blue", completed: "green", paused: "grey", "waiting-client": "purple" };

    return (
      <PortalShell>
        <div style={{ display: "flex", gap: 6, marginBottom: 16, fontSize: 13 }}>
          <span style={{ color: B.green, cursor: "pointer" }} onClick={() => setSel(null)}>Projects</span>
          <span style={{ color: "#ccc" }}>/</span>
          <span style={{ fontWeight: 600, color: B.gd }}>{p.name}</span>
        </div>

        {/* Header */}
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 22 }}>{svc?.icon || "📁"}</span>
                <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 22, color: B.gd, margin: 0 }}>{p.name}</h1>
                <Badge color={p.status === "active" ? "green" : p.status === "completed" ? "blue" : "amber"}>{p.status}</Badge>
                {isAdmin && cl && <Badge color="grey">{cl.name}</Badge>}
              </div>
              {p.description && <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{p.description}</p>}
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#888", marginTop: 6 }}>
                <span>Started {new Date(p.created_at).toLocaleDateString("en-GB")}</span>
                {p.deadline && <span style={{ color: B.amber, fontWeight: 600 }}>Deadline: {p.deadline}</span>}
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", gap: 3 }}>{STAGES.map((_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= p.stage ? B.green : "#e0e0e0" }} />)}</div>
            <div style={{ fontSize: 11, color: B.green, fontWeight: 600, marginTop: 4 }}>{STAGES[p.stage]}</div>
          </div>
          {/* Stats */}
          <div style={{ display: "flex", gap: 16, marginTop: 14, paddingTop: 12, borderTop: "1px solid #eee", flexWrap: "wrap" }}>
            <div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{done}/{tasks.length}</div><div style={{ fontSize: 10, color: "#888" }}>Tasks done</div></div>
            {p.budget_hours > 0 && <div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{p.budget_hours}h</div><div style={{ fontSize: 10, color: "#888" }}>Budget</div></div>}
            {p.budget_amount > 0 && <div><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>£{p.budget_amount}</div><div style={{ fontSize: 10, color: "#888" }}>Amount</div></div>}
          </div>
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {["overview", "tasks", "scope"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", backgroundColor: tab === t ? B.green : B.grey, color: tab === t ? B.white : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "overview" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {/* Stage timeline */}
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Timeline</h3>
            {STAGES.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: i < p.stage ? B.green : i === p.stage ? B.green : "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {i < p.stage && <span style={{ color: B.white, fontSize: 12 }}>✓</span>}
                  {i === p.stage && <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: B.white }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: i === p.stage ? 700 : 400, color: i <= p.stage ? B.gd : "#aaa" }}>{s}{i === p.stage ? " (current)" : ""}</div>
                </div>
                {isAdmin && i === p.stage && (
                  <select value={p.stage} onChange={e => updateStage(p.id, parseInt(e.target.value))} style={{ padding: "2px 6px", borderRadius: 4, border: "1px solid #ddd", fontSize: 10 }}>
                    {STAGES.map((st, idx) => <option key={idx} value={idx}>{st}</option>)}
                  </select>
                )}
              </div>
            ))}
          </div>
          {/* Kickoff checklist */}
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Kickoff Checklist</h3>
            {(!p.kickoff || p.kickoff.length === 0) ? <div style={{ fontSize: 13, color: "#888" }}>No checklist items.</div> :
              (p.kickoff || []).map((k, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${k.done ? B.green : "#ddd"}`, backgroundColor: k.done ? B.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {k.done && <span style={{ color: B.white, fontSize: 10 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 13, color: k.done ? "#aaa" : B.black, textDecoration: k.done ? "line-through" : "none" }}>{k.item}</span>
                </div>
              ))}
          </div>
        </div>}

        {tab === "tasks" && <div style={card}>
          <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Tasks ({tasks.length})</h3>
          {tasks.length === 0 ? <div style={{ color: "#888", fontSize: 13 }}>No tasks for this project.</div> :
            tasks.map(t => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: { pending: B.amber, "in-progress": B.blue, completed: B.green, paused: "#ccc", "waiting-client": B.purple }[t.status] || "#ccc", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{t.due_date ? `Due ${t.due_date}` : ""}</div>
                </div>
                <Badge color={stColor[t.status] || "grey"}>{t.status}</Badge>
              </div>
            ))}
        </div>}

        {tab === "scope" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Brief</h3>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, padding: 12, backgroundColor: B.grey, borderRadius: 8 }}>{p.brief || "No brief provided."}</div>
          </div>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Scope</h3>
            <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7 }}>{p.scope || "No scope defined."}</div>
            {(p.deliverables || []).length > 0 && <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 6 }}>Deliverables</div>
              {(p.deliverables || []).map((d, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}><span style={{ color: B.green }}>✓</span>{d}</div>)}
            </div>}
          </div>
        </div>}
      </PortalShell>
    );
  }

  // LIST VIEW
  return (
    <PortalShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: 0 }}>Projects</h1>
        {isAdmin && <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ New Project</button>}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["active", "completed", "paused", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f ? B.green : "#ddd"}`,
            backgroundColor: filter === f ? B.green + "10" : "transparent", color: filter === f ? B.green : "#888",
            fontSize: 12, fontWeight: filter === f ? 600 : 500, cursor: "pointer", textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> :
        filtered.length === 0 ? <div style={{ ...card, textAlign: "center", padding: 40 }}><p style={{ color: "#888" }}>No projects.</p></div> :
        filtered.map(p => {
          const svc = SERVICES.find(s => s.id === p.service);
          const cl = clients.find(c => c.id === p.client_id);
          return (
            <div key={p.id} onClick={() => selectProject(p)} style={{ ...card, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 16 }}>{svc?.icon || "📁"}</span>
                  <span style={{ fontFamily: "'Kanit',sans-serif", fontSize: 16, color: B.gd, fontWeight: 600 }}>{p.name}</span>
                  {isAdmin && cl && <Badge color="grey">{cl.name}</Badge>}
                  <Badge color={p.category === "retainer" ? "blue" : "grey"}>{p.category || "one-off"}</Badge>
                </div>
                {p.deadline && <span style={{ fontSize: 11, color: B.amber, fontWeight: 600 }}>Due {p.deadline}</span>}
              </div>
              {p.description && <p style={{ fontSize: 12, color: "#666", margin: "0 0 8px" }}>{p.description}</p>}
              <div style={{ display: "flex", gap: 3 }}>{STAGES.map((_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= p.stage ? B.green : "#e0e0e0" }} />)}</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 6 }}>{STAGES[p.stage]} - Started {new Date(p.created_at).toLocaleDateString("en-GB")}</div>
            </div>
          );
        })}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowAdd(false)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 560, padding: 24, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 16px" }}>New Project</h2>
            <label style={lbl}>Project Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Website Redesign" style={inp} />
            <label style={lbl}>Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={lbl}>Service</label>
            <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
            </select>
            <label style={lbl}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} style={{ ...inp, resize: "vertical" as const }} />
            <label style={lbl}>Brief</label>
            <textarea value={form.brief} onChange={e => setForm(p => ({ ...p, brief: e.target.value }))} placeholder="What does the client want?" rows={3} style={{ ...inp, resize: "vertical" as const }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={lbl}>Deadline</label><input type="date" value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} style={inp} /></div>
              <div><label style={lbl}>Budget (hours)</label><input type="number" value={form.budget_hours} onChange={e => setForm(p => ({ ...p, budget_hours: e.target.value }))} placeholder="e.g. 40" style={inp} /></div>
            </div>
            {form.budget_hours && <div style={{ fontSize: 12, color: B.green, marginBottom: 14 }}>Budget: £{(parseInt(form.budget_hours) || 0) * 20} at £20/hr</div>}
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={createProject} disabled={!form.name || !form.client_id || !form.service} style={{ padding: "9px 16px", backgroundColor: form.name && form.client_id && form.service ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.name && form.client_id && form.service ? "pointer" : "not-allowed", fontWeight: 600 }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
