"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image_url: string
  category: string
  onAddToCart?: () => void
}

export function ProductCard({ id, name, price, image_url, category, onAddToCart }: ProductCardProps) {
  const formattedPrice = new Intl.NumberFormat("fa-IR").format(price)

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image_url || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <div className="mb-1 text-xs text-muted-foreground">{category}</div>
        <Link href={`/products/${id}`}>
          <h3 className="mb-2 text-lg font-semibold leading-tight hover:text-primary">{name}</h3>
        </Link>
        <p className="text-xl font-bold text-primary">{formattedPrice} تومان</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={onAddToCart}>
          <ShoppingCart className="ml-2 h-4 w-4" />
          افزودن به سبد
        </Button>
      </CardFooter>
    </Card>
  )
}
