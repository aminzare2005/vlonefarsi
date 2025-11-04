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
import {
  Package,
  ShoppingBag,
  CalendarDays,
  ChevronLeft,
  Shield,
  BadgeCheck,
  Clock,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import EmptyCommon from "@/components/empty-common";

type Order = {
  id: string;
  created_at: string;
  total_amount: number | null;
  payment_status: "paid" | "pending" | string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const formatPrice = (v: number | null | undefined): string =>
    new Intl.NumberFormat("fa-IR").format(v ?? 0) + " تومان";

  // Calculate total spent
  const totalSpent =
    recentOrders?.reduce((sum, order) => sum + (order.total_amount || 0), 0) ||
    0;

  return (
    <>
      {/* <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-violet-500/10 to-background h-80 -z-50" /> */}
      <div>
        {/* Stats Grid - Improved with better visuals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <StatCard
            icon={<Clock className="h-6 w-6" />}
            title="مجموع سفارشات"
            value={totalSpent !== 0 ? formatPrice(totalSpent) : "—"}
            gradient="from-orange-400 to-red-400"
          />

          <StatCard
            icon={<Package className="h-6 w-6" />}
            title="آخرین بازدید"
            value={new Date(user?.last_sign_in_at || Date.now()).toLocaleString(
              "fa-IR"
            )}
            gradient="from-pink-400 to-violet-400"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Recent Orders - Enhanced */}
          <section>
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
                    {recentOrders.slice(0, 2).map((order) => (
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
          {/* User Profile Card - Enhanced */}
          <section className="flex flex-col gap-4">
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="size-5 fill-yellow-400 text-yellow-400" />
                  کد تخفیف
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <EmptyCommon title="کد تخفیفی نداری!" icon={<Sparkles />} />
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
}

/* ----- Enhanced Stat Card ----- */
function StatCard({
  icon,
  title,
  value,
  gradient = "from-blue-500 to-blue-600",
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  gradient?: string;
}) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
      <CardContent className="px-6">
        <div className="flex flex-col gap-4 items-center justify-center">
          <div
            className={`h-12 w-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center shadow-md`}
          >
            <div className="text-white">{icon}</div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
          </div>
        </div>
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
