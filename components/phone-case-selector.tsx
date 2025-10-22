"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { TomanIcon } from "./toman.icon";
import { cn } from "@/lib/utils";

type PhoneCase = {
  id: string;
  brand: string;
  model: string;
  price: number;
  available: boolean;
};

type PhoneCaseSelectorProps = {
  productId: string;
  phoneCases: PhoneCase[];
};

export function PhoneCaseSelector({
  productId,
  phoneCases,
}: PhoneCaseSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedPhoneCaseId, setSelectedPhoneCaseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // Group phone cases by brand
  const groupedPhoneCases = phoneCases.reduce((acc, phoneCase) => {
    if (!acc[phoneCase.brand]) acc[phoneCase.brand] = [];
    acc[phoneCase.brand].push(phoneCase);
    return acc;
  }, {} as Record<string, PhoneCase[]>);

  const brands = Object.keys(groupedPhoneCases).sort();
  const brandPhoneCases = selectedBrand
    ? groupedPhoneCases[selectedBrand] || []
    : [];

  const selectedPhoneCase = phoneCases.find(
    (pc) => pc.id === selectedPhoneCaseId
  );

  // ✅ در mount، سعی می‌کنیم انتخاب قبلی کاربر رو از localStorage بخونیم
  useEffect(() => {
    const savedBrand = localStorage.getItem("selectedBrand");
    const savedModelId = localStorage.getItem("selectedPhoneCaseId");

    if (savedBrand && groupedPhoneCases[savedBrand]) {
      setSelectedBrand(savedBrand);
      // بررسی می‌کنیم که مدل ذخیره‌شده هنوز توی این برند وجود داره
      const stillExists = groupedPhoneCases[savedBrand].some(
        (pc) => pc.id === savedModelId
      );
      if (savedModelId && stillExists) {
        setSelectedPhoneCaseId(savedModelId);
      }
    }
  }, [phoneCases]); // وقتی لیست کیس‌ها لود شد

  // ✅ ذخیره‌ی خودکار در localStorage وقتی انتخاب عوض می‌شود
  useEffect(() => {
    if (selectedBrand) {
      localStorage.setItem("selectedBrand", selectedBrand);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedPhoneCaseId) {
      localStorage.setItem("selectedPhoneCaseId", selectedPhoneCaseId);
    }
  }, [selectedPhoneCaseId]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedPhoneCaseId("");
  };

  const handleAddToCart = async () => {
    if (!selectedBrand || !selectedPhoneCaseId) {
      toast({
        title: "خطا",
        description: "لطفا برند و مدل گوشی خود را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("phone_case_id", selectedPhoneCaseId)
        .single();

      if (existingItem) {
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          phone_case_id: selectedPhoneCaseId,
          quantity: 1,
        });
        if (error) throw error;
      }

      router.push("/cart");
      toast({
        title: "موفق",
        description: "محصول به سبد خرید اضافه شد",
      });

      router.refresh();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "خطا",
        description: "مشکلی در افزودن به سبد خرید پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        <div className="flex md:flex-row flex-col items-center justify-center gap-2 w-full">
          {/* Brand Selection */}
          <div className="space-y-2 w-full">
            <Select value={selectedBrand} onValueChange={handleBrandChange}>
              <SelectTrigger id="brand-select">
                <SelectValue placeholder="برند گوشیت رو انتخاب کن" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model Selection */}
          <div className="space-y-2 w-full">
            <Select
              disabled={!selectedBrand}
              value={selectedPhoneCaseId}
              onValueChange={setSelectedPhoneCaseId}
            >
              <SelectTrigger id="model-select">
                <SelectValue placeholder="مدل گوشیت رو انتخاب کن" />
              </SelectTrigger>
              <SelectContent>
                {brandPhoneCases.map((phoneCase) => (
                  <SelectItem
                    key={phoneCase.id}
                    value={phoneCase.id}
                    disabled={!phoneCase.available}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span
                        className={cn(!phoneCase.available && "line-through")}
                      >
                        {phoneCase.model}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="fixed md:static bottom-3 right-3 left-3 p-4 backdrop-blur-sm bg-background/50 md:bg-card border rounded-xl">
        {/* Price Section */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">قیمت:</span>
            <span className="text-2xl font-bold text-primary min-h-8">
              {selectedPhoneCase ? (
                <div className="gap-1 inline-flex items-center">
                  {new Intl.NumberFormat("fa-IR").format(
                    selectedPhoneCase.price
                  )}
                  <TomanIcon className="size-4" />
                </div>
              ) : (
                ""
              )}
            </span>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!selectedBrand || !selectedPhoneCaseId || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              در حال افزودن...
            </>
          ) : (
            "افزودن به سبد خرید"
          )}
        </Button>
      </div>
    </div>
  );
}
