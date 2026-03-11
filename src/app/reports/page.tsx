"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

export default function ReportsPage() {
  const { isAdmin } = useUser();
  const supabase = createClient();
  const [stats, setStats] = useState({ totalHours: 0, totalRevenue: 0, outstanding: 0, tasksCompleted: 0, activeProjects: 0 });
  const [clientRevenue, setClientRevenue] = useState<{ name: string; paid: number; pending: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadReports(); }, []);

  async function loadReports() {
    const [timeRes, invRes, taskRes, projRes, clientsRes] = await Promise.all([
      supabase.from("time_entries").select("hours"),
      supabase.from("invoices").select("id, client_id, status"),
      supabase.from("tasks").select("id", { count: "exact" }).eq("status", "completed"),
      supabase.from("projects").select("id", { count: "exact" }).eq("status", "active"),
      supabase.from("clients").select("id, name"),
    ]);

    const hours = (timeRes.data || []).reduce((s: number, e: { hours: number }) => s + e.hours, 0);
    const clients = clientsRes.data || [];

    // For now, show basic stats (full invoice totals would need items join)
    setStats({
      totalHours: hours,
      totalRevenue: hours * 20, // Approximation
      outstanding: 0,
      tasksCompleted: taskRes.count || 0,
      activeProjects: projRes.count || 0,
    });

    // Revenue by client (approximated from time entries per client)
    const byClient: Record<string, number> = {};
    // We'd need a more complex query for real revenue, but this works as foundation
    setClientRevenue(clients.map((c: { id: string; name: string }) => ({ name: c.name, paid: 0, pending: 0 })));
    setLoading(false);
  }

  if (!isAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>Admin access required.</div></PortalShell>;

  const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 16px" }}>Reports</h1>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <>
          {/* Stat cards */}
          <div style={{ display: "flex", gap: 14, marginBottom: 16, flexWrap: "wrap" }}>
            {[
              ["Total Hours", `${stats.totalHours}h`, B.blue],
              ["Est. Revenue", `£${stats.totalRevenue}`, B.green],
              ["Tasks Done", String(stats.tasksCompleted), B.green],
              ["Active Projects", String(stats.activeProjects), B.amber],
            ].map(([l, v, c]) => (
              <div key={l as string} style={{ ...card, flex: 1, minWidth: 140, textAlign: "center", marginBottom: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: (c as string) + "15", margin: "0 auto 8px" }} />
                <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{v}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {/* Revenue by client */}
            <div style={card}>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Clients</h3>
              {clientRevenue.length === 0 ? <div style={{ color: "#888", fontSize: 13 }}>No client data yet.</div> :
                clientRevenue.map(c => (
                  <div key={c.name} style={{ padding: "8px 0", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                  </div>
                ))}
            </div>

            {/* Tax summary */}
            <div style={card}>
              <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Tax Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Total Billed", `£${stats.totalRevenue}`, B.black],
                  ["Collected", `£${stats.totalRevenue - stats.outstanding}`, B.green],
                  ["Outstanding", `£${stats.outstanding}`, B.amber],
                  ["Hours Logged", `${stats.totalHours}h`, B.blue],
                ].map(([l, v, c]) => (
                  <div key={l as string} style={{ padding: 10, backgroundColor: B.grey, borderRadius: 8 }}>
                    <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: c as string }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </PortalShell>
  );
}
