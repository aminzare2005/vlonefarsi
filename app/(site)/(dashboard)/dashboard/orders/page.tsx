import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ShoppingBagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import PhonecaseCard from "@/components/phonecaseCard";
import EmptyCommon from "@/components/empty-common";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_name,
        product_id,
        product_price,
        quantity,
        phone_brand,
        phone_model,
        products (
          image_url
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const statusLabels: Record<string, string> = {
    pending: "در انتظار پرداخت",
    paid: "پرداخت شده",
    outofstock: "اتمام موجودی",
    processing: "در حال پردازش",
    ready: "آماده ارسال",
    delivered: "ارسال شد",
    returned: "مرجوع شده",
    canceled: "لغو شده",
    refunded: "بازپرداخت شده",
  };

  return (
    <>
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-2">
          <ArrowRight className="size-4" />
          بازگشت به داشبورد
        </Button>
      </Link>

      {!orders || orders.length === 0 ? (
        <EmptyCommon
          title="سفارشی پیدا نشد!"
          description="هنوز سفارشی ثبت نکردی. برو و اولین سفارشتو ثبت کن."
          button="شروع خرید"
          buttonIcon={<ShoppingBagIcon />}
        />
      ) : (
        <div className="space-y-4 md:space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden !p-2 !border-0">
              <CardContent className="p-4">
                {/* Header Section */}
                <div className="flex gap-4 flex-row items-start justify-between mb-4 md:mb-6">
                  <div className="flex flex-col">
                    <p className="text-xl font-bold text-primary">
                      {new Intl.NumberFormat("fa-IR").format(
                        order.total_amount
                      )}{" "}
                      تومان
                    </p>
                    <p className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Calendar size={12} />
                      {new Date(order.created_at).toLocaleDateString("fa-IR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                      <span></span>
                      <Clock size={12} />
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString(
                          "fa-IR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <p
                      dir="ltr"
                      className="text-xl uppercase font-semibold font-mono"
                    >
                      #{order?.track_id}
                    </p>
                    <span
                      className={cn(
                        "text-xs px-2 py-1 rounded-lg font-medium",
                        {
                          "bg-yellow-100 text-yellow-700":
                            order.status === "pending",
                          "bg-green-100 text-green-700":
                            order.status === "paid",
                          "bg-rose-100 text-rose-700":
                            order.status === "outofstock",
                          "bg-blue-100 text-blue-700":
                            order.status === "processing",
                          "bg-indigo-100 text-indigo-700":
                            order.status === "ready",
                          "bg-emerald-100 text-emerald-700":
                            order.status === "delivered",
                          "bg-orange-100 text-orange-700":
                            order.status === "returned",
                          "bg-gray-200 text-gray-700":
                            order.status === "canceled",
                          "bg-teal-100 text-teal-700":
                            order.status === "refunded",
                        }
                      )}
                    >
                      {statusLabels[order.status] ?? "نامشخص"}
                    </span>
                  </div>
                </div>

                {/* Order Items Section */}
                <div
                  dir="ltr"
                  className="grid grid-cols-1 md:grid-cols-3 gap-3"
                >
                  {order.order_items?.map((item: any) => (
                    <Link
                      href={`/products/${item.product_id}`}
                      key={item.id}
                      dir="ltr"
                      className="flex flex-col gap-2 items-center text-sm border rounded-xl p-4"
                    >
                      <div className="w-18 pointer-events-none">
                        <PhonecaseCard
                          image_url={item?.products?.image_url}
                          size="small"
                        />
                      </div>
                      <div className="flex h-full flex-col gap-1 justify-between items-start w-full">
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="font-medium">
                            {item.product_name}
                            <span className="text-muted-foreground">
                              {" "}
                              × {item.quantity}
                            </span>
                          </span>
                        </div>
                        {(item.phone_brand || item.phone_model) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.phone_model && (
                              <span className="text-xs text-muted-foreground">
                                {item.phone_model}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Shipping Address Section */}
                <div className="py-4">
                  <h3 className="text-sm font-semibold mb-3">جزئیات ارسال:</h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <span>{order.receiver_name}</span>
                      <span>{order.phone_number}</span>
                      <span>
                        {order.shipping_city} - {order.shipping_address}
                      </span>
                      <span>{order.shipping_postal_code}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/track/${order.track_id}`}
                  target="_blank"
                  className="w-full"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full gap-1 w-full text-sm"
                  >
                    پیگیری
                    <ArrowLeft className="size-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
