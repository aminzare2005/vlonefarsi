import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { redirect } from "next/navigation"

export default async function OrderSuccessPage({ searchParams }: { searchParams: { orderId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: order } = await supabase.from("orders").select("*").eq("id", searchParams.orderId).single()

  const formattedTotal = new Intl.NumberFormat("fa-IR").format(order?.total_amount || 0)

  return (
    <div className="min-h-screen">
      <Header />

      <main className="container py-8">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">سفارش شما با موفقیت ثبت شد!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">شماره سفارش:</span>
                    <span className="font-mono font-semibold">{order?.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">مبلغ پرداختی:</span>
                    <span className="font-semibold">{formattedTotal} تومان</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">وضعیت پرداخت:</span>
                    <span className="font-semibold text-green-600">پرداخت شده</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                سفارش شما با موفقیت ثبت شد و در حال پردازش است. اطلاعات بیشتر از طریق ایمیل برای شما ارسال خواهد شد.
              </p>

              <div className="flex gap-4">
                <Button asChild className="flex-1">
                  <Link href="/dashboard/orders">مشاهده سفارشات</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1 bg-transparent">
                  <Link href="/">بازگشت به فروشگاه</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
