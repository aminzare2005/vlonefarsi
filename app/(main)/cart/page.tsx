import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CartItem } from "@/components/cart-item";

export default async function CartPage() {
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
        price,
        available
      )
    `
    )
    .eq("user_id", user.id);

  const total =
    cartItems?.reduce((sum, item: any) => {
      return sum + item.phone_cases.price * item.quantity;
    }, 0) || 0;

  const formattedTotal = new Intl.NumberFormat("fa-IR").format(total);

  return (
    <div className="py-8">
      {!cartItems || cartItems.length === 0 ? (
        <div className="flex justify-center flex-col items-center py-12">
          <div className="text-6xl mb-4">🛒🥀</div>
          <p className="text-lg text-muted-foreground mb-2">سبد خرید خالیه</p>
        </div>
      ) : (
        <div className="space-y-4">
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

          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <p className="font-semibold text-lg">
              مجموع:{" "}
              {cartItems.reduce(
                (sum: number, item: any) => sum + item.quantity,
                0
              )}{" "}
              عدد
            </p>
            <p className="text-xl font-bold">{formattedTotal} تومان</p>
          </div>

          <Link href={"/checkout"}>
            <Button
              className="w-full bg-white text-black font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              size={"lg"}
            >
              ادامه خرید و پرداخت
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
