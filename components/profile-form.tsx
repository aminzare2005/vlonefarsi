"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || "",
    phoneNumber: profile?.phone_number || "",
    address: profile?.address || "",
    city: profile?.city || "",
    postalCode: profile?.postal_code || "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("User not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: formData.displayName,
          phone_number: formData.phoneNumber,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "موفق",
        description: "اطلاعات شما با موفقیت به‌روزرسانی شد",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در به‌روزرسانی اطلاعات پیش آمد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="displayName">نام و نام خانوادگی</Label>
        <Input
          id="displayName"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phoneNumber">شماره تماس</Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="09123456789"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="city">شهر</Label>
        <Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">آدرس</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="postalCode">کد پستی</Label>
        <Input
          id="postalCode"
          placeholder="1234567890"
          value={formData.postalCode}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </Button>
    </form>
  )
}
