import { createClient } from "@/lib/supabase/server";
import TopBar from "@/components/layout/TopBar";
import { Search, Mail, Phone, MapPin } from "lucide-react";

// Placeholder data until Supabase profiles table is populated
const mockEmployees = [
  { id: 1, name: "Marie Dupont", role: "Directrice générale", department: "Direction", location: "Paris", email: "m.dupont@ateliersdefrance.com", phone: "+33 1 23 45 67 89", initials: "MD" },
  { id: 2, name: "Jean-Luc Martin", role: "Responsable Production", department: "Production", location: "Lyon", email: "jl.martin@ateliersdefrance.com", phone: "+33 4 56 78 90 12", initials: "JM" },
  { id: 3, name: "Sophie Bernard", role: "Responsable RH", department: "Ressources Humaines", location: "Paris", email: "s.bernard@ateliersdefrance.com", phone: "+33 1 34 56 78 90", initials: "SB" },
  { id: 4, name: "Pierre Leroy", role: "Chef d'atelier", department: "Production", location: "Bordeaux", email: "p.leroy@ateliersdefrance.com", phone: "+33 5 67 89 01 23", initials: "PL" },
  { id: 5, name: "Isabelle Moreau", role: "Responsable Qualité", department: "Qualité", location: "Lyon", email: "i.moreau@ateliersdefrance.com", phone: "+33 4 78 90 12 34", initials: "IM" },
  { id: 6, name: "François Petit", role: "Directeur Financier", department: "Finance", location: "Paris", email: "f.petit@ateliersdefrance.com", phone: "+33 1 45 67 89 01", initials: "FP" },
  { id: 7, name: "Camille Rousseau", role: "Chargée de communication", department: "Marketing", location: "Paris", email: "c.rousseau@ateliersdefrance.com", phone: "+33 1 56 78 90 12", initials: "CR" },
  { id: 8, name: "Thomas Girard", role: "Technicien maintenance", department: "Production", location: "Marseille", email: "t.girard@ateliersdefrance.com", phone: "+33 4 89 01 23 45", initials: "TG" },
];

const departments = ["Tous", "Direction", "Production", "Ressources Humaines", "Finance", "Qualité", "Marketing"];

const deptColors: Record<string, string> = {
  Direction: "#1a2744",
  Production: "#2563eb",
  "Ressources Humaines": "#7c3aed",
  Finance: "#b8922a",
  Qualité: "#059669",
  Marketing: "#dc2626",
};

export default async function AnnuairePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <TopBar title="Annuaire" userEmail={user?.email} />
      <div className="flex-1 p-6 space-y-5">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un collaborateur..."
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ "--tw-ring-color": "var(--adf-navy)" } as React.CSSProperties}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {departments.map((dept) => (
              <button
                key={dept}
                className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                style={{ color: "var(--adf-navy)" }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-gray-500">
          <span className="font-semibold" style={{ color: "var(--adf-navy)" }}>{mockEmployees.length}</span> collaborateurs
        </p>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mockEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: deptColors[emp.department] || "var(--adf-navy)" }}
                >
                  {emp.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate" style={{ color: "var(--adf-navy)" }}>{emp.name}</p>
                  <p className="text-xs text-gray-500 truncate">{emp.role}</p>
                </div>
              </div>

              {/* Badge dept */}
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-3"
                style={{
                  backgroundColor: `${deptColors[emp.department] || "var(--adf-navy)"}18`,
                  color: deptColors[emp.department] || "var(--adf-navy)",
                }}
              >
                {emp.department}
              </span>

              {/* Info */}
              <div className="space-y-1.5">
                <a
                  href={`mailto:${emp.email}`}
                  className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Mail size={12} className="flex-shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </a>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={12} className="flex-shrink-0" />
                  {emp.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} className="flex-shrink-0" />
                  {emp.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
