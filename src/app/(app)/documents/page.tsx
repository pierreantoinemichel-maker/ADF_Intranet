import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import { FileText, Download, Search, FolderOpen, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Ressources Humaines",
    icon: "👥",
    count: 14,
    docs: [
      { name: "Règlement intérieur 2026", size: "245 KB", date: "15 jan. 2026", type: "PDF" },
      { name: "Guide d'accueil nouveaux collaborateurs", size: "1.2 MB", date: "3 fév. 2026", type: "PDF" },
      { name: "Politique de télétravail", size: "180 KB", date: "20 mar. 2026", type: "PDF" },
      { name: "Formulaire de congés", size: "45 KB", date: "1 jan. 2026", type: "DOCX" },
    ],
  },
  {
    name: "Qualité & Sécurité",
    icon: "🛡️",
    count: 8,
    docs: [
      { name: "Procédures de sécurité atelier", size: "890 KB", date: "10 avr. 2026", type: "PDF" },
      { name: "Manuel qualité ISO 9001", size: "2.3 MB", date: "5 jan. 2026", type: "PDF" },
      { name: "Plan de prévention des risques", size: "670 KB", date: "28 fév. 2026", type: "PDF" },
    ],
  },
  {
    name: "Finance",
    icon: "📊",
    count: 6,
    docs: [
      { name: "Note de frais — modèle", size: "38 KB", date: "1 jan. 2026", type: "XLSX" },
      { name: "Rapport annuel 2025", size: "4.1 MB", date: "28 fév. 2026", type: "PDF" },
    ],
  },
  {
    name: "Marketing & Communication",
    icon: "📣",
    count: 11,
    docs: [
      { name: "Charte graphique 2026", size: "8.5 MB", date: "1 jan. 2026", type: "PDF" },
      { name: "Kit presse", size: "12 MB", date: "15 jan. 2026", type: "ZIP" },
      { name: "Modèles de présentation", size: "3.2 MB", date: "5 mar. 2026", type: "PPTX" },
    ],
  },
];

const typeColors: Record<string, string> = {
  PDF: "#dc2626",
  DOCX: "#2563eb",
  XLSX: "#059669",
  PPTX: "#d97706",
  ZIP: "#7c3aed",
};

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <TopBar title="Documents" userEmail={user?.email} />
      <div className="flex-1 p-6 space-y-5">
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un document..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none"
            />
          </div>
          <button
            className="px-4 py-2.5 text-sm font-medium rounded-lg text-white"
            style={{ backgroundColor: "var(--adf-navy)" }}
          >
            + Déposer un document
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="font-semibold text-sm mt-2" style={{ color: "var(--adf-navy)" }}>{cat.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{cat.count} documents</p>
            </div>
          ))}
        </div>

        {/* Document lists by category */}
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.name} className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} style={{ color: "var(--adf-gold)" }} />
                  <span className="font-semibold text-sm" style={{ color: "var(--adf-navy)" }}>
                    {cat.icon} {cat.name}
                  </span>
                </div>
                <button className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  Voir tout ({cat.count}) <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {cat.docs.map((doc) => (
                  <div
                    key={doc.name}
                    className="px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: typeColors[doc.type] || "#6b7280" }}
                    >
                      {doc.type}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--adf-navy)" }}>
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {doc.size} · Mis à jour le {doc.date}
                      </p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                      <Download size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
