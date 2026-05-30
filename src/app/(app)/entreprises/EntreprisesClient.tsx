"use client";

import { useState, useMemo } from "react";

const ZONES = ["Tous", "France", "Royaume-Uni", "Monde"];
const METIERS = ["Tous", "Pierre & Maçonnerie", "Peinture & Décors", "Métal", "Bois", "Décors", "Lots techniques"];

type SavoirFaire = { id: string; name: string };
type Entreprise = {
  id: string;
  name: string;
  region: string;
  zone: string;
  metier: string;
  metier_label: string;
  color: string;
  initials: string;
  founded: string | null;
  certifications: string[];
  description: string;
  long_description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  adf_url: string;
  entreprise_savoir_faire: { savoir_faire: SavoirFaire }[];
};

export default function EntreprisesClient({ entreprises }: { entreprises: Entreprise[] }) {
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("Tous");
  const [metier, setMetier] = useState("Tous");
  const [selected, setSelected] = useState<Entreprise | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return entreprises.filter((e) => {
      const zOk = zone === "Tous" || e.zone === zone;
      const mOk = metier === "Tous" || e.metier === metier;
      const qOk = !q || [e.name, e.description, e.metier_label, e.region]
        .join(" ").toLowerCase().includes(q);
      return zOk && mOk && qOk;
    });
  }, [entreprises, search, zone, metier]);

  const metierCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    METIERS.slice(1).forEach((m) => {
      counts[m] = entreprises.filter((e) => e.metier === m).length;
    });
    return counts;
  }, [entreprises]);

  return (
    <div className="flex h-full overflow-hidden" style={{ fontFamily: "var(--font-dm-sans)" }}>
      {/* Sidebar */}
      <aside style={{ width: "240px", backgroundColor: "var(--dark2)", borderRight: "1px solid rgba(168,137,74,.15)" }}
        className="flex-shrink-0 overflow-y-auto p-4">
        <div style={{ fontSize: "9.5px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--mid)", marginBottom: "8px" }}>
          Filtres
        </div>

        {/* Zone */}
        <div style={{ fontSize: "10px", color: "var(--mid)", marginBottom: "5px", paddingLeft: "4px" }}>Pays / Région</div>
        <div className="flex flex-wrap gap-1 mb-4">
          {ZONES.map((z) => (
            <button key={z} onClick={() => setZone(z)}
              style={{
                padding: "3px 9px", borderRadius: "14px", fontSize: "10.5px", cursor: "pointer", transition: "all .18s",
                background: zone === z ? "rgba(168,137,74,.2)" : "none",
                border: zone === z ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,.1)",
                color: zone === z ? "var(--gold-l)" : "rgba(255,255,255,.5)",
              }}>
              {z}
            </button>
          ))}
        </div>

        {/* Métier */}
        <div style={{ fontSize: "10px", color: "var(--mid)", marginBottom: "5px", paddingLeft: "4px" }}>Métier</div>
        <div className="flex flex-col gap-0.5">
          {METIERS.map((m) => (
            <button key={m} onClick={() => setMetier(m)}
              style={{
                display: "flex", alignItems: "center", gap: "9px", padding: "7px 10px",
                borderRadius: "6px", cursor: "pointer", fontSize: "12px", transition: "all .18s",
                background: metier === m ? "rgba(168,137,74,.18)" : "none",
                color: metier === m ? "var(--gold-l)" : "rgba(255,255,255,.65)",
                border: "none", width: "100%", textAlign: "left",
              }}>
              <span className="flex-1">{m === "Tous" ? "Toutes les filiales" : m}</span>
              {m !== "Tous" && (
                <span style={{ background: "var(--gold)", color: "var(--dark)", fontSize: "9px", padding: "1px 6px", borderRadius: "8px", fontWeight: 600 }}>
                  {metierCounts[m] ?? 0}
                </span>
              )}
              {m === "Tous" && (
                <span style={{ background: "var(--gold)", color: "var(--dark)", fontSize: "9px", padding: "1px 6px", borderRadius: "8px", fontWeight: 600 }}>
                  {entreprises.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Page header */}
        <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--light)", backgroundColor: "var(--white)", flexShrink: 0 }}>
          <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, color: "var(--dark)", lineHeight: 1.1 }}>
            Annuaire des <em style={{ color: "var(--gold)", fontStyle: "italic" }}>filiales</em>
          </h2>
          <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "3px" }}>
            Groupe Ateliers de France · {filtered.length} entreprises · savoir-faire d'exception
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "7px", padding: "7px 12px" }}>
              <span style={{ color: "var(--mid)", fontSize: "15px" }}>🔍</span>
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Entreprise, métier, compétence, ville…"
                style={{ border: "none", background: "none", fontSize: "13.5px", color: "var(--dark)", flex: 1, outline: "none", fontFamily: "var(--font-dm-sans)" }} />
            </div>
            <button style={{ background: "var(--gold)", color: "#fff", border: "none", padding: "7px 14px", borderRadius: "6px", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
              + Ajouter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "1px", background: "var(--light)", borderBottom: "1px solid var(--light)", flexShrink: 0 }}>
          {[
            { n: entreprises.length, l: "Filiales" },
            { n: Object.values(metierCounts).filter(Boolean).length, l: "Métiers" },
            { n: new Set(entreprises.map((e) => e.zone)).size, l: "Zones" },
            { n: entreprises.filter((e) => e.certifications?.includes("EPV")).length, l: "Label EPV" },
          ].map(({ n, l }) => (
            <div key={l} style={{ flex: 1, background: "var(--white)", padding: ".9rem 1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "24px", fontWeight: 300, color: "var(--gold)" }}>{n}</div>
              <div style={{ fontSize: "10px", color: "var(--mid)", textTransform: "uppercase", letterSpacing: ".8px", marginTop: "1px" }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1" style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px", alignContent: "start" }}>
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: "2rem", color: "var(--mid)", textAlign: "center", fontSize: "13px" }}>
                Aucune filiale ne correspond à vos critères.
              </div>
            )}
            {filtered.map((e) => {
              const skills = e.entreprise_savoir_faire?.map((x) => x.savoir_faire?.name).filter(Boolean) ?? [];
              return (
                <div key={e.id} onClick={() => setSelected(e)}
                  style={{ background: "var(--white)", border: "1px solid var(--light)", borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "all .22s" }}
                  onMouseEnter={(el) => { el.currentTarget.style.borderColor = "var(--gold)"; el.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(el) => { el.currentTarget.style.borderColor = "var(--light)"; el.currentTarget.style.transform = ""; }}>
                  <div style={{ height: "3px", background: e.color || "var(--gold)" }} />
                  <div style={{ padding: "1.1rem" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px", fontWeight: 500, color: "var(--dark)", lineHeight: 1.25 }}>
                          {e.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--mid)", marginTop: "2px" }}>📍 {e.region}</div>
                        {e.certifications?.length > 0 && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "9.5px", color: "var(--gold-d)", background: "var(--gold-p)", padding: "2px 7px", borderRadius: "4px", fontWeight: 500, marginTop: "3px" }}>
                            🏅 {e.certifications.join(" · ")}
                          </div>
                        )}
                      </div>
                      <div style={{ width: "42px", height: "42px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cormorant)", fontSize: "16px", fontWeight: 600, background: `${e.color}18`, color: e.color, flexShrink: 0 }}>
                        {e.initials}
                      </div>
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--mid)", lineHeight: 1.6, margin: "8px 0", borderLeft: "2px solid var(--gold-p)", paddingLeft: "9px" }}>
                      {e.description}
                    </div>
                    {skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "8px 0" }}>
                        {skills.slice(0, 4).map((s) => (
                          <span key={s} style={{ padding: "2px 8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "4px", fontSize: "10px", color: "var(--dark3)" }}>
                            {s}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span style={{ padding: "2px 8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "4px", fontSize: "10px", color: "var(--dark3)" }}>
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ borderTop: "1px solid var(--light)", padding: "8px 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(245,242,236,.6)" }}>
                    <span style={{ fontSize: "11px", color: "var(--mid)" }}>{e.metier}</span>
                    <div style={{ display: "flex", gap: "3px" }}>
                      {e.email && (
                        <button onClick={(ev) => { ev.stopPropagation(); window.location.href = `mailto:${e.email}`; }}
                          style={{ width: "26px", height: "26px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--light)", background: "none", cursor: "pointer", fontSize: "12px" }}
                          title="Email">✉️</button>
                      )}
                      {e.adf_url && (
                        <button onClick={(ev) => { ev.stopPropagation(); window.open(e.adf_url, "_blank"); }}
                          style={{ width: "26px", height: "26px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--light)", background: "none", cursor: "pointer", fontSize: "12px" }}
                          title="Voir sur ADF">🔗</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Detail panel */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={() => setSelected(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: "460px", height: "100%", background: "var(--white)", borderLeft: "1px solid var(--light)", overflowY: "auto", boxShadow: "-6px 0 30px rgba(0,0,0,.1)" }}>
            <div style={{ padding: "1.25rem", background: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.25)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", position: "sticky", top: 0, zIndex: 2 }}>
              <div>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "22px", fontWeight: 300, color: "#fff", lineHeight: 1.2 }}>{selected.name}</div>
                <div style={{ fontSize: "11px", color: "var(--mid)", marginTop: "3px" }}>{selected.metier_label} · {selected.region}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mid)", fontSize: "18px", padding: "2px" }}>✕</button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              {selected.certifications?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {selected.certifications.map((c) => (
                    <span key={c} style={{ background: "var(--gold-p)", color: "var(--gold-d)", fontSize: "10.5px", padding: "4px 12px", borderRadius: "5px", fontWeight: 500 }}>
                      🏅 {c}
                    </span>
                  ))}
                </div>
              )}

              {/* Contact */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                  Contact
                </div>
                <div style={{ background: "var(--gold-p)", borderRadius: "8px", padding: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cormorant)", fontSize: "19px", fontWeight: 500, border: "2px solid var(--gold)", background: `${selected.color}18`, color: selected.color, flexShrink: 0 }}>
                    {selected.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "var(--dark)" }}>{selected.name}</div>
                    {selected.founded && <div style={{ fontSize: "11px", color: "var(--mid)", marginTop: "2px" }}>Fondée en {selected.founded}</div>}
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {selected.phone && <a href={`tel:${selected.phone}`} style={{ fontSize: "11.5px", color: "var(--blue)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>📞 {selected.phone}</a>}
                      {selected.email && <a href={`mailto:${selected.email}`} style={{ fontSize: "11.5px", color: "var(--blue)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>✉️ {selected.email}</a>}
                      {selected.website && <a href={selected.website} target="_blank" rel="noreferrer" style={{ fontSize: "11.5px", color: "var(--blue)", display: "flex", alignItems: "center", gap: "5px", textDecoration: "none" }}>🌐 {selected.website.replace(/https?:\/\//, "")}</a>}
                      {selected.address && <span style={{ fontSize: "11px", color: "var(--mid)", display: "flex", alignItems: "center", gap: "5px" }}>📍 {selected.address}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                  Présentation
                </div>
                <p style={{ fontSize: "12.5px", color: "var(--mid)", lineHeight: 1.75 }}>
                  {selected.long_description || selected.description}
                </p>
              </div>

              {/* Savoirs faire */}
              {selected.entreprise_savoir_faire?.length > 0 && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>
                    Savoir-faire
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {selected.entreprise_savoir_faire.map((x) => x.savoir_faire && (
                      <span key={x.savoir_faire.id} style={{ padding: "2px 8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "4px", fontSize: "11px", color: "var(--dark3)" }}>
                        {x.savoir_faire.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.adf_url && (
                <a href={selected.adf_url} target="_blank" rel="noreferrer"
                  style={{ color: "var(--blue)", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none" }}>
                  🔗 Voir la fiche sur ateliersdefrance.com
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
