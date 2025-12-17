"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CartItem } from "@/components/cart-item";
import { CheckoutForm } from "@/components/checkout-form";
import EmptyCommon from "@/components/empty-common";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CartCheckoutPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [postPrice, setPostPrice] = useState<number>(0);

  const [discount, setDiscount] = useState<{
    discountAmount: number;
    freeShipping: boolean;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);

      const [{ data: cart }, { data: profile }, { data: settings }] =
        await Promise.all([
          supabase
            .from("cart_items")
            .select(
              `
              id,
              quantity,
              products ( id, name, image_url ),
              phone_cases ( id, brand, model, price, available )
            `
            )
            .eq("user_id", user.id),

          supabase.from("profiles").select("*").eq("id", user.id).single(),

          supabase.from("settings").select("post_price").single(),
        ]);

      setCartItems(cart || []);
      setProfile(profile);
      setPostPrice(settings?.post_price || 0);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return null;

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

  // -----------------------------
  // Price calculations
  // -----------------------------
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.phone_cases.price * item.quantity,
    0
  );

  const shippingPrice = discount?.freeShipping ? 0 : postPrice;
  const discountAmount = discount?.discountAmount ?? 0;

  const finalTotal = Math.max(subtotal + shippingPrice - discountAmount, 0);

  const format = (n: number) => new Intl.NumberFormat("fa-IR").format(n);

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center gap-8 pb-44">
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
        <CheckoutForm
          profile={profile}
          total={subtotal + shippingPrice}
          onDiscountChange={setDiscount}
        />
      </div>

      {/* Sticky summary */}
      <div className="fixed max-w-2xl mx-auto w-full bottom-0 right-0 left-0 z-50 p-2">
        <div className="p-4 backdrop-blur-sm bg-background/50 border border-input rounded-xl">
          <div className="flex flex-col w-full gap-1">
            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">جمع خرید:</p>
              <p>{format(subtotal)} تومان</p>
            </div>

            <div className="flex justify-between">
              <p className="text-sm text-muted-foreground">هزینه ارسال:</p>
              <p className={cn(shippingPrice === 0 && "text-green-400")}>
                {shippingPrice === 0
                  ? "رایگان"
                  : `${format(shippingPrice)} تومان`}
              </p>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-400">
                <p className="text-sm">تخفیف:</p>
                <p>{format(discountAmount)} تومان</p>
              </div>
            )}

            <div className="flex justify-between border-t pt-2 mt-1">
              <p className="font-semibold text-lg">مجموع نهایی:</p>
              <p className="text-2xl font-bold">{format(finalTotal)} تومان</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
