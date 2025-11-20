import CustomPhoneCasePageClient from "@/features/custom/custom-phonecase-page-client";
import { createClient } from "@/lib/supabase/server";

export default async function ProductPage() {
  const supabase = await createClient();
  const { data: phoneCases } = await supabase
    .from("phone_cases")
    .select("*")
    .order("brand")
    .order("model");

  return <CustomPhoneCasePageClient phoneCases={phoneCases || []} />;
}
