"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Post = { id: string; client_id: string; scheduled_date: string; platform: string; title: string; preview_text: string | null; status: string };

const platformColors: Record<string, string> = { instagram: "#c32aa3", facebook: "#1877f2", linkedin: "#0a66c2", twitter: "#1da1f2" };

export default function ContentPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Post | null>(null);

  useEffect(() => { loadPosts(); }, [user]);

  async function loadPosts() {
    if (!user) return;
    let q = supabase.from("content_calendar").select("*").order("scheduled_date");
    if (!isAdmin && user.client_id) q = q.eq("client_id", user.client_id);
    const { data } = await q;
    if (data) setPosts(data as Post[]);
    setLoading(false);
  }

  // Generate 28 days starting from current week
  const startDate = new Date(2026, 2, 9); // March 9 2026 (Monday)
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date(startDate); d.setDate(d.getDate() + i);
    return { date: d.toISOString().split("T")[0], day: d.getDate(), dow: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()] };
  });

  const stColor: Record<string, string> = { scheduled: "green", "pending-approval": "amber", draft: "grey", approved: "blue", published: "green" };

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 4px" }}>Content Calendar</h1>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>{isAdmin ? "Manage content across all clients." : "Your upcoming social content."}</p>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <>
          {/* Calendar grid */}
          <div style={{ backgroundColor: B.white, borderRadius: 12, border: "1px solid #eee", padding: 12, marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#888", padding: 4 }}>{d}</div>
              ))}
              {days.map(d => {
                const dayPosts = posts.filter(p => p.scheduled_date === d.date);
                const isToday = d.date === "2026-03-11";
                return (
                  <div key={d.date} style={{ minHeight: 80, border: "1px solid #eee", borderRadius: 6, padding: 4, backgroundColor: isToday ? B.green + "08" : B.white }}>
                    <div style={{ fontSize: 11, fontWeight: isToday ? 700 : 500, color: isToday ? B.green : "#888" }}>{d.day}</div>
                    {dayPosts.map(p => (
                      <div key={p.id} onClick={() => setSelected(p)} style={{
                        fontSize: 10, padding: "2px 4px", borderRadius: 4, marginTop: 2, cursor: "pointer",
                        backgroundColor: platformColors[p.platform] || "#888", color: B.white,
                        overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
                      }}>{p.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming list */}
          <div style={{ backgroundColor: B.white, borderRadius: 12, border: "1px solid #eee", padding: 20 }}>
            <h3 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd, margin: "0 0 12px" }}>Upcoming Posts</h3>
            {posts.length === 0 ? <div style={{ color: "#888", fontSize: 13 }}>No content scheduled.</div> :
              posts.slice(0, 10).map(p => (
                <div key={p.id} onClick={() => setSelected(p)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: platformColors[p.platform] || "#888", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{p.scheduled_date} - {p.platform}</div>
                  </div>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: stColor[p.status] === "green" ? "#e8f5e9" : stColor[p.status] === "amber" ? "#fff8e1" : "#eee", color: stColor[p.status] === "green" ? B.green : stColor[p.status] === "amber" ? "#b8860b" : "#666" }}>{p.status}</span>
                </div>
              ))}
          </div>

          {/* Post detail modal */}
          {selected && (
            <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setSelected(null)}>
              <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 440, padding: 24 }} onClick={e => e.stopPropagation()}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, backgroundColor: platformColors[selected.platform] || "#888", color: B.white, fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{selected.platform}</div>
                </div>
                {/* Mock social preview */}
                <div style={{ border: "1px solid #eee", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ backgroundColor: B.grey, height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", color: "#888", fontSize: 12 }}>{selected.preview_text || "Preview image"}</div>
                  </div>
                  <div style={{ padding: "10px 12px" }}><div style={{ fontWeight: 600, fontSize: 13 }}>{selected.title}</div></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#888" }}>{selected.scheduled_date}</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: "#eee", color: "#666" }}>{selected.status}</span>
                </div>
                {selected.status === "pending-approval" && !isAdmin && (
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <button style={{ flex: 1, padding: "10px", backgroundColor: "#27ae60", color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Approve</button>
                    <button style={{ flex: 1, padding: "10px", backgroundColor: B.red, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Request Changes</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </PortalShell>
  );
}
