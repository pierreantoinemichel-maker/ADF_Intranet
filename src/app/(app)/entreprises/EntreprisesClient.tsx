"use client";

import { useState, useMemo, useTransition } from "react";
import { useSearchParams } from "next/navigation";

const METIERS_OPTIONS = ["Pierre & Maçonnerie", "Peinture & Décors", "Métal", "Bois", "Décors", "Lots techniques"];

type SavoirFaire = { id: string; name: string };
type Entreprise = {
  id: string; name: string; region: string; zone: string; metier: string;
  metier_label: string; color: string; initials: string; founded: string | null;
  certifications: string[]; description: string; long_description: string;
  address: string; phone: string; email: string; website: string; adf_url: string;
  archived: boolean;
  entreprise_savoir_faire: { savoir_faire: SavoirFaire }[];
};

type Props = {
  entreprises: Entreprise[];
  createEntreprise: (formData: FormData) => Promise<void>;
  archiveEntreprise: (id: string) => Promise<void>;
  restoreEntreprise: (id: string) => Promise<void>;
};

export default function EntreprisesClient({ entreprises, createEntreprise, archiveEntreprise, restoreEntreprise }: Props) {
  const searchParams = useSearchParams();
  const zone = searchParams.get("zone") ?? "";
  const metier = searchParams.get("metier") ?? "";
  const showArchived = searchParams.get("archived") === "true";

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Entreprise | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const active = entreprises.filter((e) => !e.archived);
  const archived = entreprises.filter((e) => e.archived);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const pool = showArchived ? archived : active;
    return pool.filter((e) => {
      const zOk = !zone || e.zone === zone;
      const mOk = !metier || e.metier === metier;
      const qOk = !q || [e.name, e.description, e.metier_label, e.region].join(" ").toLowerCase().includes(q);
      return zOk && mOk && qOk;
    });
  }, [entreprises, search, zone, metier, showArchived]);

  function handleArchive(e: Entreprise) {
    startTransition(async () => { await archiveEntreprise(e.id); setSelected(null); });
  }

  function handleRestore(e: Entreprise) {
    startTransition(async () => { await restoreEntreprise(e.id); setSelected(null); });
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => { await createEntreprise(formData); setShowForm(false); });
  }

  const inputStyle = {
    width: "100%", padding: "8px 12px", borderRadius: "6px",
    border: "1px solid var(--light)", background: "var(--lighter)",
    fontSize: "13px", color: "var(--dark)", outline: "none",
    fontFamily: "var(--font-dm-sans)",
  };
  const labelStyle = { fontSize: "11px", color: "var(--mid)", display: "block", marginBottom: "5px" };
  const fieldStyle = { marginBottom: "14px" };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div style={{ padding: "1.5rem 2rem 1rem", borderBottom: "1px solid var(--light)", backgroundColor: "var(--white)", flexShrink: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <h2 style={{ fontFamily: "var(--font-cormorant)", fontSize: "28px", fontWeight: 300, color: "var(--dark)", lineHeight: 1.1 }}>
              {showArchived
                ? <em style={{ color: "var(--red)", fontStyle: "italic" }}>Entreprises archivées</em>
                : <>Annuaire des <em style={{ color: "var(--gold)", fontStyle: "italic" }}>entreprises</em></>}
            </h2>
            <p style={{ fontSize: "12px", color: "var(--mid)", marginTop: "3px" }}>
              Des artisans au service de la restauration du patrimoine et du luxe · {filtered.length} entreprise{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
          {!showArchived && (
            <button onClick={() => { setShowForm(true); setSelected(null); }}
              style={{ background: "var(--gold)", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "12.5px", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
              + Ajouter une entreprise
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "7px", padding: "7px 12px" }}>
            <span style={{ color: "var(--mid)" }}>🔍</span>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Entreprise, métier, région…"
              style={{ border: "none", background: "none", fontSize: "13.5px", color: "var(--dark)", flex: 1, outline: "none", fontFamily: "var(--font-dm-sans)" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      {!showArchived && (
        <div style={{ display: "flex", gap: "1px", background: "var(--light)", borderBottom: "1px solid var(--light)", flexShrink: 0 }}>
          {[
            { n: "850 M€", l: "CA 2025" },
            { n: "3 000+", l: "Collaborateurs" },
            { n: "60", l: "Métiers" },
            { n: "15+", l: "Pays" },
          ].map(({ n, l }) => (
            <div key={l} style={{ flex: 1, background: "var(--white)", padding: ".9rem 1rem", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "22px", fontWeight: 300, color: "var(--gold)" }}>{n}</div>
              <div style={{ fontSize: "10px", color: "var(--mid)", textTransform: "uppercase", letterSpacing: ".8px" }}>{l}</div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-y-auto flex-1" style={{ padding: "1.25rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px", alignContent: "start" }}>
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", padding: "2rem", color: "var(--mid)", textAlign: "center", fontSize: "13px" }}>
              Aucune entreprise ne correspond à vos critères.
            </div>
          )}
          {filtered.map((e) => {
            const skills = e.entreprise_savoir_faire?.map((x) => x.savoir_faire?.name).filter(Boolean) ?? [];
            return (
              <div key={e.id} onClick={() => setSelected(e)}
                style={{ background: "var(--white)", border: "1px solid var(--light)", borderRadius: "10px", overflow: "hidden", cursor: "pointer", transition: "all .22s", opacity: e.archived ? 0.7 : 1 }}
                onMouseEnter={(el) => { el.currentTarget.style.borderColor = "var(--gold)"; el.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(el) => { el.currentTarget.style.borderColor = "var(--light)"; el.currentTarget.style.transform = ""; }}>
                <div style={{ height: "3px", background: e.color || "var(--gold)" }} />
                <div style={{ padding: "1.1rem" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "10px" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "16px", fontWeight: 500, color: "var(--dark)", lineHeight: 1.25 }}>{e.name}</div>
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
                  {e.description && (
                    <div style={{ fontSize: "11.5px", color: "var(--mid)", lineHeight: 1.6, margin: "8px 0", borderLeft: "2px solid var(--gold-p)", paddingLeft: "9px" }}>
                      {e.description}
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", margin: "8px 0" }}>
                      {skills.slice(0, 4).map((s) => (
                        <span key={s} style={{ padding: "2px 8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "4px", fontSize: "10px", color: "var(--dark3)" }}>{s}</span>
                      ))}
                      {skills.length > 4 && <span style={{ padding: "2px 8px", background: "var(--lighter)", border: "1px solid var(--light)", borderRadius: "4px", fontSize: "10px", color: "var(--dark3)" }}>+{skills.length - 4}</span>}
                    </div>
                  )}
                </div>
                <div style={{ borderTop: "1px solid var(--light)", padding: "8px 1.1rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(245,242,236,.6)" }}>
                  <span style={{ fontSize: "11px", color: "var(--mid)" }}>{e.metier}</span>
                  <div style={{ display: "flex", gap: "3px" }}>
                    {e.email && (
                      <button onClick={(ev) => { ev.stopPropagation(); window.location.href = `mailto:${e.email}`; }}
                        style={{ width: "26px", height: "26px", borderRadius: "5px", border: "1px solid var(--light)", background: "none", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>✉️</button>
                    )}
                    {e.adf_url && (
                      <button onClick={(ev) => { ev.stopPropagation(); window.open(e.adf_url, "_blank"); }}
                        style={{ width: "26px", height: "26px", borderRadius: "5px", border: "1px solid var(--light)", background: "none", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>🔗</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={() => setSelected(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: "460px", height: "100%", background: "var(--white)", borderLeft: "1px solid var(--light)", overflowY: "auto", boxShadow: "-6px 0 30px rgba(0,0,0,.1)" }}>
            <div style={{ padding: "1.25rem", background: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.25)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", position: "sticky", top: 0, zIndex: 2 }}>
              <div>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "22px", fontWeight: 300, color: "#fff", lineHeight: 1.2 }}>{selected.name}</div>
                <div style={{ fontSize: "11px", color: "var(--mid)", marginTop: "3px" }}>{selected.metier} · {selected.region}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mid)", fontSize: "18px" }}>✕</button>
            </div>
            <div style={{ padding: "1.25rem" }}>
              {selected.certifications?.length > 0 && (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                  {selected.certifications.map((c) => (
                    <span key={c} style={{ background: "var(--gold-p)", color: "var(--gold-d)", fontSize: "10.5px", padding: "4px 12px", borderRadius: "5px", fontWeight: 500 }}>🏅 {c}</span>
                  ))}
                </div>
              )}
              <div style={{ marginBottom: "1.75rem" }}>
                <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>Contact</div>
                <div style={{ background: "var(--gold-p)", borderRadius: "8px", padding: "1rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-cormorant)", fontSize: "19px", fontWeight: 500, border: "2px solid var(--gold)", background: `${selected.color}18`, color: selected.color, flexShrink: 0 }}>
                    {selected.initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "var(--dark)" }}>{selected.name}</div>
                    {selected.founded && <div style={{ fontSize: "11px", color: "var(--mid)" }}>Fondée en {selected.founded}</div>}
                    <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {selected.phone && <a href={`tel:${selected.phone}`} style={{ fontSize: "11.5px", color: "var(--blue)", textDecoration: "none" }}>📞 {selected.phone}</a>}
                      {selected.email && <a href={`mailto:${selected.email}`} style={{ fontSize: "11.5px", color: "var(--blue)", textDecoration: "none" }}>✉️ {selected.email}</a>}
                      {selected.website && <a href={selected.website} target="_blank" rel="noreferrer" style={{ fontSize: "11.5px", color: "var(--blue)", textDecoration: "none" }}>🌐 {selected.website.replace(/https?:\/\//, "")}</a>}
                      {selected.address && <span style={{ fontSize: "11px", color: "var(--mid)" }}>📍 {selected.address}</span>}
                    </div>
                  </div>
                </div>
              </div>
              {(selected.long_description || selected.description) && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>Présentation</div>
                  <p style={{ fontSize: "12.5px", color: "var(--mid)", lineHeight: 1.75 }}>{selected.long_description || selected.description}</p>
                </div>
              )}
              {selected.entreprise_savoir_faire?.length > 0 && (
                <div style={{ marginBottom: "1.75rem" }}>
                  <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "17px", fontWeight: 400, color: "var(--dark)", marginBottom: ".8rem", paddingBottom: "6px", borderBottom: "1px solid var(--light)" }}>Savoir-faire</div>
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
                <a href={selected.adf_url} target="_blank" rel="noreferrer" style={{ color: "var(--blue)", fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none", marginBottom: "1rem" }}>
                  🔗 Voir sur ateliersdefrance.com
                </a>
              )}
              <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--light)" }}>
                {selected.archived ? (
                  <button onClick={() => handleRestore(selected)} disabled={isPending}
                    style={{ width: "100%", padding: "10px", borderRadius: "7px", background: "var(--green)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", opacity: isPending ? 0.6 : 1 }}>
                    ♻️ Restaurer cette entreprise
                  </button>
                ) : (
                  <button onClick={() => handleArchive(selected)} disabled={isPending}
                    style={{ width: "100%", padding: "10px", borderRadius: "7px", background: "none", border: "1px solid var(--light)", color: "var(--mid)", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px", opacity: isPending ? 0.6 : 1 }}>
                    🗄 Archiver cette entreprise
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add form panel */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", right: 0, top: 0, width: "480px", height: "100%", background: "var(--white)", borderLeft: "1px solid var(--light)", overflowY: "auto", boxShadow: "-6px 0 30px rgba(0,0,0,.1)" }}>
            <div style={{ padding: "1.25rem", background: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.25)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 2 }}>
              <div style={{ fontFamily: "var(--font-cormorant)", fontSize: "20px", fontWeight: 300, color: "#fff" }}>
                Nouvelle entreprise
              </div>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--mid)", fontSize: "18px" }}>✕</button>
            </div>
            <form onSubmit={handleCreate} style={{ padding: "1.5rem" }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Nom *</label>
                <input name="name" required placeholder="Ex : Atelier Dupont" style={inputStyle} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Métier *</label>
                <select name="metier" required style={inputStyle}>
                  <option value="">— Sélectionner —</option>
                  {METIERS_OPTIONS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Zone</label>
                  <select name="zone" style={inputStyle}>
                    <option value="">—</option>
                    {["France", "Royaume-Uni", "Monde"].map((z) => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Région / Ville</label>
                  <input name="region" placeholder="Ex : Île-de-France" style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" rows={3} placeholder="Présentation courte de l'entreprise…"
                  style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Adresse</label>
                <input name="address" placeholder="Adresse complète" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" placeholder="contact@exemple.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Téléphone</label>
                  <input name="phone" placeholder="+33 1 23 45 67 89" style={inputStyle} />
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Site web</label>
                <input name="website" type="url" placeholder="https://www.exemple.com" style={inputStyle} />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
                <button type="submit" disabled={isPending}
                  style={{ flex: 1, padding: "11px", borderRadius: "7px", background: "var(--gold)", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, opacity: isPending ? 0.6 : 1 }}>
                  {isPending ? "Enregistrement…" : "Créer l'entreprise"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "11px 16px", borderRadius: "7px", background: "none", border: "1px solid var(--light)", color: "var(--dark)", cursor: "pointer", fontSize: "13px" }}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
