import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ShoppingBag } from "lucide-react"

export default async function CartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      products (
        id,
        name,
        image_url
      ),
      phone_cases (
        id,
        brand,
        model,
        price,
        available
      )
    `,
    )
    .eq("user_id", user.id)

  const total =
    cartItems?.reduce((sum, item: any) => {
      return sum + item.phone_cases.price * item.quantity
    }, 0) || 0

  const formattedTotal = new Intl.NumberFormat("fa-IR").format(total)

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">سبد خرید</h1>

        {!cartItems || cartItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ShoppingBag className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">سبد خرید شما خالی است</h2>
              <p className="mb-6 text-muted-foreground">محصولی به سبد خرید اضافه نکرده‌اید</p>
              <Button asChild>
                <Link href="/">بازگشت به فروشگاه</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="flex flex-col gap-4">
                {cartItems.map((item: any) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    productId={item.products.id}
                    name={item.products.name}
                    price={item.phone_cases.price}
                    image_url={item.products.image_url}
                    quantity={item.quantity}
                    phoneBrand={item.phone_cases.brand}
                    phoneModel={item.phone_cases.model}
                    available={item.phone_cases.available}
                  />
                ))}
              </div>
            </div>

            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>خلاصه سفارش</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">تعداد اقلام:</span>
                    <span className="font-semibold">
                      {cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0)} عدد
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                    <span className="text-lg font-semibold">جمع کل:</span>
                    <span className="text-2xl font-bold text-primary">{formattedTotal} تومان</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">ادامه و پرداخت</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
