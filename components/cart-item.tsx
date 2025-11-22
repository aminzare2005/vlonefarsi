"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import PhonecaseCard from "./phonecaseCard";

interface CartItemProps {
  id: string;
  productId: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  phoneBrand: string;
  phoneModel: string;
  available: boolean;
}

export function CartItem({
  id,
  productId,
  name,
  price,
  image_url,
  quantity,
  phoneBrand,
  phoneModel,
  available,
}: CartItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const formattedPrice = new Intl.NumberFormat("fa-IR").format(price);
  const formattedTotal = new Intl.NumberFormat("fa-IR").format(
    price * quantity
  );

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", id);
      if (error) throw error;
      router.refresh();
    } catch {
      toast({
        title: "خطا",
        description: "مشکلی در به‌روزرسانی سبد خرید پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "محصول حذف شد",
        description: "محصول از سبد خرید حذف شد",
      });
      router.refresh();
    } catch {
      toast({
        title: "خطا",
        description: "مشکلی در حذف محصول پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-card/40 border p-4 border-stone-800/70 rounded-2xl overflow-hidden transition-all hover:border-stone-700 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.08)]">
      <div
        dir="ltr"
        className="grid grid-cols-5 justify-between h-full items-center gap-4"
      >
        {/* تصویر محصول */}
        <div className="col-span-1 w-full flex items-center justify-center">
          <div className="w-20 h-auto">
            <PhonecaseCard
              size="small"
              image_url={image_url}
              href={`/products/${productId}`}
            />
          </div>
        </div>
        {/* توضیحات */}
        <div className="flex col-span-3 flex-col w-full h-full justify-between gap-1">
          <div>
            <h2 className="text-2xl font-semibold text-white/90 leading-tight">
              {name}
            </h2>
            <p className="text-lg text-muted-foreground">{phoneModel}</p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-xl font-medium text-white/80">
              {formattedPrice} تومان
            </p>
            {!available && (
              <span className="text-xs text-red-500">(ناموجود)</span>
            )}
          </div>
        </div>

        {/* کنترل‌ها */}
        <div className="flex w-full flex-col col-span-1 items-end justify-between gap-2">
          <div className="flex items-center flex-col gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-white/70 hover:text-white"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={isLoading || !available}
            >
              <Plus className="size-4" />
            </Button>

            <span className="text-sm font-semibold text-white">{quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-white/70 hover:text-white"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={isLoading || quantity <= 1}
            >
              <Minus className="size-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-400 size-8"
            onClick={removeItem}
            disabled={isLoading}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
