import { createClient } from "@/lib/supabase/server";
import CollaborateursClient from "./CollaborateursClient";

export default async function CollaborateursPage() {
  const supabase = await createClient();

  const [{ data: collaborateurs }, { data: entreprises }] = await Promise.all([
    supabase.from("collaborateurs").select("*, entreprises(id, name, metier, color, initials)").order("last_name"),
    supabase.from("entreprises").select("id, name, metier").order("name"),
  ]);

  return <CollaborateursClient collaborateurs={collaborateurs ?? []} entreprises={entreprises ?? []} />;
}
