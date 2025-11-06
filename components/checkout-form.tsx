"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "./ui/textarea";
import { z } from "zod";

interface CheckoutFormProps {
  profile: any;
  total: number;
}

// Schema تعریف شده با Zod
const checkoutSchema = z.object({
  displayName: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد")
    .regex(/^[\u0600-\u06FF\s]+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),

  phoneNumber: z
    .string()
    .min(1, "شماره تماس الزامی است")
    .transform((val) => val.replace(/\s/g, ""))
    .refine((val) => /^09\d{9}$/.test(val), {
      message: "شماره تماس باید با 09 شروع شود و 11 رقم باشد",
    }),

  city: z
    .string()
    .min(2, "نام شهر باید حداقل ۲ کاراکتر باشد")
    .regex(/^[\u0600-\u06FF\s]+$/, "لطفاً فقط از حروف فارسی استفاده کنید"),

  address: z.string().min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد"),

  postalCode: z
    .string()
    .length(10, "کد پستی باید دقیقاً ۱۰ رقم باشد")
    .regex(/^\d+$/, "کد پستی باید فقط شامل اعداد باشد"),

  telegram: z.string().min(5, "یوزرنیم باید حداقل 5 کاراکتر باشه").optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CheckoutForm({ profile, total }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof CheckoutFormData, boolean>>
  >({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    displayName: profile?.display_name || "",
    phoneNumber: profile?.phone_number || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postalCode: profile?.postal_code || "",
    telegram: profile?.telegram || "",
  });

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  // بررسی اعتبارسنجی کل فرم
  useEffect(() => {
    const validateForm = async () => {
      try {
        checkoutSchema.parse({
          ...formData,
          phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
        });
        setIsFormValid(true);
      } catch (error) {
        setIsFormValid(false);
      }
    };

    validateForm();
  }, [formData]);

  // تابع برای اعتبارسنجی فیلدها
  const validateField = (field: keyof CheckoutFormData, value: string) => {
    try {
      if (field === "phoneNumber") {
        const cleanedValue = value.replace(/\s/g, "");
        checkoutSchema.pick({ [field]: true }).parse({ [field]: cleanedValue });
      } else {
        checkoutSchema.pick({ [field]: true }).parse({ [field]: value });
      }
      setErrors((prev) => ({ ...prev, [field]: undefined }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [field]: error.issues[0]?.message,
        }));
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // اعتبارسنجی نهایی قبل از ارسال
    if (!isFormValid) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً تمام فیلدها را به درستی پر کنید",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const validatedData = checkoutSchema.parse({
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // بقیه کدهای موجود...
      const { data: cartItems } = await supabase
        .from("cart_items")
        .select(
          `
          quantity,
          products (
            id,
            name
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
        throw new Error("Cart is empty");
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: total,
          status: "pending",
          receiver_name: validatedData.displayName,
          shipping_address: validatedData.address,
          shipping_city: validatedData.city,
          shipping_postal_code: validatedData.postalCode,
          phone_number: validatedData.phoneNumber,
          telegram: validatedData.telegram,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.products.id,
        product_name: item.products.name,
        product_price: item.phone_cases.price,
        quantity: item.quantity,
        phone_case_id: item.phone_cases.id,
        phone_brand: item.phone_cases.brand,
        phone_model: item.phone_cases.model,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update profile with shipping info
      await supabase
        .from("profiles")
        .update({
          display_name: validatedData.displayName,
          phone_number: validatedData.phoneNumber,
          address: validatedData.address,
          city: validatedData.city,
          postal_code: validatedData.postalCode,
          telegram: validatedData.telegram,
        })
        .eq("id", user.id);

      // Initialize Zibal payment
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: total,
        }),
      });

      const paymentData = await response.json();

      if (paymentData.success && paymentData.trackId) {
        // Update order with payment reference
        await supabase
          .from("orders")
          .update({ payment_reference: paymentData.trackId })
          .eq("id", order.id);

        // Redirect to Zibal payment gateway
        window.location.href = `https://gateway.zibal.ir/start/${paymentData.trackId}`;
      } else {
        throw new Error("Payment initialization failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof CheckoutFormData] = err.message;
          }
        });
        setErrors(fieldErrors);

        toast({
          title: "خطا در فرم",
          description: "لطفاً اطلاعات فرم را بررسی کنید",
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا",
          description:
            error instanceof Error
              ? error.message
              : "مشکلی در ثبت سفارش پیش آمد. لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }
  };

  // تابع برای فرمت خودکار شماره تلفن
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);

    if (limited.length <= 4) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 4)} ${limited.slice(4)}`;
    } else {
      return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(
        7
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phoneNumber: formatted });
    validateField("phoneNumber", formatted);
  };

  const handleFieldChange =
    (field: keyof CheckoutFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // اعتبارسنجی بلادرنگ فقط اگر فیلد قبلاً لمس شده
      if (touched[field]) {
        validateField(field, value);
      }
    };

  const handleFieldBlur =
    (field: keyof CheckoutFormData) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, e.target.value);
    };

  // بررسی اینکه آیا همه فیلدها پر شده‌اند
  const isFormComplete = Object.values(formData).every(
    (value) => value.trim().length > 0
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {/* فیلد نام */}
        <div className="grid gap-2">
          <Label htmlFor="displayName">نام و نام خانوادگی</Label>
          <Input
            id="displayName"
            required
            dir="auto"
            value={formData.displayName}
            onChange={handleFieldChange("displayName")}
            onBlur={handleFieldBlur("displayName")}
            className={errors.displayName ? "border-destructive" : ""}
          />
          {errors.displayName && (
            <p className="text-sm text-destructive">{errors.displayName}</p>
          )}
        </div>

        {/* فیلد شماره تماس */}
        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">شماره تماس</Label>
          <Input
            id="phoneNumber"
            type="tel"
            required
            dir="ltr"
            placeholder="0912 345 6789"
            maxLength={13}
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            onBlur={handleFieldBlur("phoneNumber")}
            className={errors.phoneNumber ? "border-destructive" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber}</p>
          )}
        </div>

        {/* فیلد شهر */}
        <div className="grid gap-2">
          <Label htmlFor="city">شهر</Label>
          <Input
            id="city"
            required
            dir="auto"
            value={formData.city}
            onChange={handleFieldChange("city")}
            onBlur={handleFieldBlur("city")}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city}</p>
          )}
        </div>

        {/* فیلد آدرس */}
        <div className="grid gap-2">
          <Label htmlFor="address">آدرس کامل</Label>
          <Textarea
            id="address"
            required
            dir="auto"
            className={`min-h-[100px] resize-none ${
              errors.address ? "border-destructive" : ""
            }`}
            value={formData.address}
            onChange={handleFieldChange("address")}
            onBlur={handleFieldBlur("address")}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>

        {/* فیلد کد پستی */}
        <div className="grid gap-2">
          <Label htmlFor="postalCode">کد پستی</Label>
          <Input
            id="postalCode"
            required
            dir="ltr"
            placeholder="1234567890"
            maxLength={10}
            value={formData.postalCode}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, "");
              const limited = numbers.slice(0, 10);
              setFormData({ ...formData, postalCode: limited });
              if (touched.postalCode) {
                validateField("postalCode", limited);
              }
            }}
            onBlur={handleFieldBlur("postalCode")}
            className={errors.postalCode ? "border-destructive" : ""}
          />
          {errors.postalCode && (
            <p className="text-sm text-destructive">{errors.postalCode}</p>
          )}
        </div>

        {/* فیلد تلگرام */}
        <div className="grid gap-2">
          <Label htmlFor="city">تلگرام</Label>
          <Input
            id="telegram"
            dir="ltr"
            value={formData.telegram}
            onChange={handleFieldChange("telegram")}
            onBlur={handleFieldBlur("telegram")}
            className={errors.telegram ? "border-destructive" : ""}
          />
          {errors.telegram && (
            <p className="text-sm text-destructive">{errors.telegram}</p>
          )}
        </div>
      </div>

      <div className="fixed md:static bottom-3 right-3 left-3 z-50 p-4 md:p-0 md:mt-4 backdrop-blur-sm bg-background/50 md:bg-transparent border border-input md:border-0 rounded-xl">
        <Button
          type="submit"
          className="w-full cursor-pointer"
          size="lg"
          disabled={isLoading || !isFormValid || !isFormComplete}
        >
          {isLoading ? "در حال پردازش..." : "پرداخت و ثبت نهایی سفارش"}
        </Button>
      </div>
    </form>
  );
}
