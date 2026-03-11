"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div style={{
      backgroundColor: B.white, borderRadius: 12, padding: 20, flex: 1,
      minWidth: 140, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #eee",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: color + "15", margin: "0 auto 8px" }} />
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: B.black }}>{value}</div>
      <div style={{ fontSize: 12, color: "#888", fontFamily: "'Montserrat',sans-serif", marginTop: 4 }}>{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isAdmin } = useUser();
  const [stats, setStats] = useState({ clients: 0, tasks: 0, projects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const clientId = user.client_id;

    async function load() {
      try {
        if (isAdmin) {
          const [c, t, p] = await Promise.all([
            supabase.from("clients").select("id", { count: "exact" }).eq("status", "active"),
            supabase.from("tasks").select("id", { count: "exact" }).neq("status", "completed"),
            supabase.from("projects").select("id", { count: "exact" }).eq("status", "active"),
          ]);
          setStats({ clients: c.count || 0, tasks: t.count || 0, projects: p.count || 0 });
        } else if (clientId) {
          const [t, p] = await Promise.all([
            supabase.from("tasks").select("id", { count: "exact" }).eq("client_id", clientId).neq("status", "completed"),
            supabase.from("projects").select("id", { count: "exact" }).eq("client_id", clientId).eq("status", "active"),
          ]);
          setStats({ clients: 0, tasks: t.count || 0, projects: p.count || 0 });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isAdmin]);

  return (
    <PortalShell>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 4px" }}>
          {isAdmin ? "Morning, Tom" : `Hey, ${user?.name?.split(" ")[0]}`}
        </h1>
        <p style={{ color: "#888", margin: 0, fontSize: 14 }}>
          {isAdmin ? "Here's what's happening across your projects." : "Here's the latest on your projects."}
        </p>
      </div>

      {loading ? (
        <p style={{ color: "#888" }}>Loading dashboard...</p>
      ) : (
        <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          {isAdmin && <StatCard label="Active Clients" value={stats.clients} color={B.green} />}
          <StatCard label="Open Tasks" value={stats.tasks} color={B.amber} />
          <StatCard label="Active Projects" value={stats.projects} color={B.blue} />
        </div>
      )}

      <div style={{ backgroundColor: B.white, borderRadius: 12, padding: 24, border: "1px solid #eee" }}>
        <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 16, color: B.gd, margin: "0 0 12px" }}>
          Getting Started
        </h3>
        <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
          Your portal is live! This dashboard will fill with activity, tasks, and project updates as
          you start using the system. The sidebar gives you access to all your features.
        </p>
      </div>
    </PortalShell>
  );
}
