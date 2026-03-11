"use client";

import { useState } from "react";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

const RESOURCES = [
  { id: "1", title: "Brand Guidelines Checklist", desc: "Keep your brand consistent across everything.", cat: "branding", type: "PDF" },
  { id: "2", title: "Social Media Best Practices", desc: "What actually works for small businesses.", cat: "social", type: "PDF" },
  { id: "3", title: "Website Content Writing Guide", desc: "Write copy that sounds like you, not a robot.", cat: "content", type: "PDF" },
  { id: "4", title: "Photography Brief Template", desc: "Fill this in before a shoot so I know what you need.", cat: "photo", type: "Template" },
  { id: "5", title: "SEO Basics", desc: "The stuff that actually helps Google find you.", cat: "seo", type: "PDF" },
  { id: "6", title: "Monthly Reporting Explained", desc: "What all those numbers in your report mean.", cat: "reporting", type: "Guide" },
];

export default function ResourcesPage() {
  const [cat, setCat] = useState("all");
  const cats = [...new Set(RESOURCES.map(r => r.cat))];
  const filtered = cat === "all" ? RESOURCES : RESOURCES.filter(r => r.cat === cat);

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 16px" }}>Resources</h1>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {["all", ...cats].map(f => (
          <button key={f} onClick={() => setCat(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${cat === f ? B.green : "#ddd"}`,
            backgroundColor: cat === f ? B.green + "10" : "transparent", color: cat === f ? B.green : "#888",
            fontSize: 12, fontWeight: cat === f ? 600 : 500, cursor: "pointer", textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: B.green + "10", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>
                {r.type === "Template" ? "📝" : r.type === "Guide" ? "📖" : "📄"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: B.gd }}>{r.title}</div>
                <p style={{ fontSize: 12, color: "#666", margin: "4px 0 8px", lineHeight: 1.4 }}>{r.desc}</p>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button style={{ padding: "5px 12px", backgroundColor: "transparent", color: B.green, border: `2px solid ${B.green}`, borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Download</button>
                  <span style={{ padding: "3px 8px", borderRadius: 12, backgroundColor: B.grey, fontSize: 10, color: "#888" }}>{r.type}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalShell>
  );
}
