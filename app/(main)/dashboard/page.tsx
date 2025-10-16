import React from "react";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import {
  Package,
  ShoppingBag,
  User as UserIcon,
  CalendarDays,
  CreditCard,
  ChevronLeft,
  TrendingUp,
  Shield,
  BadgeCheck,
  Clock,
  Sparkles,
} from "lucide-react";

type Order = {
  id: string;
  created_at: string;
  total_amount: number | null;
  payment_status: "paid" | "pending" | string;
};

type Profile = {
  id: string;
  display_name?: string | null;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const formatPrice = (v: number | null | undefined): string =>
    new Intl.NumberFormat("fa-IR").format(v ?? 0) + " تومان";

  // Calculate total spent
  const totalSpent =
    recentOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) ||
    0;

  return (
    <main className="min-h-screen pb-4">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-violet-500/10 to-background h-80 -z-50" />
      <div className="container mx-auto max-w-7xl">
        {/* Quick Actions */}
        <div className="mb-4">
          <Card className="border-0 shadow-lg rounded-3xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="text-center md:text-start">
                  <h3 className="font-semibold text-lg mb-2">دسترسی سریع</h3>
                  <p className="text-sm text-foreground/80">
                    اقدامات پرکاربرد در دسترس شما
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    <Link href="/">
                      <ShoppingBag className="h-4 w-4" />
                      خرید محصولات
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full gap-2"
                  >
                    <Link target="_blank" href="https://t.me/vl9nefarsi">
                      <Shield className="h-4 w-4" />
                      پشتیبانی
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Grid - Improved with better visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <StatCard
            icon={<Package className="h-6 w-6" />}
            title={`${totalSpent} تومان`}
            value={`${orderCount?.toString() || "0"} سفارش`}
            gradient="from-pink-400 to-violet-400"
            url="/dashboard/orders"
          />

          <StatCard
            icon={<Clock className="h-6 w-6" />}
            title="آخرین سفارش"
            value={
              recentOrders && recentOrders[0]
                ? new Date(recentOrders[0].created_at).toLocaleDateString(
                    "fa-IR"
                  )
                : "—"
            }
            gradient="from-orange-400 to-red-400"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* User Profile Card - Enhanced */}
          <section className="lg:col-span-1 flex flex-col gap-4">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserIcon className="h-5 w-5" />
                  پروفایل کاربری
                </CardTitle>
                <CardDescription>اطلاعات شخصی و تنظیمات حساب</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 p-2 rounded-2xl shadow-sm border">
                  <div className="size-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {profile?.display_name || "بدون نام"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <LogoutButton />
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl h-11"
                  >
                    <Link href="/dashboard/me">
                      <UserIcon className="h-4 w-4" />
                      ویرایش
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl h-11"
                  >
                    <Link href="/dashboard/settings">
                      <Shield className="h-4 w-4" />
                      تنظیمات
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 text-yellow-400" />
                  کد تخفیف
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-center space-y-2 pb-4">
                  <div className="h-16 w-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="font-semibold">کد تخفیف نداری!</p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Orders - Enhanced */}
          <section className="lg:col-span-2">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShoppingBag className="h-5 w-5" />
                    سفارش‌ها
                  </CardTitle>
                </div>
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="rounded-full gap-1"
                >
                  <Link href="/dashboard/orders">
                    مشاهده همه
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>

              <CardContent>
                {recentOrders && recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <OrderItem
                        key={order.id}
                        order={order}
                        formatPrice={formatPrice}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">هنوز سفارشی ثبت نکرده‌اید</p>
                      <p className="text-sm text-muted-foreground">
                        اولین خرید خود را تجربه کنید
                      </p>
                    </div>
                    <Button asChild className="rounded-full mt-2">
                      <Link href="/products">مشاهده محصولات</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}

/* ----- Enhanced Stat Card ----- */
function StatCard({
  icon,
  title,
  value,
  url,
  gradient = "from-blue-500 to-blue-600",
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  url?: string;
  gradient?: string;
}) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      <CardContent className="px-6">
        <Link
          href={url || ""}
          className="flex flex-col gap-4 items-center justify-center"
        >
          <div
            className={`h-12 w-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-md`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

/* ----- Enhanced Order Item ----- */
function OrderItem({
  order,
  formatPrice,
}: {
  order: Order;
  formatPrice: (v: number | null | undefined) => string;
}) {
  const date = new Date(order.created_at).toLocaleDateString("fa-IR");
  const time = new Date(order.created_at).toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border bg-card hover:bg-background/20 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm ${
            order.payment_status === "paid"
              ? "bg-green-100 text-green-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {order.payment_status === "paid" ? (
            <BadgeCheck className="h-5 w-5" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <p className="font-mono text-sm font-semibold bg-zinc-800 px-2 py-1 rounded-lg">
              #{order.id.slice(0, 8).toUpperCase()}
            </p>
            <span
              className={`text-xs px-2 py-1 rounded-lg ${
                order.payment_status === "paid"
                  ? "bg-green-100 text-green-600"
                  : "bg-yellow-100 text-yellow-600"
              }`}
            >
              {order.payment_status === "paid"
                ? "پرداخت شده"
                : "در انتظار پرداخت"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{date}</span>
            <span>-</span>
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="text-left ml-4">
        <p className="font-bold text-lg">{formatPrice(order.total_amount)}</p>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full gap-1 mt-1 text-xs"
        >
          <Link href={`/dashboard/orders/${order.id}`}>
            جزییات
            <ChevronLeft className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
