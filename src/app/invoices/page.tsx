"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase-client";
import { B } from "@/lib/constants";
import PortalShell from "@/components/PortalShell";

type Invoice = {
  id: string; client_id: string; invoice_number: string; status: string;
  due_date: string | null; issued_at: string | null; paid_at: string | null;
  client_marked_paid: boolean; discount_percent: number; notes: string | null;
  created_at: string;
};
type InvItem = { id: string; invoice_id: string; description: string; hours: number | null; rate: number | null; amount: number; is_expense: boolean };

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  const m: Record<string, [string, string]> = { green: ["#e8f5e9", B.green], amber: ["#fff8e1", "#b8860b"], red: ["#ffebee", B.red], blue: ["#e3f2fd", B.blue], grey: ["#eee", "#666"] };
  const [bg, fg] = m[color] || m.grey;
  return <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, backgroundColor: bg, color: fg }}>{children}</span>;
}

const card: React.CSSProperties = { backgroundColor: B.white, borderRadius: 12, padding: 20, border: "1px solid #eee", marginBottom: 14 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "2px solid #e0e0e0", borderRadius: 8, fontFamily: "'Montserrat',sans-serif", fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 12 };
const lbl: React.CSSProperties = { display: "block", marginBottom: 5, fontSize: 12, fontWeight: 600, color: "#555" };
const stColor: Record<string, string> = { paid: "green", sent: "blue", draft: "grey", overdue: "red", cancelled: "grey" };

export default function InvoicesPage() {
  const { user, isAdmin, isClientAdmin } = useUser();
  const supabase = createClient();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState<Invoice | null>(null);
  const [detailItems, setDetailItems] = useState<InvItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ client_id: "", due_date: "", items: [{ desc: "", hours: "", rate: "20" }] as { desc: string; hours: string; rate: string }[] });

  useEffect(() => { loadInvoices(); if (isAdmin) loadClients(); }, [user]);

  async function loadInvoices() {
    if (!user) return;
    let q = supabase.from("invoices").select("*").order("created_at", { ascending: false });
    if (!isAdmin && user.client_id) q = q.eq("client_id", user.client_id).neq("status", "draft");
    const { data } = await q;
    if (data) setInvoices(data as Invoice[]);
    setLoading(false);
  }

  async function loadClients() {
    const { data } = await supabase.from("clients").select("id, name").order("name");
    if (data) setClients(data);
  }

  async function openDetail(inv: Invoice) {
    setDetail(inv);
    const { data } = await supabase.from("invoice_items").select("*").eq("invoice_id", inv.id).order("sort_order");
    if (data) setDetailItems(data as InvItem[]);
  }

  async function updateStatus(id: string, status: string) {
    const updates: Record<string, unknown> = { status };
    if (status === "sent") updates.issued_at = new Date().toISOString();
    if (status === "paid") updates.paid_at = new Date().toISOString();
    await supabase.from("invoices").update(updates).eq("id", id);
    setInvoices(p => p.map(i => i.id === id ? { ...i, status, ...updates } as Invoice : i));
    if (detail?.id === id) setDetail(p => p ? { ...p, status, ...updates } as Invoice : p);
  }

  async function markClientPaid(id: string) {
    await supabase.from("invoices").update({ client_marked_paid: true, client_marked_paid_at: new Date().toISOString() }).eq("id", id);
    setInvoices(p => p.map(i => i.id === id ? { ...i, client_marked_paid: true } : i));
    if (detail?.id === id) setDetail(p => p ? { ...p, client_marked_paid: true } : p);
  }

  async function createInvoice() {
    if (!form.client_id) return;
    const validItems = form.items.filter(i => i.desc && i.hours);
    if (!validItems.length) return;

    const { data: inv } = await supabase.from("invoices").insert({
      client_id: form.client_id, status: "draft", due_date: form.due_date || null,
    }).select().single();

    if (inv) {
      const items = validItems.map((item, idx) => ({
        invoice_id: inv.id, description: item.desc,
        hours: parseFloat(item.hours), rate: parseFloat(item.rate),
        amount: parseFloat(item.hours) * parseFloat(item.rate), is_expense: false, sort_order: idx,
      }));
      await supabase.from("invoice_items").insert(items);
      setInvoices(p => [inv as Invoice, ...p]);
      setShowCreate(false);
      setForm({ client_id: "", due_date: "", items: [{ desc: "", hours: "", rate: "20" }] });
    }
  }

  const filtered = filter === "all" ? invoices : invoices.filter(i => i.status === filter);
  const total = (items: InvItem[]) => items.reduce((s, i) => s + i.amount, 0);

  if (!isAdmin && !isClientAdmin) {
    return <PortalShell><div style={{ padding: 40, textAlign: "center", color: "#888" }}>You don't have access to invoices.</div></PortalShell>;
  }

  return (
    <PortalShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 24, color: B.gd, margin: 0 }}>Invoices</h1>
        {isAdmin && <button onClick={() => setShowCreate(true)} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>+ Create Invoice</button>}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {(isAdmin ? ["all", "draft", "sent", "paid"] : ["all", "sent", "paid"]).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${filter === f ? B.green : "#ddd"}`,
            backgroundColor: filter === f ? B.green + "10" : "transparent", color: filter === f ? B.green : "#888",
            fontSize: 12, fontWeight: filter === f ? 600 : 500, cursor: "pointer", textTransform: "capitalize",
          }}>{f}</button>
        ))}
      </div>

      {loading ? <p style={{ color: "#888" }}>Loading...</p> :
        filtered.length === 0 ? <div style={{ ...card, textAlign: "center", padding: 40 }}><p style={{ color: "#888" }}>No invoices.</p></div> :
        filtered.map(inv => {
          const cl = clients.find(c => c.id === inv.client_id);
          return (
            <div key={inv.id} onClick={() => openDetail(inv)} style={{ ...card, cursor: "pointer", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, fontFamily: "'Kanit',sans-serif", color: B.gd }}>{inv.invoice_number}</span>
                  {isAdmin && cl && <span style={{ fontSize: 12, color: "#888", marginLeft: 8 }}>{cl.name}</span>}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  {inv.client_marked_paid && inv.status !== "paid" && <Badge color="amber">Client says paid</Badge>}
                  <Badge color={stColor[inv.status] || "grey"}>{inv.status}</Badge>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>
                {inv.issued_at && <span>Issued {new Date(inv.issued_at).toLocaleDateString("en-GB")}</span>}
                {inv.due_date && <span style={{ marginLeft: 12 }}>Due {inv.due_date}</span>}
              </div>
            </div>
          );
        })}

      {/* Invoice Detail Modal */}
      {detail && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setDetail(null)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 580, maxHeight: "90vh", overflow: "auto", padding: 0 }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", position: "sticky", top: 0, backgroundColor: B.white }}>
              <h3 style={{ margin: 0, fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd }}>{detail.invoice_number}</h3>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#999" }}>✕</button>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                <Badge color={stColor[detail.status] || "grey"}>{detail.status}</Badge>
                {detail.client_marked_paid && detail.status !== "paid" && <Badge color="amber">Client says paid</Badge>}
              </div>

              {/* Line items */}
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 16 }}>
                <thead><tr style={{ borderBottom: "2px solid #eee" }}>
                  <th style={{ textAlign: "left", padding: "6px 0", color: "#888", fontSize: 10 }}>DESCRIPTION</th>
                  <th style={{ textAlign: "right", padding: "6px 0", color: "#888", fontSize: 10, width: 60 }}>HRS</th>
                  <th style={{ textAlign: "right", padding: "6px 0", color: "#888", fontSize: 10, width: 60 }}>RATE</th>
                  <th style={{ textAlign: "right", padding: "6px 0", color: "#888", fontSize: 10, width: 70 }}>AMOUNT</th>
                </tr></thead>
                <tbody>
                  {detailItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "8px 0" }}>{item.description}{item.is_expense ? " (expense)" : ""}</td>
                      <td style={{ textAlign: "right" }}>{item.hours ? `${item.hours}h` : ""}</td>
                      <td style={{ textAlign: "right" }}>{item.rate ? `£${item.rate}` : ""}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>£{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "2px solid #eee" }}>
                <span style={{ fontFamily: "'Kanit',sans-serif", fontSize: 14, color: B.gd }}>Total</span>
                <span style={{ fontFamily: "'Kanit',sans-serif", fontSize: 20, color: B.gd, fontWeight: 700 }}>£{total(detailItems)}</span>
              </div>

              {/* Admin actions */}
              {isAdmin && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {detail.status === "draft" && <button onClick={() => updateStatus(detail.id, "sent")} style={{ padding: "8px 16px", backgroundColor: B.blue, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Send</button>}
                  {detail.status === "sent" && <button onClick={() => updateStatus(detail.id, "paid")} style={{ padding: "8px 16px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Mark Paid</button>}
                </div>
              )}

              {/* Client: mark as paid */}
              {!isAdmin && detail.status === "sent" && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ padding: 12, backgroundColor: B.green + "08", borderRadius: 8, marginBottom: 8 }}>
                    <p style={{ fontSize: 12, color: B.gd, margin: 0, fontWeight: 600 }}>Bank transfer: Tom Thomas Web & Media</p>
                    <p style={{ fontSize: 12, color: "#444", margin: "4px 0" }}>Sort: 00-00-00 | Acc: 12345678 | Ref: {detail.invoice_number}</p>
                  </div>
                  {detail.client_marked_paid ? (
                    <div style={{ textAlign: "center", padding: 10, backgroundColor: "#fff8e1", borderRadius: 8 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#b8860b" }}>You have marked this as paid. Tom will confirm.</div>
                    </div>
                  ) : (
                    <button onClick={() => markClientPaid(detail.id)} style={{ width: "100%", padding: "12px", backgroundColor: "#27ae60", color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>I have Paid This</button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreate && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }} onClick={() => setShowCreate(false)}>
          <div style={{ backgroundColor: B.white, borderRadius: 14, width: "100%", maxWidth: 580, padding: 24, maxHeight: "90vh", overflow: "auto" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Kanit',sans-serif", fontSize: 18, color: B.gd, margin: "0 0 16px" }}>Create Invoice</h2>
            <label style={lbl}>Client</label>
            <select value={form.client_id} onChange={e => setForm(p => ({ ...p, client_id: e.target.value }))} style={inp}>
              <option value="">Select...</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <label style={lbl}>Line Items</label>
            {form.items.map((item, idx) => (
              <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", gap: 6, marginBottom: 6 }}>
                <input value={item.desc} onChange={e => { const items = [...form.items]; items[idx] = { ...items[idx], desc: e.target.value }; setForm(p => ({ ...p, items })); }} placeholder="Description" style={{ padding: "7px 10px", border: "2px solid #e0e0e0", borderRadius: 7, fontSize: 11, outline: "none" }} />
                <input value={item.hours} onChange={e => { const items = [...form.items]; items[idx] = { ...items[idx], hours: e.target.value }; setForm(p => ({ ...p, items })); }} placeholder="Hours" type="number" style={{ padding: "7px 10px", border: "2px solid #e0e0e0", borderRadius: 7, fontSize: 11, outline: "none" }} />
                <input value={item.rate} onChange={e => { const items = [...form.items]; items[idx] = { ...items[idx], rate: e.target.value }; setForm(p => ({ ...p, items })); }} placeholder="£/hr" type="number" style={{ padding: "7px 10px", border: "2px solid #e0e0e0", borderRadius: 7, fontSize: 11, outline: "none" }} />
              </div>
            ))}
            <button onClick={() => setForm(p => ({ ...p, items: [...p.items, { desc: "", hours: "", rate: "20" }] }))} style={{ background: "none", border: "none", color: B.green, cursor: "pointer", fontSize: 12, fontWeight: 600, padding: "4px 0", marginBottom: 12 }}>+ Add line</button>
            <label style={lbl}>Due Date</label>
            <input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} style={inp} />
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowCreate(false)} style={{ padding: "9px 16px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>Cancel</button>
              <button onClick={createInvoice} disabled={!form.client_id} style={{ padding: "9px 16px", backgroundColor: form.client_id ? B.green : "#ccc", color: B.white, border: "none", borderRadius: 8, cursor: form.client_id ? "pointer" : "not-allowed", fontWeight: 600 }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </PortalShell>
  );
}
