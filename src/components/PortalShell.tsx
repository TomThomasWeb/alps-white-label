"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { useUser } from "@/hooks/useUser";
import { B } from "@/lib/constants";
import {
  LayoutDashboard, Users, FolderOpen, CheckSquare,
  MessageSquare, FileText, Clock, CalendarDays,
  MessageCircle, BarChart3, Wrench, Gift,
  BookOpen, LogOut, Menu, Search, Bell
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Clients", icon: Users, href: "/clients" },
  { label: "Projects", icon: FolderOpen, href: "/projects" },
  { label: "Tasks", icon: CheckSquare, href: "/tasks" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Invoices", icon: FileText, href: "/invoices" },
  { label: "Time Tracking", icon: Clock, href: "/time" },
  { label: "Content", icon: CalendarDays, href: "/content" },
  { label: "Feedback", icon: MessageCircle, href: "/feedback" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
  { label: "Tools", icon: Wrench, href: "/tools" },
  { label: "Resources", icon: BookOpen, href: "/resources" },
];

const getClientNav = (isCA: boolean) => [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Projects", icon: FolderOpen, href: "/projects" },
  { label: "My Requests", icon: CheckSquare, href: "/tasks" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  ...(isCA ? [
    { label: "Invoices", icon: FileText, href: "/invoices" },
    { label: "Team", icon: Users, href: "/team" },
  ] : []),
  { label: "Content", icon: CalendarDays, href: "/content" },
  { label: "Tools", icon: Wrench, href: "/tools" },
  { label: "Referrals", icon: Gift, href: "/referrals" },
  { label: "Resources", icon: BookOpen, href: "/resources" },
];

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard", "/clients": "Clients", "/projects": "Projects",
  "/tasks": "Tasks", "/messages": "Messages", "/invoices": "Invoices",
  "/time": "Time Tracking", "/content": "Content", "/feedback": "Feedback",
  "/reports": "Reports", "/tools": "Tools", "/resources": "Resources",
  "/team": "Team", "/referrals": "Referrals",
};

export default function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, loading, error, isAdmin, isClientAdmin } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", flexDirection: "column", gap: 12 }}>
        <div style={{ color: B.green, fontSize: 18, fontFamily: "'Kanit',sans-serif" }}>Loading...</div>
        <div style={{ color: "#aaa", fontSize: 12 }}>Connecting to portal</div>
      </div>
    );
  }

  // Error state - shows what went wrong
  if (error) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", flexDirection: "column", gap: 16, padding: 20 }}>
        <div style={{ width: 56, height: 56, backgroundColor: B.black, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: B.white, fontFamily: "'Kanit',sans-serif", fontSize: 20, fontWeight: 700 }}>TT</span>
        </div>
        <div style={{ color: B.red, fontSize: 16, fontWeight: 600 }}>Something went wrong</div>
        <div style={{ color: "#666", fontSize: 14, textAlign: "center", maxWidth: 500, lineHeight: 1.6 }}>{error}</div>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button onClick={() => window.location.reload()} style={{ padding: "10px 20px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
            Try Again
          </button>
          <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#eee", color: "#666", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // No user
  if (!user) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Montserrat',sans-serif", flexDirection: "column", gap: 12 }}>
        <div style={{ color: "#888", fontSize: 14 }}>No user session found. Redirecting...</div>
        <button onClick={() => router.push("/login")} style={{ padding: "10px 20px", backgroundColor: B.green, color: B.white, border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
          Go to Login
        </button>
      </div>
    );
  }

  const nav = isAdmin ? ADMIN_NAV : getClientNav(isClientAdmin);
  const title = TITLES[pathname] || "Portal";

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: B.grey, fontFamily: "'Montserrat',sans-serif", overflow: "hidden" }}>

      {menuOpen && <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", zIndex: 199 }} onClick={() => setMenuOpen(false)} />}

      {/* SIDEBAR */}
      <aside style={{
        width: isMobile ? 260 : 220,
        backgroundColor: B.gd, color: B.white,
        display: "flex", flexDirection: "column", flexShrink: 0, overflow: "hidden", zIndex: 200,
        ...(isMobile ? {
          position: "fixed", left: menuOpen ? 0 : -280, top: 0, bottom: 0,
          transition: "left 0.3s", boxShadow: menuOpen ? "4px 0 20px rgba(0,0,0,0.3)" : "none",
        } : {}),
      }}>
        <div style={{ padding: 16, display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ width: 28, height: 28, backgroundColor: B.black, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: B.white, fontFamily: "'Kanit',sans-serif", fontSize: 10, fontWeight: 700 }}>TT</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Kanit',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 0.5 }}>TOM THOMAS</div>
            <div style={{ fontSize: 9, opacity: 0.5 }}>WEB & MEDIA</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "10px 6px", overflow: "auto" }}>
          {nav.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <button key={item.href} onClick={() => { router.push(item.href); setMenuOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "9px 12px",
                border: "none", borderRadius: 7,
                backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
                color: active ? B.white : "rgba(255,255,255,0.6)",
                cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontSize: 13,
                fontWeight: active ? 600 : 500, marginBottom: 1, textAlign: "left",
              }}>
                <Icon size={18} />{item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "0 4px" }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: B.gl, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
              {user.avatar_initials || user.name?.charAt(0) || "?"}
            </div>
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 10, opacity: 0.5 }}>{isAdmin ? "Admin" : isClientAdmin ? "Client Admin" : "User"}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 12px",
            border: "none", borderRadius: 7, backgroundColor: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "'Montserrat',sans-serif", fontSize: 12,
          }}>
            <LogOut size={16} />Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <header style={{
          padding: "8px 20px", backgroundColor: B.white, borderBottom: "1px solid #eee",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {isMobile && (
              <button onClick={() => setMenuOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Menu size={22} color="#666" />
              </button>
            )}
            <span style={{ fontFamily: "'Kanit',sans-serif", fontSize: 16, color: B.gd, fontWeight: 600 }}>{title}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}><Search size={18} color="#888" /></button>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}><Bell size={18} color="#888" /></button>
            <div style={{
              width: 30, height: 30, borderRadius: 8, backgroundColor: isAdmin ? B.gd : B.green,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: B.white, fontSize: 11, fontWeight: 700, fontFamily: "'Kanit',sans-serif",
            }}>
              {user.avatar_initials || user.name?.charAt(0) || "?"}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflow: "auto", padding: isMobile ? 14 : "20px 24px" }}>
          <div style={{ maxWidth: 1060, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
