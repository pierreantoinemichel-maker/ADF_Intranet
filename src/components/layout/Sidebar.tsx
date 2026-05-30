"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/entreprises", label: "Annuaire", icon: "🏛" },
  { href: "/collaborateurs", label: "Collaborateurs", icon: "👥" },
  { href: "/connaissances", label: "Base de savoirs", icon: "📚" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ width: "200px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)", flexShrink: 0 }}
      className="flex flex-col py-4 px-3">
      <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px", paddingLeft: "10px" }}>
        Navigation
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              style={{
                display: "flex", alignItems: "center", gap: "9px",
                padding: "8px 10px", borderRadius: "6px", fontSize: "13px",
                textDecoration: "none", transition: "all .18s",
                background: active ? "rgba(168,137,74,.18)" : "none",
                color: active ? "var(--gold-l)" : "rgba(255,255,255,.65)",
              }}>
              <span>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
