"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B, SERVICES } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Client = {
  id: string; name: string; email: string; phone: string | null; address: string | null;
  status: string; joined_at: string; domain: string | null; domain_expiry: string | null;
  industry: string | null; employees: string | null; annual_budget: string | null;
  goals: string | null; hourly_rate: number; payment_terms: string | null;
  payment_history: string | null; discount_percent: number; credit_balance: number;
  social: Record<string, string> | null; tags: string[] | null; positioning: string | null;
  preferred_comms: string | null; referral_code: string | null; referral_count: number;
  last_active_at: string | null; company_number: string | null; vat_number: string | null;
  ssl_active: boolean; hosting_status: string | null;
};
type Note = { id: string; text: string; created_at: string };
type ClientUser = { id: string; name: string; email: string; role: string; avatar_initials: string | null };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const m: Record<string, [string, string]> = { green: ["#e8f5e9", B.green], amber: ["#fff8e1", "#b8860b"], red: ["#ffebee", B.red], blue: ["#e3f2fd", B.blue], purple: ["#f3e5f5", B.purple], grey: ["#eee", "#666"] };
  const [bg, fg] = m[color] || m.grey;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: fg }}>{children}</span>;
}

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };

export default function ClientsPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Client | null>(null);
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Client>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteText, setNoteText] = useState("");
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", industry: "" });
  const [projects, setProjects] = useState<{ id: string; name: string; service: string; status: string; stage: number }[]>([]);
  const [invoices, setInvoices] = useState<{ id: string; invoice_number: string; status: string }[]>([]);
  const [taskCount, setTaskCount] = useState(0);

  // Invite state
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", role: "client-admin" });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMsg, setInviteMsg] = useState("");

  // Toast
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => { loadClients(); }, []);

  async function loadClients() {
    const { data } = await supabase.from("clients").select("*").order("name");
    if (data) setClients(data as Client[]);
    setLoading(false);
  }

  async function selectClient(c: Client) {
    setSel(c); setTab("profile"); setEditing(false);
    const [nR, pR, iR, tR, uR] = await Promise.all([
      supabase.from("client_notes").select("*").eq("client_id", c.id).order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name, service, status, stage").eq("client_id", c.id),
      supabase.from("invoices").select("id, invoice_number, status").eq("client_id", c.id),
      supabase.from("tasks").select("id", { count: "exact" }).eq("client_id", c.id),
      supabase.from("users").select("id, name, email, role, avatar_initials").eq("client_id", c.id),
    ]);
    setNotes((nR.data || []) as Note[]);
    setProjects((pR.data || []) as typeof projects);
    setInvoices((iR.data || []) as typeof invoices);
    setTaskCount(tR.count || 0);
    setClientUsers((uR.data || []) as ClientUser[]);
  }

  async function saveEdit() {
    if (!sel) return;
    const { error } = await supabase.from("clients").update(editForm).eq("id", sel.id);
    if (!error) {
      const updated = { ...sel, ...editForm } as Client;
      setSel(updated);
      setClients(p => p.map(c => c.id === sel.id ? updated : c));
      setEditing(false);
      showToast("Client updated");
    }
  }

  function startEditing() {
    if (!sel) return;
    setEditForm({
      name: sel.name, email: sel.email, phone: sel.phone, address: sel.address,
      industry: sel.industry, employees: sel.employees, annual_budget: sel.annual_budget,
      goals: sel.goals, positioning: sel.positioning, preferred_comms: sel.preferred_comms,
      hourly_rate: sel.hourly_rate, payment_terms: sel.payment_terms,
      discount_percent: sel.discount_percent, credit_balance: sel.credit_balance,
      domain: sel.domain, status: sel.status,
      company_number: sel.company_number, vat_number: sel.vat_number,
    });
    setEditing(true);
  }

  async function addNote() {
    if (!noteText.trim() || !sel || !user) return;
    const { data } = await supabase.from("client_notes").insert({ client_id: sel.id, text: noteText.trim(), created_by: user.id }).select().single();
    if (data) { setNotes(p => [data as Note, ...p]); setNoteText(""); showToast("Note added"); }
  }

  async function addClient() {
    if (!form.name || !form.email) return;
    const { data } = await supabase.from("clients").insert({
      name: form.name, email: form.email, phone: form.phone || null, address: form.address || null,
      industry: form.industry || null, referral_code: "REF" + Date.now().toString(36).toUpperCase(), social: {}, tags: [],
    }).select().single();
    if (data) { setClients(p => [...p, data as Client]); setShowAdd(false); setForm({ name: "", email: "", phone: "", address: "", industry: "" }); showToast("Client added"); }
  }

  async function inviteUser() {
    if (!inviteForm.name || !inviteForm.email || !sel) return;
    setInviteLoading(true); setInviteMsg("");

    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inviteForm.name, email: inviteForm.email, role: inviteForm.role, client_id: sel.id }),
      });
      const data = await res.json();

      if (data.success) {
        setInviteMsg(data.message);
        if (data.user) setClientUsers(p => [...p, data.user as ClientUser]);
        setInviteForm({ name: "", email: "", role: "client-admin" });
        showToast("Invite sent!");
      } else {
        setInviteMsg("Error: " + data.error);
      }
    } catch (err) {
      setInviteMsg("Failed to send invite. Check your connection.");
    }
    setInviteLoading(false);
  }

  async function removeClientUser(uid: string) {
    await supabase.from("users").delete().eq("id", uid);
    setClientUsers(p => p.filter(u => u.id !== uid));
    showToast("User removed");
  }

  if (!isAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>Admin access required.</div></PortalShell>;

  // ═══ DETAIL VIEW ═══
  if (sel) {
    const c = editing ? { ...sel, ...editForm } as Client : sel;
    const socials = c.social ? Object.entries(c.social).filter(([, v]) => v) : [];

    const Field = ({ label: fieldLabel, field, multiline }: { label: string; field: keyof Client; multiline?: boolean }) => {
      if (editing) {
        return (
          <div style={{ marginBottom: 10 }}>
            <label style={lbl}>{fieldLabel}</label>
            {multiline
              ? <textarea value={String(editForm[field] || "")} onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))} rows={3} style={{ ...inp, resize: "vertical" as const }} />
              : <input value={String(editForm[field] || "")} onChange={e => setEditForm(p => ({ ...p, [field]: e.target.value }))} style={inp} />
            }
          </div>
        );
      }
      const val = c[field];
      return (
        <div style={{ marginBottom: 8 }}>
          <span style={{ color: "#888", fontSize: 11, display: "block" }}>{fieldLabel}</span>
          <div style={{ fontWeight: 500, fontSize: 13, lineHeight: 1.5 }}>{val ? String(val) : "Not set"}</div>
        </div>
      );
    };

    return (
      <PortalShell>
        {/* Toast */}
        {toast && <div style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 18px", borderRadius: 10, backgroundColor: B.green, color: B.white, fontWeight: 600, fontSize: 13, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>{toast}</div>}

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, fontSize: 13 }}>
          <span style={{ color: B.green, cursor: "pointer" }} onClick={() => setSel(null)}>Clients</span>
          <span style={{ color: "#ccc" }}>/</span>
          <span style={{ fontWeight: 600, color: B.gd }}>{c.name}</span>
        </div>

        {/* Header */}
        <div style={{ ...card, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: B.green, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 700, fontSize: 20, fontFamily: "'Kanit',sans-serif" }}>
                {c.name.split(" ").map(w => w[0]).join("").substring(0, 2)}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 22, color: B.gd, margin: 0 }}>{c.name}</h1>
                  {editing
                    ? <select value={editForm.status || "active"} onChange={e => setEditForm(p => ({ ...p, status: e.target.value }))} style={{ padding: "3px 8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 11 }}>
                        <option value="active">Active</option><option value="paused">Paused</option><option value="archived">Archived</option>
                      </select>
                    : <Badge color={c.status === "active" ? "green" : "amber"}>{c.status}</Badge>
                  }
                </div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{c.industry || ""} {c.address || ""}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {editing ? (
                <>
                  <button onClick={() => setEditing(false)} style={{ padding: "8px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Cancel</button>
                  <button onClick={saveEdit} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Save Changes</button>
                </>
              ) : (
                <>
                  <button onClick={startEditing} style={{ padding: "8px 16px", backgroundColor: "transparent", color: B.green, border: `2px solid ${B.green}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Edit</button>
                  <button onClick={() => setShowInvite(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+ Invite User</button>
                </>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 16, paddingTop: 14, borderTop: "1px solid #eee", flexWrap: "wrap" }}>
            {[["Projects", projects.length], ["Tasks", taskCount], ["Users", clientUsers.length], ["Referrals", c.referral_count]].map(([l, v]) => (
              <div key={l as string}><div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{v}</div><div style={{ fontSize: 10, color: "#888" }}>{l}</div></div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {["profile", "financial", "projects", "users", "notes"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 14px", borderRadius: 8, border: "none", backgroundColor: tab === t ? B.green : B.grey, color: tab === t ? B.white : "#666", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {tab === "profile" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Contact</h3>
            <Field label="Email" field="email" />
            <Field label="Phone" field="phone" />
            <Field label="Address" field="address" />
            <Field label="Preferred Comms" field="preferred_comms" />
            <Field label="Company No" field="company_number" />
            <Field label="VAT No" field="vat_number" />
          </div>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Business</h3>
            <Field label="Industry" field="industry" />
            <Field label="Team Size" field="employees" />
            <Field label="Annual Budget" field="annual_budget" />
            <Field label="Goals" field="goals" multiline />
            <Field label="Positioning" field="positioning" multiline />
          </div>
          <div style={{ ...card, gridColumn: "1/3" }}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Digital</h3>
            <Field label="Domain" field="domain" />
            {socials.length > 0 && !editing && socials.map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                <span style={{ color: "#888", textTransform: "capitalize" }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>}

        {/* FINANCIAL TAB */}
        {tab === "financial" && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Payment Settings</h3>
            {editing ? (
              <>
                <div style={{ marginBottom: 10 }}><label style={lbl}>Hourly Rate (£)</label><input type="number" value={editForm.hourly_rate || 20} onChange={e => setEditForm(p => ({ ...p, hourly_rate: parseFloat(e.target.value) }))} style={inp} /></div>
                <div style={{ marginBottom: 10 }}><label style={lbl}>Payment Terms</label><input value={editForm.payment_terms || ""} onChange={e => setEditForm(p => ({ ...p, payment_terms: e.target.value }))} style={inp} /></div>
                <div style={{ marginBottom: 10 }}><label style={lbl}>Discount %</label><input type="number" value={editForm.discount_percent || 0} onChange={e => setEditForm(p => ({ ...p, discount_percent: parseFloat(e.target.value) }))} style={inp} /></div>
                <div style={{ marginBottom: 10 }}><label style={lbl}>Credits (£)</label><input type="number" value={editForm.credit_balance || 0} onChange={e => setEditForm(p => ({ ...p, credit_balance: parseFloat(e.target.value) }))} style={inp} /></div>
              </>
            ) : (
              [["Rate", `£${c.hourly_rate}/hr`], ["Terms", c.payment_terms], ["History", c.payment_history], ["Discount", c.discount_percent > 0 ? `${c.discount_percent}%` : "None"], ["Credits", c.credit_balance > 0 ? `£${c.credit_balance}` : "None"]].map(([l, v]) => (
                <div key={l as string} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}>
                  <span style={{ color: "#888" }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))
            )}
          </div>
          <div style={card}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Invoices</h3>
            {invoices.length === 0 ? <div style={{ color: "#888", fontSize: 13 }}>No invoices</div> :
              invoices.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f0f0", fontSize: 13 }}><span style={{ fontWeight: 600, color: B.gd }}>{i.invoice_number}</span><Badge color={i.status === "paid" ? "green" : i.status === "sent" ? "blue" : "grey"}>{i.status}</Badge></div>)}
          </div>
        </div>}

        {/* PROJECTS TAB */}
        {tab === "projects" && <div>
          {projects.length === 0 ? <div style={{ ...card, textAlign: "center", color: "#888" }}>No projects</div> :
            projects.map(p => { const svc = SERVICES.find(s => s.id === p.service); return (
              <div key={p.id} style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{svc?.icon || "📁"}</span><span style={{ fontFamily: "'Kanit',sans-serif", fontSize: 15, color: B.gd, fontWeight: 600 }}>{p.name}</span><Badge color={p.status === "active" ? "green" : "grey"}>{p.status}</Badge></div>
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i <= p.stage ? B.green : "#e0e0e0" }} />)}</div>
              </div>
            ); })}
        </div>}

        {/* USERS TAB */}
        {tab === "users" && <div>
          {clientUsers.map(u => (
            <div key={u.id} style={{ ...card, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: u.role === "client-admin" ? B.green : B.gl, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 700, fontSize: 16, fontFamily: "'Kanit',sans-serif" }}>
                  {u.avatar_initials || u.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: B.gd }}>{u.name}</span>
                    <Badge color={u.role === "client-admin" ? "green" : "grey"}>{u.role === "client-admin" ? "Admin" : "User"}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{u.email}</div>
                </div>
                <button onClick={() => removeClientUser(u.id)} style={{ padding: "6px 12px", backgroundColor: "transparent", color: B.red, border: `1.5px solid ${B.red}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 11 }}>Remove</button>
              </div>
            </div>
          ))}

          <button onClick={() => setShowInvite(true)} style={{ padding: "10px 20px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>+ Invite User to {c.name}</button>
        </div>}

        {/* NOTES TAB */}
        {tab === "notes" && <div style={card}>
          <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Notes</h3>
          {notes.length === 0 && <div style={{ color: "#888", fontSize: 13, marginBottom: 12 }}>No notes yet.</div>}
          {notes.map(n => <div key={n.id} style={{ padding: "10px 12px", backgroundColor: B.grey, borderRadius: 8, marginBottom: 8 }}><div style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>{n.text}</div><div style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>{new Date(n.created_at).toLocaleDateString("en-GB")}</div></div>)}
          <div style={{ marginTop: 12 }}>
            <label style={lbl}>Add a note</label>
            <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={3} placeholder="e.g. Sarah prefers Tuesday calls" style={{ ...inp, resize: "vertical" as const }} />
            <button onClick={addNote} disabled={!noteText.trim()} style={{ padding: "8px 16px", backgroundColor: noteText.trim() ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: noteText.trim() ? "pointer" : "not-allowed", fontWeight: 600 }}>Add Note</button>
          </div>
        </div>}

        {/* INVITE MODAL */}
        {showInvite && (
          <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => { setShowInvite(false); setInviteMsg(""); }}>
            <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 460, padding: 24 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 4px" }}>Invite User to {c.name}</h2>
              <p style={{ fontSize: 12, color: "#888", margin: "0 0 16px" }}>They will receive an email with a link to set their password and access the portal.</p>

              <label style={lbl}>Full Name</label>
              <input value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah Mitchell" style={inp} />
              <label style={lbl}>Email</label>
              <input value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} placeholder="sarah@glebefarm.co.uk" type="email" style={inp} />
              <label style={lbl}>Role</label>
              <select value={inviteForm.role} onChange={e => setInviteForm(p => ({ ...p, role: e.target.value }))} style={inp}>
                <option value="client-admin">Admin - full access including invoices and team</option>
                <option value="client-user">User - requests and projects only</option>
              </select>

              {inviteMsg && (
                <div style={{ padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 12, backgroundColor: inviteMsg.startsWith("Error") ? "#ffebee" : "#e8f5e9", color: inviteMsg.startsWith("Error") ? B.red : B.green }}>
                  {inviteMsg}
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => { setShowInvite(false); setInviteMsg(""); }} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
                <button onClick={inviteUser} disabled={!inviteForm.name || !inviteForm.email || inviteLoading} style={{ padding: "9px 16px", backgroundColor: inviteForm.name && inviteForm.email && !inviteLoading ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: inviteForm.name && inviteForm.email && !inviteLoading ? "pointer" : "not-allowed", fontWeight: 600 }}>
                  {inviteLoading ? "Sending..." : "Send Invite"}
                </button>
              </div>
            </div>
          </div>
        )}
      </PortalShell>
    );
  }

  // ═══ LIST VIEW ═══
  return (
    <PortalShell>
      {toast && <div style={{ position: "fixed", bottom: 20, right: 20, padding: "10px 18px", borderRadius: 10, backgroundColor: B.green, color: B.white, fontWeight: 600, fontSize: 13, zIndex: 9999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>{toast}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: 0 }}>Clients</h1>
        <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Add Client</button>
      </div>
      {loading ? <p style={{ color: "#888" }}>Loading...</p> :
        clients.length === 0 ? <div style={{ ...card, textAlign: "center", padding: 40 }}><p style={{ color: "#888" }}>No clients yet. Add your first client to get started.</p></div> :
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
          {clients.map(c => {
            const days = c.last_active_at ? Math.ceil((Date.now() - new Date(c.last_active_at).getTime()) / 86400000) : null;
            return (
              <div key={c.id} onClick={() => selectClient(c)} style={{ ...card, cursor: "pointer", marginBottom: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: B.green, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 700, fontSize: 14, fontFamily: "'Kanit',sans-serif" }}>{c.name.split(" ").map(w => w[0]).join("").substring(0, 2)}</div>
                    <div><div style={{ fontWeight: 700, fontSize: 14, color: B.gd }}>{c.name}</div><div style={{ fontSize: 10, color: "#888" }}>{c.industry || c.email}</div></div>
                  </div>
                  <Badge color={c.status === "active" ? "green" : "amber"}>{c.status}</Badge>
                </div>
                <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#666" }}>
                  {c.discount_percent > 0 && <span style={{ color: B.purple }}>{c.discount_percent}% disc</span>}
                  {days !== null && <span style={{ color: days > 14 ? B.red : days > 7 ? B.amber : B.green }}>{days === 0 ? "Active today" : `${days}d ago`}</span>}
                </div>
              </div>
            );
          })}
        </div>}

      {showAdd && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowAdd(false)}>
        <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 500, padding: 24 }} onClick={e => e.stopPropagation()}>
          <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 16px" }}>Add Client</h2>
          {[["Business Name", "name", "e.g. Congleton Coffee Co"], ["Email", "email", "hello@business.co.uk"], ["Phone", "phone", "01260 123456"], ["Address", "address", "Full address"], ["Industry", "industry", "e.g. Retail"]].map(([l, k, p]) => (
            <div key={k}><label style={lbl}>{l}</label><input value={form[k as keyof typeof form]} onChange={e => setForm(prev => ({ ...prev, [k]: e.target.value }))} placeholder={p} style={inp} /></div>
          ))}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setShowAdd(false)} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
            <button onClick={addClient} disabled={!form.name || !form.email} style={{ padding: "9px 16px", backgroundColor: form.name && form.email ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.name && form.email ? "pointer" : "not-allowed", fontWeight: 600 }}>Add Client</button>
          </div>
        </div>
      </div>}
    </PortalShell>
  );
}
