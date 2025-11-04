"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "./ui/textarea";
import { z } from "zod";

interface ProfileFormProps {
  profile: any;
}

// Schema تعریف شده با Zod (همان فرم چک‌اوت)
const profileSchema = z.object({
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
    .length(10, "کد پستی باید ۱۰ رقمی باشد")
    .regex(/^\d+$/, "کد پستی باید فقط شامل اعداد باشد"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProfileFormData, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof ProfileFormData, boolean>>
  >({});
  const [isFormValid, setIsFormValid] = useState(false);

  const [formData, setFormData] = useState({
    displayName: profile?.display_name || "",
    phoneNumber: profile?.phone_number || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postalCode: profile?.postal_code || "",
  });

  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const validateForm = async () => {
      try {
        profileSchema.parse({
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

  const validateField = (field: keyof ProfileFormData, value: string) => {
    try {
      if (field === "phoneNumber") {
        const cleanedValue = value.replace(/\s/g, "");
        profileSchema.pick({ [field]: true }).parse({ [field]: cleanedValue });
      } else {
        profileSchema.pick({ [field]: true }).parse({ [field]: value });
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
      const validatedData = profileSchema.parse({
        ...formData,
        phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: validatedData.displayName,
          phone_number: validatedData.phoneNumber,
          address: validatedData.address,
          city: validatedData.city,
          postal_code: validatedData.postalCode,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "اطلاعات شما با موفقیت ذخیره شد",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Profile update error:", error);

      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof ProfileFormData, string>> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof ProfileFormData] = err.message;
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
          title: "مشکلی در به‌روزرسانی اطلاعات پیش آمد",
          description:
            error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
    (field: keyof ProfileFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));

      // اعتبارسنجی بلادرنگ فقط اگر فیلد قبلاً لمس شده
      if (touched[field]) {
        validateField(field, value);
      }
    };

  const handleFieldBlur =
    (field: keyof ProfileFormData) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      validateField(field, e.target.value);
    };

  // بررسی اینکه آیا همه فیلدها پر شده‌اند
  const isFormComplete = Object.values(formData).every(
    (value) => value.trim().length > 0
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border bg-card p-6 shadow-sm space-y-6"
    >
      <h2 className="text-lg font-semibold text-center mb-2">ویرایش پروفایل</h2>
      <p className="text-center text-sm text-muted-foreground mb-4">
        لطفاً اطلاعات خود را بررسی و در صورت نیاز ویرایش کنید.
      </p>

      <div className="grid gap-3">
        <Label htmlFor="displayName">نام و نام خانوادگی</Label>
        <Input
          id="displayName"
          className={`rounded-xl border-muted focus:ring-2 focus:ring-primary/30 ${
            errors.displayName ? "border-destructive" : ""
          }`}
          placeholder="نام کامل"
          value={formData.displayName}
          onChange={handleFieldChange("displayName")}
          onBlur={handleFieldBlur("displayName")}
        />
        {errors.displayName && (
          <p className="text-sm text-destructive mt-1">{errors.displayName}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="phoneNumber">شماره تماس</Label>
        <Input
          id="phoneNumber"
          type="tel"
          className={`rounded-xl border-muted focus:ring-2 focus:ring-primary/30 ${
            errors.phoneNumber ? "border-destructive" : ""
          }`}
          placeholder="0912 345 6789"
          maxLength={13}
          value={formData.phoneNumber}
          onChange={handlePhoneChange}
          onBlur={handleFieldBlur("phoneNumber")}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive mt-1">{errors.phoneNumber}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="city">شهر</Label>
        <Input
          id="city"
          className={`rounded-xl border-muted focus:ring-2 focus:ring-primary/30 ${
            errors.city ? "border-destructive" : ""
          }`}
          placeholder="شهر"
          value={formData.city}
          onChange={handleFieldChange("city")}
          onBlur={handleFieldBlur("city")}
        />
        {errors.city && (
          <p className="text-sm text-destructive mt-1">{errors.city}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="address">آدرس</Label>
        <Textarea
          id="address"
          className={`min-h-[100px] rounded-xl border-muted focus:ring-2 focus:ring-primary/30 resize-none ${
            errors.address ? "border-destructive" : ""
          }`}
          placeholder="آدرس دقیق با تمام جزئیات مثل شماره واحد"
          value={formData.address}
          onChange={handleFieldChange("address")}
          onBlur={handleFieldBlur("address")}
        />
        {errors.address && (
          <p className="text-sm text-destructive mt-1">{errors.address}</p>
        )}
      </div>

      <div className="grid gap-3">
        <Label htmlFor="postalCode">کد پستی</Label>
        <Input
          dir="ltr"
          id="postalCode"
          className={`rounded-xl border-muted focus:ring-2 focus:ring-primary/30 ${
            errors.postalCode ? "border-destructive" : ""
          }`}
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
        />
        {errors.postalCode && (
          <p className="text-sm text-destructive mt-1">{errors.postalCode}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl text-base font-medium transition-all duration-200 hover:opacity-90"
        disabled={isLoading || !isFormValid || !isFormComplete}
      >
        {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>

      {(!isFormValid || !isFormComplete) && (
        <p className="text-sm text-muted-foreground text-center">
          لطفاً تمام فیلدها را به درستی پر کنید
        </p>
      )}
    </form>
  );
}
