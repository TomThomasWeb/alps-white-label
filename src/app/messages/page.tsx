"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Msg = { id: string; text: string; user_id: string; client_id: string | null; type: string; created_at: string };

export default function MessagesPage() {
  const { user, isAdmin } = useUser();
  const supabase = createClient();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [activeClient, setActiveClient] = useState<string | null>(null);
  const [msgText, setMsgText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadMessages(); if (isAdmin) loadClients(); }, [user]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function loadMessages() {
    if (!user) return;
    let q = supabase.from("messages").select("*").eq("type", "inbox").order("created_at");
    if (!isAdmin && user.client_id) q = q.eq("client_id", user.client_id);
    const { data } = await q;
    if (data) setMessages(data as Msg[]);
    setLoading(false);
  }

  async function loadClients() {
    const { data } = await supabase.from("clients").select("id, name").eq("status", "active").order("name");
    if (data) setClients(data);
  }

  async function sendMessage() {
    if (!msgText.trim() || !user) return;
    const clientId = isAdmin ? activeClient : user.client_id;
    if (!clientId) return;

    const { data } = await supabase.from("messages").insert({
      client_id: clientId, user_id: user.id, type: "inbox", text: msgText.trim(),
    }).select().single();

    if (data) setMessages(p => [...p, data as Msg]);
    setMsgText("");
  }

  const clientIds = [...new Set(messages.map(m => m.client_id).filter(Boolean))] as string[];
  const threadMsgs = isAdmin
    ? (activeClient ? messages.filter(m => m.client_id === activeClient) : [])
    : messages;

  return (
    <PortalShell>
      <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: "0 0 16px" }}>Messages</h1>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "240px 1fr" : "1fr", gap: 14, height: "calc(100vh - 200px)" }}>

          {/* Client list (admin) */}
          {isAdmin && (
            <div style={{ backgroundColor: B.white, borderRadius: 12, border: "1px solid #eee", overflow: "auto" }}>
              <div style={{ padding: "12px 14px", borderBottom: "1px solid #eee", fontFamily: "'Kanit',sans-serif", fontSize: 13, color: B.gd }}>Conversations</div>
              {clientIds.length === 0 && <div style={{ padding: 20, color: "#888", fontSize: 13 }}>No conversations yet.</div>}
              {clientIds.map(cId => {
                const cl = clients.find(c => c.id === cId);
                const lastMsg = messages.filter(m => m.client_id === cId).slice(-1)[0];
                return (
                  <div key={cId} onClick={() => setActiveClient(cId)} style={{
                    padding: "10px 14px", borderBottom: "1px solid #f0f0f0", cursor: "pointer",
                    backgroundColor: activeClient === cId ? B.green + "08" : "transparent",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{cl?.name || "Unknown"}</div>
                    {lastMsg && <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{lastMsg.text.substring(0, 40)}...</div>}
                  </div>
                );
              })}
              {/* Start new conversation */}
              {clients.filter(c => !clientIds.includes(c.id)).length > 0 && (
                <div style={{ padding: "10px 14px", borderTop: "1px solid #eee" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#888", marginBottom: 6 }}>New conversation</div>
                  {clients.filter(c => !clientIds.includes(c.id)).map(c => (
                    <div key={c.id} onClick={() => setActiveClient(c.id)} style={{ padding: "6px 0", fontSize: 12, color: B.green, cursor: "pointer" }}>{c.name}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Thread */}
          <div style={{ backgroundColor: B.white, borderRadius: 12, border: "1px solid #eee", display: "flex", flexDirection: "column" }}>
            {(isAdmin && !activeClient) ? (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 13 }}>Select a conversation</div>
            ) : (
              <>
                <div style={{ flex: 1, overflow: "auto", padding: 16 }}>
                  {threadMsgs.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#888", fontSize: 13 }}>No messages yet. Say hello!</div>}
                  {threadMsgs.map(m => {
                    const isMe = m.user_id === user?.id;
                    return (
                      <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
                        <div style={{
                          maxWidth: "75%", padding: "10px 14px", borderRadius: 12,
                          backgroundColor: isMe ? B.green : "#f0f0f0",
                          color: isMe ? B.white : B.black, fontSize: 13, lineHeight: 1.5,
                        }}>
                          {m.text}
                          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, textAlign: "right" }}>
                            {new Date(m.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={scrollRef} />
                </div>
                <div style={{ padding: "12px 16px", borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
                  <input
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    placeholder={`Message${isAdmin && activeClient ? ` ${clients.find(c => c.id === activeClient)?.name || ""}` : ""}...`}
                    style={{ flex: 1, padding: "10px 14px", border: "2px solid #e0e0e0", borderRadius: 10, fontSize: 13, outline: "none" }}
                    onFocus={e => e.currentTarget.style.borderColor = B.green}
                    onBlur={e => e.currentTarget.style.borderColor = "#e0e0e0"}
                  />
                  <button onClick={sendMessage} disabled={!msgText.trim()} style={{
                    padding: "10px 18px", backgroundColor: msgText.trim() ? B.green : "#ccc",
                    color: B.white, border: "none", borderRadius: 10, cursor: msgText.trim() ? "pointer" : "not-allowed",
                    fontWeight: 600, fontSize: 13,
                  }}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}
