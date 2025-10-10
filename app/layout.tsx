import type React from "react"
import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"

const rubik = Rubik({
  subsets: ["latin", "arabic"],
  variable: "--font-rubik",
})

export const metadata: Metadata = {
  title: "فروشگاه آنلاین صنایع دستی",
  description: "فروشگاه آنلاین محصولات ایرانی و صنایع دستی",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`font-sans ${rubik.variable}`}>
        <Suspense>{children}</Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
