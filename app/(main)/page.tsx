import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import ProductGrid from "@/components/product-grid";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: initialProducts } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <div className="space-y-4">
      <div>
        <Link href={"/"} target="_blank">
          <div className="w-full aspect-2/1 md:aspect-3/1 from-violet-700 to-violet-600 bg-gradient-to-br rounded-4xl flex justify-center p-4 items-center">
            <p className="md:text-5xl text-2xl font-bold">
              قاب موبایل خودتو بساز!
            </p>
          </div>
        </Link>
      </div>
      <ProductGrid initialProducts={initialProducts || []} />
    </div>
  );
}
