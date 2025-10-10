"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface AddToCartButtonProps {
  productId: string
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleAddToCart = async () => {
    setIsLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/auth/login")
      return
    }

    try {
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId)
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
        const { error } = await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id: productId, quantity: 1 })

        if (error) throw error
      }

      toast({
        title: "محصول به سبد اضافه شد",
        description: "محصول با موفقیت به سبد خرید شما اضافه شد",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "خطا",
        description: "مشکلی در افزودن محصول به سبد خرید پیش آمد",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button className="w-full" onClick={handleAddToCart} disabled={isLoading}>
      <ShoppingCart className="ml-2 h-4 w-4" />
      {isLoading ? "در حال افزودن..." : "افزودن به سبد"}
    </Button>
  )
}
