import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/checkout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function CheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
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
        price
      )
    `
    )
    .eq("user_id", user.id);

  if (!cartItems || cartItems.length === 0) {
    redirect("/cart");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const total = cartItems.reduce((sum, item: any) => {
    return sum + item.phone_cases.price * item.quantity;
  }, 0);

  const formattedTotal = new Intl.NumberFormat("fa-IR").format(total);

  return (
    <main className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">تکمیل سفارش</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm profile={profile} total={total} />
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>خلاصه سفارش</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded">
                      <Image
                        src={item.products.image_url || "/placeholder.svg"}
                        alt={item.products.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">
                        {item.products.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.phone_cases.brand} {item.phone_cases.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} ×{" "}
                        {new Intl.NumberFormat("fa-IR").format(
                          item.phone_cases.price
                        )}{" "}
                        تومان
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">تعداد اقلام:</span>
                  <span className="font-semibold">
                    {cartItems.reduce(
                      (sum: number, item: any) => sum + item.quantity,
                      0
                    )}{" "}
                    عدد
                  </span>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-lg font-semibold">جمع کل:</span>
                  <span className="text-2xl font-bold text-primary">
                    {formattedTotal} تومان
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
