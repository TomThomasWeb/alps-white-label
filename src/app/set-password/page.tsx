"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords don't match."); return; }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const inp: React.CSSProperties = {
    width: "100%", padding: "11px 14px", border: "2px solid #e0e0e0",
    borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Montserrat',sans-serif",
      background: `linear-gradient(135deg, ${B.gd} 0%, ${B.green} 50%, ${B.gl} 100%)`,
      padding: 16,
    }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, backgroundColor: B.black, borderRadius: 8,
          display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
        }}>
          <span style={{ color: B.white, fontFamily: "'Kanit',sans-serif", fontSize: 20, fontWeight: 700 }}>TT</span>
        </div>

        <div style={{
          backgroundColor: B.white, borderRadius: 14, padding: 28, textAlign: "left",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}>
          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 8px" }}>Password Set!</h2>
              <p style={{ fontSize: 13, color: "#888" }}>Taking you to your dashboard...</p>
            </div>
          ) : (
            <>
              <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 4px" }}>
                Welcome to the Portal
              </h2>
              <p style={{ fontSize: 13, color: "#888", margin: "0 0 20px" }}>
                Set a password so you can log in next time.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#555" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    required
                    style={inp}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "#555" }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Type it again"
                    required
                    style={inp}
                  />
                </div>

                {error && (
                  <div style={{
                    padding: "10px 14px", backgroundColor: "#ffebee", borderRadius: 8,
                    color: B.red, fontSize: 13, marginBottom: 16,
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%", padding: "12px 20px", backgroundColor: B.green,
                    color: B.white, border: "none", borderRadius: 8,
                    fontFamily: "'Montserrat',sans-serif", fontSize: 15, fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Setting password..." : "Set Password & Continue"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
