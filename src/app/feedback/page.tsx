"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type NPS = { id: string; client_id: string; score: number; comment: string | null; created_at: string };
type Survey = { id: string; project_id: string; client_id: string; completed: boolean; answers: Record<string, unknown> | null; testimonial_text: string | null; testimonial_approved: boolean; completed_at: string | null };

export default function FeedbackPage() {
  const { isAdmin } = useUser();
  const supabase = createClient();
  const [nps, setNps] = useState<NPS[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("nps");

  useEffect(() => { loadFeedback(); }, []);

  async function loadFeedback() {
    const [npsRes, surveyRes] = await Promise.all([
      supabase.from("nps_scores").select("*").order("created_at", { ascending: false }),
      supabase.from("surveys").select("*").order("created_at", { ascending: false }),
    ]);
    if (npsRes.data) setNps(npsRes.data as NPS[]);
    if (surveyRes.data) setSurveys(surveyRes.data as Survey[]);
    setLoading(false);
  }

  if (!isAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>Admin access required.</div></PortalShell>;

  const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
  const avg = nps.length ? (nps.reduce((s, n) => s + n.score, 0) / nps.length).toFixed(1) : "--";
  const promoters = nps.filter(n => n.score >= 9).length;
  const detractors = nps.filter(n => n.score <= 6).length;
  const npsScore = nps.length ? Math.round(((promoters - detractors) / nps.length) * 100) : 0;
  const testimonials = surveys.filter(s => s.testimonial_text && s.testimonial_approved);

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 16px" }}>Feedback</h1>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {["nps", "surveys", "testimonials"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${tab === t ? B.green : "#ddd"}`,
            backgroundColor: tab === t ? B.green + "10" : "transparent", color: tab === t ? B.green : "#888",
            fontSize: 12, fontWeight: tab === t ? 600 : 500, cursor: "pointer", textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <>
          {tab === "nps" && (
            <>
              <div style={{ ...card, display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: npsScore >= 50 ? B.green : npsScore >= 0 ? B.amber : B.red }}>{npsScore}</div><div style={{ fontSize: 11, color: "#888" }}>NPS Score</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: B.green }}>{avg}</div><div style={{ fontSize: 11, color: "#888" }}>Avg Rating</div></div>
                <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Kanit',sans-serif" }}>{nps.length}</div><div style={{ fontSize: 11, color: "#888" }}>Responses</div></div>
              </div>
              {nps.length === 0 ? <div style={{ ...card, textAlign: "center", color: "#888" }}>No NPS scores yet.</div> :
                nps.map(n => (
                  <div key={n.id} style={{ ...card, padding: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: "#888" }}>{new Date(n.created_at).toLocaleDateString("en-GB")}</span>
                      <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: n.score >= 9 ? "#e8f5e9" : n.score >= 7 ? "#fff8e1" : "#ffebee", color: n.score >= 9 ? B.green : n.score >= 7 ? "#b8860b" : B.red }}>{n.score}/10</span>
                    </div>
                    {n.comment && <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>"{n.comment}"</div>}
                  </div>
                ))}
            </>
          )}

          {tab === "surveys" && (
            surveys.length === 0 ? <div style={{ ...card, textAlign: "center", color: "#888", padding: 40 }}>No surveys yet. They trigger when projects complete.</div> :
            surveys.map(s => (
              <div key={s.id} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Project Survey</span>
                  <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: s.completed ? "#e8f5e9" : "#fff8e1", color: s.completed ? B.green : "#b8860b" }}>{s.completed ? "Completed" : "Pending"}</span>
                </div>
                {s.completed_at && <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{new Date(s.completed_at).toLocaleDateString("en-GB")}</div>}
              </div>
            ))
          )}

          {tab === "testimonials" && (
            testimonials.length === 0 ? <div style={{ ...card, textAlign: "center", color: "#888", padding: 40 }}>No testimonials yet. They come from survey responses.</div> :
            testimonials.map(s => (
              <div key={s.id} style={card}>
                <div style={{ fontSize: 40, color: B.green, lineHeight: 1 }}>&ldquo;</div>
                <p style={{ fontSize: 14, color: "#444", lineHeight: 1.6, fontStyle: "italic", margin: "0 0 8px" }}>{s.testimonial_text}</p>
              </div>
            ))
          )}
        </>
      )}
    </PortalShell>
  );
}
