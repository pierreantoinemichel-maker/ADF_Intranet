"use client";

import { useState, useMemo } from "react";

const TYPES = [
  { key: "all", label: "Tout", icon: "📚" },
  { key: "rex", label: "Retours chantier", icon: "📋" },
  { key: "technique", label: "Fiches techniques", icon: "🔧" },
  { key: "bonnes_pratiques", label: "Bonnes pratiques", icon: "✅" },
];

const TYPE_LABELS: Record<string, string> = {
  rex: "Retour d'expérience",
  technique: "Fiche technique",
  bonnes_pratiques: "Bonne pratique",
};

const TYPE_COLORS: Record<string, string> = {
  rex: "var(--gold-d)",
  technique: "var(--blue)",
  bonnes_pratiques: "var(--green)",
};

type Fiche = {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
  source: string;
  created_at: string;
  entreprises: { id: string; name: string; color: string; initials: string } | null;
  kb_savoir_faire: { savoir_faire: { id: string; name: string } | null }[];
};

export default function ConnaissancesClient({ fiches }: { fiches: Fiche[] }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [selected, setSelected] = useState<Fiche | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return fiches.filter((f) => {
      const tOk = type === "all" || f.type === type;
      const qOk = !q || [f.title, f.description, f.source].join(" ").toLowerCase().includes(q);
      return tOk && qOk;
    });
  }, [fiches, search, type]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: fiches.length };
    TYPES.slice(1).forEach(({ key }) => { c[key] = fiches.filter((f) => f.type === key).length; });
    return c;
  }, [fiches]);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <aside style={{ width: "240px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)" }}
        className="flex-shrink-0 overflow-y-auto p-4">
        <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px" }}>
          Contenus
        </div>
        <div className="flex flex-col gap-0.5 mb-6">
          {TYPES.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setType(key)}
              style={{
                display: "flex", alignItems: "center", gap: "9px", padding: "7px 10px",
                borderRadius: "6px", cursor: "pointer", fontSize: "12px", transition: "all .18s",
                background: type === key ? "rgba(168,137,74,.18)" : "none",
                color: type === key ? "var(--gold-l)" : "rgba(255,255,255,.65)",
                border: "none", width: "100%", textAlign: "left",
              }}>
              <span>{icon}</span>
              <span className="flex-1">{label}</span>
              <span style={{ background: "var(--gold)", color: "var(--dark)", fontSize: "9px", padding: "1px 6px", borderRadius: "8px", fontWeight: 600 }}>
                {counts[key] ?? 0}
              </span>
            </button>
          ))}
        </div>
        <div style={{ height: "1px", background: "rgba(255,255,255,.07)", margin: ".75rem 0" }} />
        <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px" }}>
          Ajouter
        </div>
        <button style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", color: "rgba(255,255,255,.65)", border: "none", background: "none", width: "100%" }}>
          ✏️ Nouvelle fiche
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--light)", backgroundColor: "var(--white)", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, color: "var(--dark)" }}>
            Base de <em style={{ color: "var(--gold)", fontStyle: "italic" }}>savoirs</em>
          </h2>
          <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "3px" }}>
            Retours d'expérience · fiches techniques · bonnes pratiques partagées
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "7px", padding: "7px 12px" }}>
              <span style={{ color: "var(--mid)" }}>🔍</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher dans la base…"
                style={{ border: "none", background: "none", fontSize: "13.5px", color: "var(--dark)", flex: 1, outline: "none", fontFamily: "var(--font-dm-sans)" }} />
            </div>
            <button style={{ background: "var(--gold)", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", fontSize: "12.5px", cursor: "pointer" }}>
              + Contribuer
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1" style={{ padding: "1.25rem" }}>
          {fiches.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--mid)" }}>
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", marginBottom: "8px" }}>Base de savoirs vide</div>
              <p style={{ fontSize: "13px" }}>Exécutez le fichier <code>supabase/seed.sql</code> pour importer les données initiales.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "12px" }}>
              {filtered.map((f) => {
                const skills = f.kb_savoir_faire?.map((x) => x.savoir_faire?.name).filter(Boolean) ?? [];
                return (
                  <div key={f.id} onClick={() => setSelected(f)}
                    style={{ background: "var(--white)", border: "1px solid var(--light)", borderRadius: "10px", padding: "1rem", cursor: "pointer", transition: "all .2s" }}
                    onMouseEnter={(el) => { el.currentTarget.style.borderColor = "var(--gold)"; }}
                    onMouseLeave={(el) => { el.currentTarget.style.borderColor = "var(--light)"; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "9.5px", letterSpacing: ".8px", textTransform: "uppercase", color: TYPE_COLORS[f.type] ?? "var(--mid)", marginBottom: "7px" }}>
                      {TYPES.find((t) => t.key === f.type)?.icon} {TYPE_LABELS[f.type]}
                    </div>
                    <h3 style={{ fontFamily: "var(--font-cormorant)", fontSize: "15.5px", fontWeight: 400, color: "var(--dark)", marginBottom: "5px", lineHeight: 1.3 }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: "11.5px", color: "var(--mid)", lineHeight: 1.6 }}>
                      {f.description?.slice(0, 120)}{(f.description?.length ?? 0) > 120 ? "…" : ""}
                    </p>
                    {skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "8px" }}>
                        {skills.map((s) => (
                          <span key={s} style={{ padding: "2px 7px", borderRadius: "4px", fontSize: "9.5px", background: "var(--lighter)", border: "1px solid var(--light)", color: "var(--dark3)" }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "10.5px", color: "var(--mid)", display: "flex", alignItems: "center", gap: "3px" }}>
                        🏛 {f.source}
                      </span>
                      <span style={{ fontSize: "9.5px", color: "var(--mid)" }}>{formatDate(f.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Detail panel */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={() => setSelected(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: "460px", height: "100%", background: "var(--white)", borderLeft: "1px solid var(--light)", overflowY: "auto", boxShadow: "-6px 0 30px rgba(0,0,0,.1)" }}>
            <div style={{ padding: "1.25rem", background: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.25)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", position: "sticky", top: 0, zIndex: 2 }}>
              <div>
                <div style={{ fontSize: "9.5px", letterSpacing: ".8px", textTransform: "uppercase", color: TYPE_COLORS[selected.type] ?? "var(--mid)", marginBottom: "4px" }}>
                  {TYPES.find((t) => t.key === selected.type)?.icon} {TYPE_LABELS[selected.type]}
                </div>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", fontWeight: 300, color: "#fff", lineHeight: 1.2 }}>
                  {selected.title}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mid)", fontSize: "18px" }}>✕</button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                  Résumé
                </div>
                <p style={{ fontSize: "13px", color: "var(--dark)", lineHeight: 1.8 }}>{selected.description}</p>
              </div>
              {selected.content && (
                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                    Contenu détaillé
                  </div>
                  <p style={{ fontSize: "13px", color: "var(--dark)", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{selected.content}</p>
                </div>
              )}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                  Source
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 10px", background: "var(--white)", border: "1px solid var(--light)", borderRadius: "6px", fontSize: "12.5px" }}>
                  🏛 {selected.source}
                </div>
              </div>
              {selected.kb_savoir_faire?.length > 0 && (
                <div>
                  <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                    Savoir-faire associés
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {selected.kb_savoir_faire.map((x) => x.savoir_faire && (
                      <span key={x.savoir_faire.id} style={{ padding: "2px 7px", borderRadius: "4px", fontSize: "10.5px", background: "var(--gold-p)", border: "1px solid rgba(168,137,74,.3)", color: "var(--gold-d)" }}>
                        {x.savoir_faire.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
