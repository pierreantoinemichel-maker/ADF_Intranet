"use client";

import { useState, useMemo } from "react";

type Entreprise = { id: string; name: string; metier: string };
type Collaborateur = {
  id: string; first_name: string; last_name: string;
  email: string; phone: string; poste: string;
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
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--light)", backgroundColor: "var(--white)", flexShrink: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, color: "var(--dark)" }}>
              Annuaire des <em style={{ color: "var(--gold)", fontStyle: "italic" }}>collaborateurs</em>
            </h2>
            <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "3px" }}>
              {filtered.length} collaborateur{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          <button style={{ background: "var(--gold)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12.5px", cursor: "pointer", flexShrink: 0 }}>
            + Ajouter
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "7px", padding: "7px 12px" }}>
            <span style={{ color: "var(--mid)" }}>🔍</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom, prénom, poste, entreprise…"
              style={{ border: "none", background: "none", fontSize: "13.5px", color: "var(--dark)", flex: 1, outline: "none", fontFamily: "var(--font-dm-sans)" }} />
          </div>
          {entreprises.length > 0 && (
            <select value={entrepriseFilter} onChange={(e) => setEntrepriseFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "7px", border: "1px solid var(--light)", background: "var(--lighter)", fontSize: "12.5px", color: "var(--dark)", cursor: "pointer", outline: "none", fontFamily: "var(--font-dm-sans)" }}>
              <option value="Tous">Toutes les entreprises</option>
              {entreprises.map((e) => <option key={e.id} value={e.name}>{e.name}</option>)}
            </select>
          )}
        </div>
      </div>

      {/* Grid */}
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
    </div>
  );
}
