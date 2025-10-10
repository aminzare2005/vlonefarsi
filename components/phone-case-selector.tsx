"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

type PhoneCase = {
  id: string
  brand: string
  model: string
  price: number
  available: boolean
}

type PhoneCaseSelectorProps = {
  productId: string
  phoneCases: PhoneCase[]
}

export function PhoneCaseSelector({ productId, phoneCases }: PhoneCaseSelectorProps) {
  const [selectedPhoneCaseId, setSelectedPhoneCaseId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Group phone cases by brand
  const groupedPhoneCases = phoneCases.reduce(
    (acc, phoneCase) => {
      if (!acc[phoneCase.brand]) {
        acc[phoneCase.brand] = []
      }
      acc[phoneCase.brand].push(phoneCase)
      return acc
    },
    {} as Record<string, PhoneCase[]>,
  )

  const selectedPhoneCase = phoneCases.find((pc) => pc.id === selectedPhoneCaseId)

  const handleAddToCart = async () => {
    if (!selectedPhoneCaseId) {
      toast({
        title: "خطا",
        description: "لطفا مدل گوشی خود را انتخاب کنید",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .eq("phone_case_id", selectedPhoneCaseId)
        .single()

      if (existingItem) {
        // Update quantity
        const { error } = await supabase
          .from("cart_items")
          .update({ quantity: existingItem.quantity + 1 })
          .eq("id", existingItem.id)

        if (error) throw error
      } else {
        // Insert new item
        const { error } = await supabase.from("cart_items").insert({
          user_id: user.id,
          product_id: productId,
          phone_case_id: selectedPhoneCaseId,
          quantity: 1,
        })

        if (error) throw error
      }

      toast({
        title: "موفق",
        description: "محصول به سبد خرید اضافه شد",
      })

      router.refresh()
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "خطا",
        description: "مشکلی در افزودن به سبد خرید پیش آمد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">انتخاب مدل گوشی</h2>
        <RadioGroup value={selectedPhoneCaseId} onValueChange={setSelectedPhoneCaseId}>
          <div className="space-y-4">
            {Object.entries(groupedPhoneCases).map(([brand, cases]) => (
              <div key={brand} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{brand}</h3>
                <div className="space-y-2">
                  {cases.map((phoneCase) => (
                    <div
                      key={phoneCase.id}
                      className={`flex items-center justify-between rounded-lg border p-3 ${
                        !phoneCase.available ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={phoneCase.id} id={phoneCase.id} disabled={!phoneCase.available} />
                        <Label
                          htmlFor={phoneCase.id}
                          className={`cursor-pointer ${!phoneCase.available ? "cursor-not-allowed" : ""}`}
                        >
                          {phoneCase.model}
                          {!phoneCase.available && <span className="mr-2 text-xs text-red-600">(ناموجود)</span>}
                        </Label>
                      </div>
                      <span className="font-semibold">
                        {new Intl.NumberFormat("fa-IR").format(phoneCase.price)} تومان
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {selectedPhoneCase && (
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">قیمت نهایی:</span>
            <span className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("fa-IR").format(selectedPhoneCase.price)} تومان
            </span>
          </div>
        </div>
      )}

      <Button onClick={handleAddToCart} disabled={!selectedPhoneCaseId || isLoading} className="w-full" size="lg">
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
  )
}
