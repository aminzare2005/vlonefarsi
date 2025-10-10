import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10" dir="rtl">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">ثبت نام موفق!</CardTitle>
            <CardDescription>لطفاً ایمیل خود را بررسی کنید</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              یک ایمیل تأیید به آدرس شما ارسال شده است. لطفاً برای فعال‌سازی حساب کاربری خود، روی لینک موجود در ایمیل کلیک
              کنید.
            </p>
            <Link href="/auth/login" className="text-sm text-primary underline underline-offset-4">
              بازگشت به صفحه ورود
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
