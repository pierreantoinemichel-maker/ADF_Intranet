"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Header({ userEmail }: { userEmail?: string }) {
  const router = useRouter();
  const supabase = createClient();
  const initials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "??";

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header style={{ backgroundColor: "var(--dark)", borderBottom: "1px solid rgba(168,137,74,.35)", height: "60px" }}
      className="flex items-center px-6 flex-shrink-0">

      {/* Logo */}
      <a href="/entreprises" className="flex items-center gap-3 no-underline flex-shrink-0">
        <div style={{ border: "1.5px solid var(--gold)", color: "var(--gold-l)", fontFamily: "var(--font-cormorant)", fontSize: "17px", width: "34px", height: "34px" }}
          className="flex items-center justify-center">
          AF
        </div>
        <div className="leading-tight">
          <div style={{ fontFamily: "var(--font-cormorant)", color: "#fff", fontSize: "15px", fontWeight: 500, letterSpacing: "1.5px" }}>
            Ateliers de France
          </div>
          <div style={{ fontSize: "9px", letterSpacing: "2.5px", color: "var(--mid)", textTransform: "uppercase" }}>
            La Haute Construction
          </div>
        </div>
      </a>

      {/* Right — flush to the right */}
      <div style={{ marginLeft: "auto" }} className="flex items-center gap-3">
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,.4)", fontFamily: "var(--font-dm-sans)" }}>
          {userEmail}
        </div>
        <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "var(--gold)", color: "var(--dark)", fontSize: "11px", fontWeight: 500 }}
          className="flex items-center justify-center flex-shrink-0">
          {initials}
        </div>
        <button onClick={handleSignOut}
          style={{ color: "var(--mid)", background: "none", border: "1px solid rgba(255,255,255,.1)", borderRadius: "5px", fontSize: "11px", cursor: "pointer", padding: "5px 10px", fontFamily: "var(--font-dm-sans)" }}>
          Déconnexion
        </button>
      </div>
    </header>
  );
}
