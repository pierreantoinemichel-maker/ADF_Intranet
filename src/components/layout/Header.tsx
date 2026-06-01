"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/entreprises", label: "Annuaire", icon: "🏛" },
  { href: "/collaborateurs", label: "Collaborateurs", icon: "👥" },
  { href: "/connaissances", label: "Base de savoirs", icon: "📚" },
];

export default function Header({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "??";
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const active = NAV_ITEMS.find((n) => pathname.startsWith(n.href));

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header style={{ backgroundColor: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.35)", height: "60px", position: "relative", zIndex: 100 }}
      className="flex items-center px-6 gap-4 flex-shrink-0">

      {/* Logo */}
      <a href="/entreprises" className="flex items-center gap-3 no-underline flex-shrink-0">
        <div style={{ border: "1.5px solid var(--gold)", color: "var(--gold-l)", fontFamily: "var(--font-cormorant)", fontSize: "17px", width: "34px", height: "34px" }}
          className="flex items-center justify-center">
          AF
        </div>
        <div className="leading-tight">
          <div style={{ fontFamily: "var(--font-cormorant)", color: "#fff", fontSize: "15px", fontWeight: 500, letterSpacing: "1.5px" }}>
            Ateliers de France
          </div>
          <div style={{ fontSize: "9px", letterSpacing: "2.5px", color: "var(--mid)", textTransform: "uppercase" }}>
            Intranet groupe
          </div>
        </div>
      </a>

      {/* Nav dropdown */}
      <div ref={menuRef} style={{ position: "relative", marginLeft: "16px" }}>
        <button onClick={() => setOpen(!open)}
          style={{
            display: "flex", alignItems: "center", gap: "7px", padding: "6px 12px",
            borderRadius: "6px", border: "1px solid rgba(168,137,74,.3)",
            background: open ? "rgba(168,137,74,.15)" : "none",
            color: "var(--gold-l)", fontSize: "12.5px", cursor: "pointer",
            fontFamily: "var(--font-dm-sans)",
          }}>
          <span>{active?.icon ?? "☰"}</span>
          <span>{active?.label ?? "Navigation"}</span>
          <span style={{ fontSize: "9px", opacity: 0.7, marginLeft: "2px" }}>{open ? "▲" : "▼"}</span>
        </button>

        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0,
            background: "var(--dark2)", border: "1px solid rgba(168,137,74,.25)",
            borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,.4)",
            minWidth: "180px", overflow: "hidden",
          }}>
            {NAV_ITEMS.map(({ href, label, icon }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 14px", textDecoration: "none", fontSize: "13px",
                    background: isActive ? "rgba(168,137,74,.18)" : "none",
                    color: isActive ? "var(--gold-l)" : "rgba(255,255,255,.75)",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "none"; }}>
                  <span>{icon}</span>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Right — login flush to the right */}
      <div style={{ marginLeft: "auto" }} className="flex items-center gap-3">
        <div style={{ textAlign: "right", marginRight: "4px" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,.5)" }}>{userEmail}</div>
        </div>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "var(--gold)", color: "var(--dark)", fontSize: "11px", fontWeight: 500 }}
          className="flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <button onClick={handleSignOut}
          style={{ color: "var(--mid)", background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: "5px", fontSize: "11px", cursor: "pointer", padding: "5px 10px" }}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
