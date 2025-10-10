import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { AddToCartButton } from "@/components/add-to-cart-button"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function ProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: product } = await supabase.from("products").select("*").eq("id", params.id).single()

  if (!product) {
    notFound()
  }

  const formattedPrice = new Intl.NumberFormat("fa-IR").format(product.price)

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            بازگشت به فروشگاه
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2 text-sm text-muted-foreground">{product.category}</div>
              <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
              <p className="text-4xl font-bold text-primary">{formattedPrice} تومان</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">توضیحات محصول</h2>
              <p className="leading-relaxed text-muted-foreground">
                {product.description || "توضیحاتی برای این محصول ثبت نشده است."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">موجودی:</span>
              <span className={`font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} عدد` : "ناموجود"}
              </span>
            </div>

            {product.stock > 0 && <AddToCartButton productId={product.id} />}
          </div>
        </div>
      </main>
    </div>
  )
}
