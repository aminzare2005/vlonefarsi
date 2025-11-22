import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/product-grid";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: initialProducts } = await supabase
    .from("products")
    .select("*")
    .eq("feed", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return <ProductGrid initialProducts={initialProducts || []} />;
}
