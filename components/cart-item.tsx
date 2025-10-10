"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface CartItemProps {
  id: string
  productId: string
  name: string
  price: number
  image_url: string
  quantity: number
  phoneBrand: string
  phoneModel: string
  available: boolean
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const formattedPrice = new Intl.NumberFormat("fa-IR").format(price)
  const formattedTotal = new Intl.NumberFormat("fa-IR").format(price * quantity)

  const updateQuantity = async (newQuantity: number) => {
    if (newQuantity < 1) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("cart_items").update({ quantity: newQuantity }).eq("id", id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در به‌روزرسانی سبد خرید پیش آمد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "محصول حذف شد",
        description: "محصول از سبد خرید حذف شد",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در حذف محصول پیش آمد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
            <Image src={image_url || "/placeholder.svg"} alt={name} fill className="object-cover" />
          </div>

          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">
                {phoneBrand} {phoneModel}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm font-medium">{formattedPrice} تومان</p>
                {!available && <span className="text-xs text-red-600">(ناموجود)</span>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(quantity - 1)}
                  disabled={isLoading || quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={() => updateQuantity(quantity + 1)}
                  disabled={isLoading || !available}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-bold text-primary">{formattedTotal} تومان</span>
                <Button variant="ghost" size="icon" onClick={removeItem} disabled={isLoading}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
