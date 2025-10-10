import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"

export default async function OrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_name,
        product_price,
        quantity
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="ml-2 h-4 w-4" />
              بازگشت به داشبورد
            </Link>
          </Button>
        </div>

        <h1 className="mb-8 text-3xl font-bold">سفارشات من</h1>

        {!orders || orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">سفارشی ثبت نشده است</h2>
              <p className="mb-6 text-muted-foreground">هنوز سفارشی ثبت نکرده‌اید</p>
              <Button asChild>
                <Link href="/">شروع خرید</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <p className="mb-1 font-mono text-sm font-semibold">سفارش #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="mb-1 text-xl font-bold text-primary">
                        {new Intl.NumberFormat("fa-IR").format(order.total_amount)} تومان
                      </p>
                      <div className="flex gap-2">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            order.payment_status === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.payment_status === "paid" ? "پرداخت شده" : "در انتظار پرداخت"}
                        </span>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                            order.status === "processing"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {order.status === "processing"
                            ? "در حال پردازش"
                            : order.status === "delivered"
                              ? "تحویل داده شده"
                              : "در انتظار"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                    <h3 className="mb-2 text-sm font-semibold">اقلام سفارش:</h3>
                    {order.order_items?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.product_name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {new Intl.NumberFormat("fa-IR").format(item.product_price * item.quantity)} تومان
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t pt-4">
                    <h3 className="mb-2 text-sm font-semibold">آدرس ارسال:</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.shipping_city}, {order.shipping_address}
                    </p>
                    <p className="text-sm text-muted-foreground">کد پستی: {order.shipping_postal_code}</p>
                    <p className="text-sm text-muted-foreground">تلفن: {order.phone_number}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
