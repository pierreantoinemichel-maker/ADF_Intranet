"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ZONES = ["France", "Royaume-Uni", "Monde"];
const METIERS = [
  "Pierre & Maçonnerie", "Peinture & Décors", "Métal",
  "Bois", "Décors", "Lots techniques",
];
const KB_TYPES = [
  { key: "rex", label: "Retours chantier", icon: "📋" },
  { key: "technique", label: "Fiches techniques", icon: "🔧" },
  { key: "bonnes_pratiques", label: "Bonnes pratiques", icon: "✅" },
];
const NAV = [
  { href: "/entreprises", label: "Annuaire", icon: "🏛" },
  { href: "/collaborateurs", label: "Collaborateurs", icon: "👥" },
  { href: "/connaissances", label: "Base de savoirs", icon: "📚" },
];

function SidebarInner() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const zone = searchParams.get("zone") ?? "";
  const metier = searchParams.get("metier") ?? "";
  const archived = searchParams.get("archived") === "true";
  const type = searchParams.get("type") ?? "";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const sectionLabel = (label: string) => (
    <div style={{ fontSize: "9px", letterSpacing: "1.8px", textTransform: "uppercase", color: "var(--mid)", margin: "10px 0 4px", paddingLeft: "10px" }}>
      {label}
    </div>
  );

  const filterBtn = (active: boolean, onClick: () => void, children: React.ReactNode) => (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: "8px", padding: "5px 10px",
      borderRadius: "5px", cursor: "pointer", fontSize: "11.5px",
      background: active ? "rgba(168,137,74,.18)" : "none",
      color: active ? "var(--gold-l)" : "rgba(255,255,255,.5)",
      border: "none", width: "100%", textAlign: "left",
    }}>
      {children}
    </button>
  );

  return (
    <aside style={{ width: "210px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)", flexShrink: 0 }}
      className="overflow-y-auto py-4 px-3">

      <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px", paddingLeft: "10px" }}>
        Navigation
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ href, label, icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <div key={href}>
              <Link href={href} style={{
                display: "flex", alignItems: "center", gap: "9px",
                padding: "8px 10px", borderRadius: "6px", fontSize: "13px",
                textDecoration: "none", transition: "all .18s",
                background: isActive ? "rgba(168,137,74,.22)" : "none",
                color: isActive ? "var(--gold-l)" : "rgba(255,255,255,.65)",
              }}>
                <span>{icon}</span>
                <span className="flex-1">{label}</span>
                {isActive && <span style={{ fontSize: "8px", opacity: 0.45 }}>▼</span>}
              </Link>

              {/* Sous-menus Annuaire */}
              {isActive && href === "/entreprises" && (
                <div style={{ paddingLeft: "12px", marginBottom: "4px" }}>
                  {sectionLabel("Zone")}
                  {ZONES.map((z) => filterBtn(zone === z, () => setParam("zone", zone === z ? "" : z), <span>{z}</span>))}

                  {sectionLabel("Métier")}
                  {METIERS.map((m) => filterBtn(metier === m, () => setParam("metier", metier === m ? "" : m),
                    <span className="truncate">{m}</span>
                  ))}

                  <div style={{ height: "1px", background: "rgba(255,255,255,.07)", margin: "8px 10px 6px" }} />
                  {filterBtn(archived, () => setParam("archived", archived ? "" : "true"),
                    <><span>🗄</span><span style={{ color: archived ? "#E07060" : "rgba(255,255,255,.4)" }}>Archivées</span></>
                  )}
                </div>
              )}

              {/* Sous-menus Base de savoirs */}
              {isActive && href === "/connaissances" && (
                <div style={{ paddingLeft: "12px", marginBottom: "4px" }}>
                  {sectionLabel("Contenus")}
                  {filterBtn(type === "", () => setParam("type", ""), <><span>📚</span><span>Tout</span></>)}
                  {KB_TYPES.map(({ key, label: kbLabel, icon: kbIcon }) =>
                    filterBtn(type === key, () => setParam("type", type === key ? "" : key),
                      <><span>{kbIcon}</span><span className="truncate">{kbLabel}</span></>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={
      <aside style={{ width: "210px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)", flexShrink: 0 }} />
    }>
      <SidebarInner />
    </Suspense>
  );
}
