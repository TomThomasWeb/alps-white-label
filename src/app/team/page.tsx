"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type TeamUser = { id: string; name: string; email: string; role: string; avatar_initials: string | null };

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };

export default function TeamPage() {
  const { user, isClientAdmin } = useUser();
  const supabase = createClient();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", role: "client-user" });

  useEffect(() => { loadTeam(); }, [user]);

  async function loadTeam() {
    if (!user?.client_id) return;
    const { data } = await supabase.from("users").select("id, name, email, role, avatar_initials").eq("client_id", user.client_id);
    if (data) setUsers(data as TeamUser[]);
    setLoading(false);
  }

  async function addUser() {
    if (!form.name || !form.email || !user?.client_id) return;
    const initials = form.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();
    const { data } = await supabase.from("users").insert({
      client_id: user.client_id, name: form.name, email: form.email,
      role: form.role, avatar_initials: initials,
    }).select().single();
    if (data) { setUsers(p => [...p, data as TeamUser]); setForm({ name: "", email: "", role: "client-user" }); }
  }

  async function toggleRole(uid: string) {
    const u = users.find(x => x.id === uid);
    if (!u) return;
    const newRole = u.role === "client-admin" ? "client-user" : "client-admin";
    await supabase.from("users").update({ role: newRole }).eq("id", uid);
    setUsers(p => p.map(x => x.id === uid ? { ...x, role: newRole } : x));
  }

  async function removeUser(uid: string) {
    if (uid === user?.id) return;
    await supabase.from("users").delete().eq("id", uid);
    setUsers(p => p.filter(x => x.id !== uid));
  }

  if (!isClientAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>Admin access required.</div></PortalShell>;

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 4px" }}>Team</h1>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>Manage who has access to your portal.</p>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <>
          {users.map(u => {
            const isMe = u.id === user?.id;
            return (
              <div key={u.id} style={{ ...card, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: u.role === "client-admin" ? B.green : B.gl, display: "flex", alignItems: "center", justifyContent: "center", color: B.white, fontWeight: 700, fontSize: 16, fontFamily: "'Kanit',sans-serif" }}>
                    {u.avatar_initials || u.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Kanit',sans-serif", color: B.gd }}>{u.name}</span>
                      {isMe && <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: "#e3f2fd", color: B.blue }}>You</span>}
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: u.role === "client-admin" ? "#e8f5e9" : "#eee", color: u.role === "client-admin" ? B.green : "#666" }}>{u.role === "client-admin" ? "Admin" : "User"}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{u.email}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      {u.role === "client-admin" ? "Full access including invoices. Can manage team." : "Can submit requests and view projects. No invoices."}
                    </div>
                  </div>
                  {!isMe && (
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button onClick={() => toggleRole(u.id)} style={{ padding: "6px 12px", backgroundColor: "transparent", color: B.green, border: `2px solid ${B.green}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
                        {u.role === "client-admin" ? "Make User" : "Make Admin"}
                      </button>
                      <button onClick={() => removeUser(u.id)} style={{ padding: "6px 12px", backgroundColor: "transparent", color: B.red, border: `2px solid ${B.red}`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>Remove</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <div style={{ ...card, backgroundColor: B.grey }}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 15, color: B.gd, margin: "0 0 4px" }}>Add a team member</h3>
            <p style={{ fontSize: 12, color: "#888", margin: "0 0 14px" }}>They will get an email invitation to set up their account.</p>
            <label style={lbl}>Name</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={inp} />
            <label style={lbl}>Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@company.co.uk" type="email" style={inp} />
            <label style={lbl}>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} style={inp}>
              <option value="client-user">User - requests and projects only</option>
              <option value="client-admin">Admin - full access including invoices</option>
            </select>
            <button onClick={addUser} disabled={!form.name || !form.email} style={{ padding: "8px 16px", backgroundColor: form.name && form.email ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.name && form.email ? "pointer" : "not-allowed", fontWeight: 600 }}>Add Team Member</button>
          </div>
        </>
      )}
    </PortalShell>
  );
}
