"use client";

import { useState, useMemo } from "react";

type Entreprise = { id: string; name: string; metier: string };
type Collaborateur = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  poste: string;
  entreprises: { id: string; name: string; metier: string; color: string; initials: string } | null;
};

export default function CollaborateursClient({ collaborateurs, entreprises }: { collaborateurs: Collaborateur[]; entreprises: Entreprise[] }) {
  const [search, setSearch] = useState("");
  const [entrepriseFilter, setEntrepriseFilter] = useState("Tous");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return collaborateurs.filter((c) => {
      const eOk = entrepriseFilter === "Tous" || c.entreprises?.name === entrepriseFilter;
      const qOk = !q || [c.first_name, c.last_name, c.email, c.poste, c.entreprises?.name]
        .join(" ").toLowerCase().includes(q);
      return eOk && qOk;
    });
  }, [collaborateurs, search, entrepriseFilter]);

  const initials = (c: Collaborateur) => {
    const f = c.first_name?.[0] ?? "";
    const l = c.last_name?.[0] ?? "";
    return (f + l).toUpperCase() || "??";
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside style={{ width: "240px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)" }}
        className="flex-shrink-0 overflow-y-auto p-4">
        <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px" }}>
          Par entreprise
        </div>
        <div className="flex flex-col gap-0.5">
          {["Tous", ...entreprises.map((e) => e.name)].map((name) => (
            <button key={name} onClick={() => setEntrepriseFilter(name)}
              style={{
                display: "flex", alignItems: "center", gap: "9px", padding: "7px 10px",
                borderRadius: "6px", cursor: "pointer", fontSize: "12px", transition: "all .18s",
                background: entrepriseFilter === name ? "rgba(168,137,74,.18)" : "none",
                color: entrepriseFilter === name ? "var(--gold-l)" : "rgba(255,255,255,.65)",
                border: "none", width: "100%", textAlign: "left",
              }}>
              <span className="flex-1 truncate">{name === "Tous" ? "Tous les collaborateurs" : name}</span>
              {name === "Tous" && (
                <span style={{ background: "var(--gold)", color: "var(--dark)", fontSize: "9px", padding: "1px 6px", borderRadius: "8px", fontWeight: 600 }}>
                  {collaborateurs.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--light)", backgroundColor: "var(--white)", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, color: "var(--dark)" }}>
            Annuaire des <em style={{ color: "var(--gold)", fontStyle: "italic" }}>collaborateurs</em>
          </h2>
          <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "3px" }}>
            {filtered.length} collaborateur{filtered.length > 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "7px", padding: "7px 12px" }}>
              <span style={{ color: "var(--mid)" }}>🔍</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, prénom, poste, entreprise…"
                style={{ border: "none", background: "none", fontSize: "13.5px", color: "var(--dark)", flex: 1, outline: "none", fontFamily: "var(--font-dm-sans)" }} />
            </div>
            <button style={{ background: "var(--gold)", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", fontSize: "12.5px", cursor: "pointer" }}>
              + Ajouter
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1" style={{ padding: "1.25rem 1.5rem" }}>
          {collaborateurs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--mid)" }}>
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", marginBottom: "8px" }}>Aucun collaborateur</div>
              <p style={{ fontSize: "13px" }}>Ajoutez les collaborateurs depuis Supabase ou via le bouton ci-dessus.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {filtered.map((c) => (
                <div key={c.id}
                  style={{ background: "var(--white)", border: "1px solid var(--light)", borderRadius: "10px", padding: "1rem", transition: "all .2s" }}
                  onMouseEnter={(el) => { el.currentTarget.style.borderColor = "var(--gold)"; }}
                  onMouseLeave={(el) => { el.currentTarget.style.borderColor = "var(--light)"; }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cormorant)", fontSize: "16px", fontWeight: 600, background: `${c.entreprises?.color ?? "var(--gold)"}18`, color: c.entreprises?.color ?? "var(--gold)", border: `1.5px solid ${c.entreprises?.color ?? "var(--gold)"}40`, flexShrink: 0 }}>
                      {initials(c)}
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontWeight: 500, fontSize: "14px", color: "var(--dark)" }}>
                        {c.first_name} {c.last_name}
                      </div>
                      {c.poste && <div style={{ fontSize: "11px", color: "var(--mid)", marginTop: "1px" }}>{c.poste}</div>}
                    </div>
                  </div>

                  {c.entreprises && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--gold-d)", background: "var(--gold-p)", padding: "2px 8px", borderRadius: "4px", marginBottom: "10px" }}>
                      🏛 {c.entreprises.name}
                    </div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {c.email && (
                      <a href={`mailto:${c.email}`} style={{ fontSize: "11.5px", color: "var(--blue)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
                        ✉️ <span className="truncate">{c.email}</span>
                      </a>
                    )}
                    {c.phone && (
                      <a href={`tel:${c.phone}`} style={{ fontSize: "11.5px", color: "var(--blue)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>
                        📞 {c.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
