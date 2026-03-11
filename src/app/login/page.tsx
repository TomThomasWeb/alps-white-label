"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else { router.push("/dashboard"); router.refresh(); }
  };

  const inp = {
    width: "100%", padding: "11px 14px", border: "2px solid #e0e0e0",
    borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box" as const,
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Montserrat',sans-serif",
      background: `linear-gradient(135deg, ${B.gd} 0%, ${B.green} 50%, ${B.gl} 100%)`,
      padding: 16,
    }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, backgroundColor: B.black, borderRadius: 8,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: B.white, fontFamily: "'Kanit',sans-serif", fontSize: 20, fontWeight: 700 }}>TT</span>
          </div>
          <h1 style={{ fontFamily: "'Kanit',sans-serif", color: B.white, fontSize: 24, margin: "14px 0 4px" }}>
            Client Portal
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>
            Tom Thomas Web & Media
          </p>
        </div>

        <div style={{
          backgroundColor: B.white, borderRadius: 14, padding: 28,
          textAlign: "left", boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}>
          <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, margin: "0 0 4px", color: B.gd }}>
            Sign in
          </h2>
          <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>
            Enter your email and password
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#555" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@business.co.uk" required style={inp} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#555" }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" required style={inp} />
            </div>
            {error && (
              <div style={{ padding: "10px 14px", backgroundColor: "#ffebee", borderRadius: 8, color: B.red, fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px 20px", backgroundColor: B.green, color: B.white,
              border: "none", borderRadius: 8, fontFamily: "'Montserrat',sans-serif",
              fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
