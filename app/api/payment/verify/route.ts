import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const success = searchParams.get("success")
  const trackId = searchParams.get("trackId")
  const orderId = searchParams.get("orderId")

  const supabase = await createClient()

  if (success === "1" && trackId) {
    try {
      // Verify payment with Zibal
      const zibalResponse = await fetch("https://gateway.zibal.ir/v1/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchant: "zibal",
          trackId: trackId,
        }),
      })

      const data = await zibalResponse.json()

      if (data.result === 100) {
        // Payment successful - update order status
        await supabase
          .from("orders")
          .update({
            payment_status: "paid",
            status: "processing",
          })
          .eq("id", orderId)

        // Clear user's cart
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          await supabase.from("cart_items").delete().eq("user_id", user.id)
        }

        return NextResponse.redirect(new URL(`/order-success?orderId=${orderId}`, request.url))
      }
    } catch (error) {
      console.error("[v0] Payment verification error:", error)
    }
  }

  // Payment failed
  return NextResponse.redirect(new URL(`/order-failed?orderId=${orderId}`, request.url))
}
