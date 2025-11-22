import { createClient } from "@/lib/supabase/server";
import { CartItem } from "@/components/cart-item";
import { CheckoutForm } from "@/components/checkout-form";
import { redirect } from "next/navigation";
import EmptyCommon from "@/components/empty-common";
import { ArrowLeftIcon } from "lucide-react";

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
      <EmptyCommon
        title="سبد خرید شما خالی است"
        description="یه محصول جدید انتخاب کن و به سبدت اضافه کن"
        button="بازگشت به صفحه اصلی"
        buttonIcon={<ArrowLeftIcon />}
      />
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
    <div className="max-w-xl mx-auto flex flex-col items-center gap-8 pb-36">
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
      </div>

      <div className="from-violet-800/30 to-blue-800/30 bg-gradient-to-br px-4 py-6 rounded-2xl w-full">
        <h1 className="text-3xl text-center font-bold mb-4">
          سفارشت رو کجا بفرستیم؟
        </h1>
        <CheckoutForm profile={profile} total={total} />
      </div>

      <div className="fixed max-w-2xl mx-auto w-full bottom-0 right-0 left-0 z-50 p-2">
        <div className="p-4 backdrop-blur-sm bg-background/50 border border-input rounded-xl">
          <div className="flex flex-col w-full gap-1">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">جمع خرید:</p>
              <p className="font-medium">{formattedSubtotal} تومان</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                هزینه ارسال (با پست):
              </p>
              <p className="font-medium">{formattedPostPrice} تومان</p>
            </div>
            <div className="flex justify-between items-center border-t pt-2 mt-1">
              <p className="font-semibold text-lg">مجموع نهایی:</p>
              <p className="text-2xl font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {formattedTotal} تومان
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
