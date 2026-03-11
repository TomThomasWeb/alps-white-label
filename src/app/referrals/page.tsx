"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

export default function ReferralsPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [client, setClient] = useState<{ referral_code: string | null; referral_count: number } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user?.client_id) return;
    supabase.from("clients").select("referral_code, referral_count").eq("id", user.client_id).single()
      .then(({ data }) => { if (data) setClient(data); });
  }, [user]);

  if (isAdmin) return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>This page is for clients.</div></PortalShell>;

  const refUrl = `https://tomthomas.co.uk/ref/${client?.referral_code || ""}`;
  const copy = () => {
    navigator.clipboard?.writeText(refUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 4px" }}>Refer a Friend</h1>
      <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px" }}>Know a business that could use my help? You both get 10% off.</p>

      <div style={{ ...card, background: `linear-gradient(135deg, ${B.green}08, ${B.gl}12)`, textAlign: "center", padding: 30 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🎁</div>
        <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 20, color: B.gd, margin: "0 0 6px" }}>Give 10%, Get 10%</h2>
        <p style={{ fontSize: 13, color: "#666", marginBottom: 16, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
          Share your referral link with another business. When they start a project, you both get 10% off your next invoice.
        </p>
        {client && (
          <div style={{ display: "flex", gap: 8, maxWidth: 400, margin: "0 auto" }}>
            <input value={refUrl} readOnly style={{ flex: 1, padding: "10px 14px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, backgroundColor: B.white }} />
            <button onClick={copy} style={{ padding: "10px 18px", backgroundColor: copied ? "#27ae60" : B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: B.green }}>{client?.referral_count || 0}</div>
          <div style={{ fontSize: 13, color: "#888" }}>Successful Referrals</div>
        </div>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'Kanit',sans-serif", color: B.amber }}>£{(client?.referral_count || 0) * 20}</div>
          <div style={{ fontSize: 13, color: "#888" }}>Total Saved</div>
        </div>
      </div>
    </PortalShell>
  );
}
