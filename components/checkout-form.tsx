"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

interface CheckoutFormProps {
  profile: any;
  total: number;
}

export function CheckoutForm({ profile, total }: CheckoutFormProps) {
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
          payment_status: "pending",
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postalCode,
          phone_number: formData.phoneNumber,
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
          display_name: formData.displayName,
          phone_number: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
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
      toast({
        title: "خطا",
        description: "مشکلی در ثبت سفارش پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="displayName">نام و نام خانوادگی</Label>
          <Input
            id="displayName"
            required
            dir="auto"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">شماره تماس</Label>
          <Input
            id="phoneNumber"
            type="tel"
            required
            dir="ltr"
            placeholder="09123456789"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="city">شهر</Label>
          <Input
            id="city"
            required
            dir="auto"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="address">آدرس کامل</Label>
          <Input
            id="address"
            required
            dir="auto"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="postalCode">کد پستی</Label>
          <Input
            id="postalCode"
            required
            dir="ltr"
            placeholder="1234567890"
            value={formData.postalCode}
            onChange={(e) =>
              setFormData({ ...formData, postalCode: e.target.value })
            }
          />
        </div>
      </div>

      <div className="fixed md:static bottom-3 right-3 left-3 p-4 md:p-0 md:mt-4 backdrop-blur-sm bg-background/50 md:bg-transparent border md:border-0 rounded-xl">
        <Button
          type="submit"
          className="w-full cursor-pointer"
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? "در حال پردازش..." : "پرداخت و ثبت نهایی سفارش"}
        </Button>
      </div>
    </form>
  );
}
