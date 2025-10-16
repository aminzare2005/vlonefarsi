"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { Textarea } from "./ui/textarea";

interface ProfileFormProps {
  profile: any;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.displayName,
          phone_number: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "اطلاعات شما با موفقیت ذخیره شد",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "مشکلی در به‌روزرسانی اطلاعات پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-sm space-y-6"
    >
      <h2 className="text-lg font-semibold text-center mb-2">ویرایش پروفایل</h2>
      <p className="text-center text-sm text-muted-foreground mb-4">
        لطفاً اطلاعات خود را بررسی و در صورت نیاز ویرایش کنید.
      </p>

      <div className="grid gap-3">
        <Label htmlFor="displayName">نام و نام خانوادگی</Label>
        <Input
          id="displayName"
          className="rounded-xl border-muted focus:ring-2 focus:ring-primary/30"
          placeholder="نام کامل"
          value={formData.displayName}
          onChange={(e) =>
            setFormData({ ...formData, displayName: e.target.value })
          }
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="phoneNumber">شماره تماس</Label>
        <Input
          id="phoneNumber"
          type="tel"
          className="rounded-xl border-muted focus:ring-2 focus:ring-primary/30"
          placeholder="09123456789"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="city">شهر</Label>
        <Input
          id="city"
          className="rounded-xl border-muted focus:ring-2 focus:ring-primary/30"
          placeholder="شهر"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="address">آدرس</Label>
        <Textarea
          id="address"
          className="min-h-[100px] rounded-xl border-muted focus:ring-2 focus:ring-primary/30 resize-none"
          placeholder="مثلاً: شیراز - اوبلاک"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="postalCode">کد پستی</Label>
        <Input
          dir="ltr"
          id="postalCode"
          className="rounded-xl border-muted focus:ring-2 focus:ring-primary/30"
          placeholder="1234567890"
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({ ...formData, postalCode: e.target.value })
          }
        />
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl text-base font-medium transition-all duration-200 hover:opacity-90"
        disabled={isLoading}
      >
        {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  );
}
