import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { PhoneCaseSelector } from "@/components/phone-case-selector"
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

  const { data: phoneCases } = await supabase.from("phone_cases").select("*").order("brand").order("model")

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
              <h1 className="mb-4 text-3xl font-bold">{product.name}</h1>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">توضیحات محصول</h2>
              <p className="leading-relaxed text-muted-foreground">
                {product.description || "توضیحاتی برای این محصول ثبت نشده است."}
              </p>
            </div>

            <PhoneCaseSelector productId={product.id} phoneCases={phoneCases || []} />
          </div>
        </div>
      </main>
    </div>
  )
}
