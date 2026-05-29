"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Identifiants incorrects. Vérifiez votre email et mot de passe.");
    } else {
      router.push("/");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "var(--adf-navy)" }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: "var(--adf-gold)", color: "var(--adf-navy)" }}
          >
            ADF
          </div>
          <span className="text-white font-semibold">Ateliers de France</span>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            L'intranet du<br />
            <span style={{ color: "var(--adf-gold)" }}>groupe Ateliers<br />de France</span>
          </h1>
          <p className="text-white/60 text-sm max-w-sm">
            Accédez à vos outils, ressources et informations internes en toute sécurité.
          </p>
        </div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} Ateliers de France. Tous droits réservés.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white lg:rounded-l-3xl">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: "var(--adf-gold)", color: "var(--adf-navy)" }}
            >
              ADF
            </div>
            <span className="font-semibold" style={{ color: "var(--adf-navy)" }}>Ateliers de France</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: "var(--adf-navy)" }}>
            Connexion
          </h2>
          <p className="text-sm text-gray-500 mb-8">Entrez vos identifiants professionnels</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--adf-navy)" }}>
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="prenom.nom@ateliersdefrance.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
                style={{ "--tw-ring-color": "var(--adf-navy)" } as React.CSSProperties}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" style={{ color: "var(--adf-navy)" }}>
                  Mot de passe
                </label>
                <button type="button" className="text-xs text-gray-400 hover:text-gray-600">
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ backgroundColor: "var(--adf-navy)" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Accès réservé aux collaborateurs du groupe Ateliers de France.
          </p>
        </div>
      </div>
    </div>
  );
}
