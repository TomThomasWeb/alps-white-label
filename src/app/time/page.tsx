"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type TimeEntry = { id: string; client_id: string; description: string | null; hours: number; date: string; billable: boolean; invoiced: boolean };

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };

export default function TimePage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ client_id: "", description: "", hours: "", date: new Date().toISOString().split("T")[0] });

  // Timer state
  const [timerOn, setTimerOn] = useState(false);
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerClient, setTimerClient] = useState("");
  const [timerDesc, setTimerDesc] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { loadEntries(); loadClients(); }, [user]);

  useEffect(() => {
    if (timerOn) { intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000); }
    else if (intervalRef.current) { clearInterval(intervalRef.current); }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerOn]);

  async function loadEntries() {
    if (!user) return;
    const { data } = await supabase.from("time_entries").select("*").order("date", { ascending: false }).limit(50);
    if (data) setEntries(data as TimeEntry[]);
    setLoading(false);
  }

  async function loadClients() {
    const { data } = await supabase.from("clients").select("id, name").eq("status", "active").order("name");
    if (data) setClients(data);
  }

  async function stopTimer() {
    const hrs = Math.round((timerSecs / 3600) * 4) / 4; // Round to nearest 15 min
    if (hrs > 0 && timerClient) {
      const { data } = await supabase.from("time_entries").insert({
        client_id: timerClient, description: timerDesc || "Timer", hours: hrs,
        date: new Date().toISOString().split("T")[0], billable: true,
      }).select().single();
      if (data) setEntries(p => [data as TimeEntry, ...p]);
    }
    setTimerOn(false); setTimerSecs(0); setTimerClient(""); setTimerDesc("");
  }

  async function addEntry() {
    if (!form.client_id || !form.hours) return;
    const { data } = await supabase.from("time_entries").insert({
      client_id: form.client_id, description: form.description || null,
      hours: parseFloat(form.hours), date: form.date, billable: true,
    }).select().single();
    if (data) { setEntries(p => [data as TimeEntry, ...p]); setShowAdd(false); setForm({ client_id: "", description: "", hours: "", date: new Date().toISOString().split("T")[0] }); }
  }

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const totalHrs = entries.reduce((s, e) => s + e.hours, 0);
  const unbilled = entries.filter(e => e.billable && !e.invoiced).reduce((s, e) => s + e.hours, 0);

  if (!isAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>Admin access required.</div></PortalShell>;

  return (
    <PortalShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: 0 }}>Time Tracking</h1>
        <button onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Log Time</button>
      </div>

      {/* Timer */}
      <div style={{ ...card, border: timerOn ? `2px solid ${B.green}40` : "1px solid #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <div style={{ fontFamily: "monospace", fontSize: 28, fontWeight: 700, color: timerOn ? B.green : "#ccc" }}>{fmt(timerSecs)}</div>
          {!timerOn ? (
            <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select value={timerClient} onChange={e => setTimerClient(e.target.value)} style={{ padding: "7px 10px", borderRadius: 7, border: "2px solid #e0e0e0", fontSize: 12, flex: 1, minWidth: 120 }}>
                <option value="">Client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={timerDesc} onChange={e => setTimerDesc(e.target.value)} placeholder="Working on..." style={{ padding: "7px 10px", borderRadius: 7, border: "2px solid #e0e0e0", fontSize: 12, flex: 2, minWidth: 150 }} />
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{clients.find(c => c.id === timerClient)?.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{timerDesc}</div>
            </div>
          )}
          {!timerOn ? (
            <button onClick={() => setTimerOn(true)} disabled={!timerClient} style={{ padding: "8px 18px", backgroundColor: timerClient ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: timerClient ? "pointer" : "not-allowed", fontWeight: 600 }}>Start</button>
          ) : (
            <button onClick={stopTimer} style={{ padding: "8px 18px", backgroundColor: B.red, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Stop</button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" }}>
        {[["Total Hours", `${totalHrs}h`, `£${totalHrs * 20}`], ["Unbilled", `${unbilled}h`, `£${unbilled * 20}`]].map(([l, v, s]) => (
          <div key={l as string} style={{ ...card, flex: 1, minWidth: 140, textAlign: "center", marginBottom: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{v}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{l}</div>
            <div style={{ fontSize: 10, color: B.green, fontWeight: 600 }}>{s}</div>
          </div>
        ))}
      </div>

      {/* Entries table */}
      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <div style={{ ...card, padding: 0, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr>
              {["Date", "Client", "Description", "Hours", "Billed"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #eee", fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {entries.map(e => {
                const cl = clients.find(c => c.id === e.client_id);
                return (
                  <tr key={e.id}>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>{e.date}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>{cl?.name || "—"}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>{e.description || "—"}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0", fontWeight: 700 }}>{e.hours}h</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid #f0f0f0" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: e.invoiced ? "#e8f5e9" : "#fff8e1", color: e.invoiced ? B.green : "#b8860b" }}>{e.invoiced ? "Yes" : "No"}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Log Time Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowAdd(false)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 460, padding: 24 }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 16px" }}>Log Time</h2>
            <label style={lbl}>Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={lbl}>Description</label>
            <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="What did you work on?" style={inp} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={lbl}>Hours</label><input type="number" step="0.25" value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} placeholder="e.g. 2.5" style={inp} /></div>
              <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} style={inp} /></div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={addEntry} disabled={!form.client_id || !form.hours} style={{ padding: "9px 16px", backgroundColor: form.client_id && form.hours ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.client_id && form.hours ? "pointer" : "not-allowed", fontWeight: 600 }}>Log</button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
