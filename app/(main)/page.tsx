import { createClient } from "@/lib/supabase/server";
import PhonecaseCard from "@/components/phonecaseCard";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(4);

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
    </div>
  );
}
