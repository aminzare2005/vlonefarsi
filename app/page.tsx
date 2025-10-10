import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold">قاب گوشی با طرح‌های منحصر به فرد</h2>
          <p className="text-muted-foreground">طرح مورد علاقه خود را انتخاب کنید و مدل گوشی‌تان را مشخص کنید</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              image_url={product.image_url}
              description={product.description}
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
  )
}
