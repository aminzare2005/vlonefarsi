import { createClient } from "@/lib/supabase/server";
import PhonecaseCard from "@/components/phonecaseCard";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-dvh">
      <main className="">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products?.map((product) => (
            <PhonecaseCard
              key={product.id}
              href={`/phonecase/${product.id}`}
              image_url={product.image_url}
              name={product.name}
              size="big"
            />
          ))}
        </div>

        {(!products || products.length === 0) && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">محصولی یافت نشد</p>
          </div>
        )}
      </main>
    </div>
  );
}
