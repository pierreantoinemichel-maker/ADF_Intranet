import { createClient } from "@/lib/supabase/server";
import EntreprisesClient from "./EntreprisesClient";

export default async function EntreprisesPage() {
  const supabase = await createClient();

  const { data: entreprises } = await supabase
    .from("entreprises")
    .select(`
      *,
      entreprise_savoir_faire(
        savoir_faire(id, name)
      )
    `)
    .order("name");

  return <EntreprisesClient entreprises={entreprises ?? []} />;
}
