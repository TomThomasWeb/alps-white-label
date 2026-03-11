"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type TextEdit = { id: string; page_section: string; current_text: string | null; requested_text: string | null; status: string };

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };

export default function ToolsPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [tab, setTab] = useState("text-editor");
  const [edits, setEdits] = useState<TextEdit[]>([]);
  const [form, setForm] = useState({ page: "", text: "" });
  const [client, setClient] = useState<{ domain: string | null; domain_expiry: string | null; ssl_active: boolean; hosting_status: string | null } | null>(null);

  useEffect(() => { loadData(); }, [user]);

  async function loadData() {
    if (!user) return;
    if (!isAdmin && user.client_id) {
      const [editRes, clientRes] = await Promise.all([
        supabase.from("text_edits").select("*").eq("client_id", user.client_id).order("created_at", { ascending: false }),
        supabase.from("clients").select("domain, domain_expiry, ssl_active, hosting_status").eq("id", user.client_id).single(),
      ]);
      if (editRes.data) setEdits(editRes.data as TextEdit[]);
      if (clientRes.data) setClient(clientRes.data);
    } else if (isAdmin) {
      const { data } = await supabase.from("text_edits").select("*").order("created_at", { ascending: false });
      if (data) setEdits(data as TextEdit[]);
    }
  }

  async function submitEdit() {
    if (!form.page || !form.text || !user || !user.client_id) return;
    const { data } = await supabase.from("text_edits").insert({
      client_id: user.client_id, page_section: form.page, requested_text: form.text, requested_by: user.id,
    }).select().single();
    if (data) { setEdits(p => [data as TextEdit, ...p]); setForm({ page: "", text: "" }); }
  }

  const stColor: Record<string, [string, string]> = { pending: ["#fff8e1", "#b8860b"], "in-progress": ["#e3f2fd", B.blue], live: ["#e8f5e9", B.green] };

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 16px" }}>Tools</h1>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["text-editor", "domain-status"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${tab === t ? B.green : "#ddd"}`,
            backgroundColor: tab === t ? B.green + "10" : "transparent", color: tab === t ? B.green : "#888",
            fontSize: 12, fontWeight: tab === t ? 600 : 500, cursor: "pointer",
          }}>{t === "text-editor" ? "Text Changes" : "Domain & Hosting"}</button>
        ))}
      </div>

      {tab === "text-editor" && (
        <>
          {!isAdmin && (
            <div style={card}>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 8px" }}>Request a Text Change</h3>
              <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>For small changes like opening hours, phone numbers, or menu updates.</p>
              <label style={lbl}>Page or section</label>
              <input value={form.page} onChange={e => setForm(p => ({ ...p, page: e.target.value }))} placeholder="e.g. Opening Hours, Footer" style={inp} />
              <label style={lbl}>New text</label>
              <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="What should it say?" rows={3} style={{ ...inp, resize: "vertical" as const }} />
              <button onClick={submitEdit} disabled={!form.page || !form.text} style={{ padding: "8px 16px", backgroundColor: form.page && form.text ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.page && form.text ? "pointer" : "not-allowed", fontWeight: 600 }}>Submit</button>
            </div>
          )}
          {edits.length > 0 && (
            <div style={{ ...card, padding: 0, overflow: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead><tr>
                  {["Page", "Requested Text", "Status"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #eee", fontSize: 11, fontWeight: 700, color: "#888" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>{edits.map(e => {
                  const [bg, fg] = stColor[e.status] || ["#eee", "#666"];
                  return (
                    <tr key={e.id}>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>{e.page_section}</td>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>{e.requested_text || "—"}</td>
                      <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
                        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: fg }}>{e.status}</span>
                      </td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "domain-status" && (
        <div style={card}>
          <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Domain & Hosting</h3>
          {!client ? <div style={{ color: "#888", fontSize: 13 }}>No domain information available.</div> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ padding: 12, backgroundColor: B.grey, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Domain</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{client.domain || "Not set"}</div>
                {client.domain_expiry && <div style={{ fontSize: 11, color: B.green, marginTop: 2 }}>Expires {client.domain_expiry}</div>}
              </div>
              <div style={{ padding: 12, backgroundColor: B.grey, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>SSL</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: client.ssl_active ? B.green : B.red }}>{client.ssl_active ? "Active" : "Not Active"}</div>
              </div>
              <div style={{ padding: 12, backgroundColor: B.grey, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Hosting</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: client.hosting_status === "active" ? B.green : B.amber }}>{client.hosting_status || "Unknown"}</div>
              </div>
              <div style={{ padding: 12, backgroundColor: B.grey, borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: B.green }}>All Good</div>
              </div>
            </div>
          )}
        </div>
      )}
    </PortalShell>
  );
}
