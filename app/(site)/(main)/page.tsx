import { createClient } from "@/lib/supabase/server";
import ProductGrid from "@/components/product-grid";
import Banner1 from "@/components/banner1";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: initialProducts } = await supabase
    .from("products")
    .select("*")
    .eq("feed", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div className="flex flex-col gap-4">
      <Banner1 />
      <ProductGrid initialProducts={initialProducts || []} />
    </div>
  );
}
