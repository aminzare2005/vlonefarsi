import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import { Package, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <h1 className="mb-8 text-3xl font-bold">داشبورد کاربری</h1>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نام کاربری</p>
                <p className="text-lg font-semibold">{profile?.display_name || "کاربر"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Package className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تعداد سفارشات</p>
                <p className="text-lg font-semibold">{orderCount || 0} سفارش</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <ShoppingBag className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ایمیل</p>
                <p className="text-sm font-semibold truncate">{user.email}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات حساب کاربری</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm profile={profile} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>آخرین سفارشات</CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard/orders">مشاهده همه</Link>
                </Button>
              </CardHeader>
              <CardContent>
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-mono text-sm font-semibold">{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold">
                            {new Intl.NumberFormat("fa-IR").format(order.total_amount)} تومان
                          </p>
                          <p
                            className={`text-xs ${
                              order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
                            }`}
                          >
                            {order.payment_status === "paid" ? "پرداخت شده" : "در انتظار پرداخت"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">سفارشی ثبت نشده است</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
