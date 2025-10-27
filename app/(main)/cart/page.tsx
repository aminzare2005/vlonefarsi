import { createClient } from "@/lib/supabase/server";
import { CartItem } from "@/components/cart-item";
import { CheckoutForm } from "@/components/checkout-form";
import { redirect } from "next/navigation";

export default async function CartCheckoutPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // 🧺 آیتم‌های سبد خرید
  const { data: cartItems } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      products ( id, name, image_url ),
      phone_cases ( id, brand, model, price, available )
    `
    )
    .eq("user_id", user.id);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="py-8 max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">🛒🥀</div>
        <p className="text-lg text-muted-foreground mb-2">سبد خرید خالیه</p>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: settings } = await supabase
    .from("settings")
    .select("post_price")
    .single();

  const postPrice = settings?.post_price;

  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.phone_cases.price * item.quantity,
    0
  );
  const total = subtotal + postPrice;

  const formattedSubtotal = new Intl.NumberFormat("fa-IR").format(subtotal);
  const formattedPostPrice = new Intl.NumberFormat("fa-IR").format(postPrice);
  const formattedTotal = new Intl.NumberFormat("fa-IR").format(total);

  return (
    <div className="max-w-xl mx-auto space-y-12">
      <div className="flex flex-col gap-4 items-center w-full">
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

        <div className="flex flex-col w-full gap-1 pt-2 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">جمع خرید:</p>
            <p className="font-medium">{formattedSubtotal} تومان</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">هزینه ارسال:</p>
            <p className="font-medium">{formattedPostPrice} تومان</p>
          </div>
          <div className="flex justify-between items-center border-t pt-2 mt-1">
            <p className="font-semibold text-lg">مجموع نهایی:</p>
            <p className="text-xl font-bold">{formattedTotal} تومان</p>
          </div>
        </div>
      </div>

      <div className="from-violet-800/30 to-blue-800/30 bg-gradient-to-br px-4 py-6 rounded-2xl md:mb-0 mb-16">
        <h1 className="text-3xl text-center font-bold mb-4">
          سفارشت رو کجا بفرستیم؟
        </h1>
        <CheckoutForm profile={profile} total={total} />
      </div>
    </div>
  );
}
