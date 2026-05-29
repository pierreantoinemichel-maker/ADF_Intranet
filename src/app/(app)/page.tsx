import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  ArrowRight,
  Newspaper,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Collaborateurs", value: "48", icon: Users, trend: "+3 ce mois" },
  { label: "Documents", value: "124", icon: FileText, trend: "+12 ce mois" },
  { label: "Ateliers actifs", value: "6", icon: TrendingUp, trend: "Stables" },
  { label: "Événements", value: "3", icon: Calendar, trend: "Ce mois" },
];

const news = [
  {
    id: 1,
    title: "Ouverture du nouvel atelier à Lyon",
    date: "28 mai 2026",
    category: "Expansion",
    excerpt:
      "Le groupe Ateliers de France inaugure son 7ème site de production dans la région Auvergne-Rhône-Alpes.",
  },
  {
    id: 2,
    title: "Résultats T1 2026 — objectifs dépassés",
    date: "15 mai 2026",
    category: "Finance",
    excerpt:
      "Le premier trimestre enregistre une croissance de 18% par rapport à la même période en 2025.",
  },
  {
    id: 3,
    title: "Formation sécurité obligatoire — juin 2026",
    date: "10 mai 2026",
    category: "RH",
    excerpt:
      "Tous les collaborateurs doivent compléter la formation sécurité avant le 30 juin. Inscriptions ouvertes.",
  },
];

const quickLinks = [
  { label: "Annuaire", href: "/annuaire", icon: Users },
  { label: "Documents RH", href: "/documents", icon: FileText },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const firstName = user?.email?.split("@")[0] ?? "collaborateur";

  return (
    <>
      <TopBar title="Tableau de bord" userEmail={user?.email} />
      <div className="flex-1 p-6 space-y-6">
        {/* Greeting */}
        <div
          className="rounded-xl p-6 text-white"
          style={{
            background: "linear-gradient(135deg, var(--adf-navy) 0%, var(--adf-navy-light) 100%)",
          }}
        >
          <p className="text-white/70 text-sm mb-1">{new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <h2 className="text-2xl font-bold">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-white/70 mt-1 text-sm">Bienvenue sur l'intranet du groupe Ateliers de France.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, trend }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "var(--adf-navy)", opacity: 0.08 }}
                />
                <Icon size={18} style={{ color: "var(--adf-navy)" }} className="-ml-7" />
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--adf-navy)" }}>{value}</p>
              <p className="text-xs text-gray-400 mt-1">{trend}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* News */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper size={18} style={{ color: "var(--adf-gold)" }} />
                <h3 className="font-semibold text-sm" style={{ color: "var(--adf-navy)" }}>
                  Actualités
                </h3>
              </div>
              <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                Voir tout <ArrowRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {news.map((item) => (
                <div key={item.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: "var(--adf-gold)",
                        color: "white",
                        opacity: 0.9,
                      }}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-gray-400">{item.date}</span>
                  </div>
                  <p className="font-medium text-sm" style={{ color: "var(--adf-navy)" }}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.excerpt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick access */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--adf-navy)" }}>
                Accès rapide
              </h3>
              <div className="space-y-2">
                {quickLinks.map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium"
                    style={{ color: "var(--adf-navy)" }}
                  >
                    <Icon size={16} style={{ color: "var(--adf-gold)" }} />
                    {label}
                    <ArrowRight size={14} className="ml-auto text-gray-300" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming events */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--adf-navy)" }}>
                Prochains événements
              </h3>
              <div className="space-y-3">
                {[
                  { date: "3 juin", label: "Réunion direction générale" },
                  { date: "10 juin", label: "Formation sécurité — Lyon" },
                  { date: "18 juin", label: "Journée portes ouvertes" },
                ].map(({ date, label }) => (
                  <div key={date} className="flex gap-3 items-start">
                    <div
                      className="text-xs font-bold px-2 py-1 rounded-md min-w-[48px] text-center"
                      style={{ backgroundColor: "var(--adf-navy)", color: "white" }}
                    >
                      {date}
                    </div>
                    <p className="text-xs text-gray-600 pt-1">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
