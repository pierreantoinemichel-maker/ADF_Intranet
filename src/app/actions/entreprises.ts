"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createEntreprise(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const metier = formData.get("metier") as string;
  const zone = formData.get("zone") as string;
  const region = formData.get("region") as string;
  const description = formData.get("description") as string;
  const address = formData.get("address") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const website = formData.get("website") as string;

  // Couleur par défaut selon le métier
  const metierColors: Record<string, string> = {
    "Pierre & Maçonnerie": "#3A5C4A",
    "Peinture & Décors": "#6B4F2A",
    "Métal": "#2A3F6B",
    "Bois": "#5C4A2A",
    "Décors": "#5C3A5C",
    "Lots techniques": "#2A2A4A",
  };

  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const { error } = await supabase.from("entreprises").insert({
    name,
    metier,
    zone,
    region,
    description,
    address,
    email,
    phone,
    website,
    initials,
    slug,
    color: metierColors[metier] ?? "#A8894A",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/entreprises");
}

export async function archiveEntreprise(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entreprises")
    .update({ archived: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/entreprises");
}

export async function restoreEntreprise(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("entreprises")
    .update({ archived: false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/entreprises");
}
