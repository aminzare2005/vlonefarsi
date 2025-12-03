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
        merchant: process.env.ZIBAL_MERCHANT_ID,
        amount: amount * 10, // Convert to Rials
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`,
        description: `پرداخت سفارش ${orderId}`,
        orderId: orderId,
      }),
    })

    console.log({
      merchant: process.env.ZIBAL_MERCHANT_ID,
      amount: amount * 10,
      orderId,
      callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`
    });

    console.log("🔑 merchant:", process.env.ZIBAL_MERCHANT_ID);
console.log("📡 callback:", `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/verify`);

console.log("⬅️ Zibal raw response text:", await zibalResponse.clone().text());

const data = await zibalResponse.json();
console.log("📨 Zibal parsed response:", data);

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
    console.error("Payment request error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
