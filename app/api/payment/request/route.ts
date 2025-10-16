import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { orderId, amount } = await request.json()

    // Zibal payment request
    const zibalResponse = await fetch("https://gateway.zibal.ir/v1/request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchant: "zibal",
        amount: amount * 10, // Convert to Rials (Toman * 10)
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payment/verify`,
        description: `پرداخت سفارش ${orderId}`,
        orderId: orderId,
      }),
    })

    const data = await zibalResponse.json()
    console.log("[v0] Zibal raw response:", data)

    if (data.result === 100) {
      return NextResponse.json({
        success: true,
        trackId: data.trackId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment request failed",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Payment request error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
