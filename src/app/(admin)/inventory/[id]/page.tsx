import { createClient } from "@/backend/db/server";
import { notFound } from "next/navigation";
import SiteDetailsForm from "../SiteDetailsForm";

export default async function EditSitePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // First, check if the ID passed is a UUID or a numeric ID.
  const isNumeric = /^\d+$/.test(params.id);
  
  let query = supabase.from("sites").select("*");
  if (isNumeric) {
    query = query.eq("id", parseInt(params.id));
  } else {
    query = query.eq("site_id", params.id);
  }
  
  const { data: site } = await query.single();

  if (!site) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <SiteDetailsForm site={site} />
    </div>
  );
}
