"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Processing...");
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();

    async function handleCallback() {
      try {
        const hash = window.location.hash;

        // Check for error in hash
        if (hash.includes("error=")) {
          const params = new URLSearchParams(hash.substring(1));
          setError((params.get("error_description") || "Something went wrong").replace(/\+/g, " "));
          return;
        }

        // Check if this is an invite
        const isInvite = hash.includes("type=invite");

        // Let Supabase pick up the token from the URL hash
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          setError(sessionError.message);
          return;
        }

        if (data.session) {
          if (isInvite) {
            // Invite user - send to set password
            setStatus("Welcome! Let's set your password...");
            setTimeout(() => router.push("/set-password"), 1000);
          } else {
            setStatus("You're in! Redirecting...");
            setTimeout(() => router.push("/dashboard"), 1000);
          }
        } else {
          setError("This link has expired. Please ask Tom to send a new invite.");
        }
      } catch {
        setError("Something went wrong. Please try again or contact Tom.");
      }
    }

    handleCallback();
  }, [router]);

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
          backgroundColor: B.white, borderRadius: 14, padding: 28,
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}>
          {error ? (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
              <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 8px" }}>Link Expired</h2>
              <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: "0 0 16px" }}>{error}</p>
              <button onClick={() => router.push("/login")} style={{
                padding: "10px 24px", backgroundColor: B.green, color: B.white, border: "none",
                borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14,
              }}>Go to Login</button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 12 }}>✨</div>
              <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 8px" }}>Welcome</h2>
              <p style={{ fontSize: 13, color: "#888" }}>{status}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
