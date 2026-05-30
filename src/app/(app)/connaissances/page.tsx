import { createClient } from "@/lib/supabase/server";
import ConnaissancesClient from "./ConnaissancesClient";

export default async function ConnaissancesPage() {
  const supabase = await createClient();

  const { data: fiches } = await supabase
    .from("knowledge_base")
    .select(`*, entreprises(id, name, color, initials), kb_savoir_faire(savoir_faire(id, name))`)
    .order("created_at", { ascending: false });

  return <ConnaissancesClient fiches={fiches ?? []} />;
}
