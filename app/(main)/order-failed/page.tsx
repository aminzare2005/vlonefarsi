import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default function OrderFailedPage() {
  return (
    <main className="container py-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-2xl">پرداخت ناموفق بود</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              متأسفانه پرداخت شما با موفقیت انجام نشد. لطفاً دوباره تلاش کنید.
            </p>

            <div className="flex gap-4">
              <Button asChild className="flex-1">
                <Link href="/cart">بازگشت به سبد خرید</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 bg-transparent"
              >
                <Link href="/">بازگشت به فروشگاه</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
