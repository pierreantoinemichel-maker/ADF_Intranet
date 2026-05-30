import { createClient } from "@/lib/supabase/server";
import EntreprisesClient from "./EntreprisesClient";
import { createEntreprise, archiveEntreprise, restoreEntreprise } from "@/app/actions/entreprises";

export default async function EntreprisesPage() {
  const supabase = await createClient();

  const { data: entreprises } = await supabase
    .from("entreprises")
    .select(`*, entreprise_savoir_faire(savoir_faire(id, name))`)
    .order("name");

  return (
    <EntreprisesClient
      entreprises={entreprises ?? []}
      createEntreprise={createEntreprise}
      archiveEntreprise={archiveEntreprise}
      restoreEntreprise={restoreEntreprise}
    />
  );
}
