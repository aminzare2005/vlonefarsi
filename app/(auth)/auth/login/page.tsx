"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ backTo: string }>;
}) {
  const resolvedSearchParams = use(searchParams);
  const backTo = resolvedSearchParams?.backTo;

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.slice(0, 11);

    if (limited.length <= 4) {
      return limited;
    } else if (limited.length <= 7) {
      return `${limited.slice(0, 4)} ${limited.slice(4)}`;
    } else {
      return `${limited.slice(0, 4)} ${limited.slice(4, 7)} ${limited.slice(
        7
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const cleanedPhone = phone.replace(/\s/g, "");
    if (!/^09\d{9}$/.test(cleanedPhone)) {
      setError("شماره تماس باید با 09 شروع شود و 11 رقم باشد");
      setIsLoading(false);
      return;
    }

    const internationalPhone = `+98${cleanedPhone.slice(1)}`;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        phone: internationalPhone,
        password,
      });
      if (error) throw error;

      router.push(backTo ? `/products/${backTo}` : "/");
      router.refresh();
    } catch (err: unknown) {
      let message = "خطایی رخ داده است";

      if (err instanceof Error) {
        const englishMessage = err.message.toLowerCase();

        // 🗺️ Map Supabase errors to Persian messages
        const errorMap: Record<string, string> = {
          "invalid login credentials": "شماره یا رمز عبور اشتباه است",
          "user not found": "کاربری با این مشخصات یافت نشد",
          "network error": "خطا در اتصال به سرور. لطفاً بعداً تلاش کنید",
          "email not confirmed": "ایمیل شما هنوز تأیید نشده است",
          "invalid phone number": "شماره تلفن وارد شده معتبر نیست",
          "too many requests": "تعداد درخواست‌ها زیاد است، کمی صبر کنید",
          "invalid password": "رمز عبور اشتباه است",
        };

        // 🔍 Match the English error message
        for (const [key, value] of Object.entries(errorMap)) {
          if (englishMessage.includes(key)) {
            message = value;
            break;
          }
        }

        if (message === "خطایی رخ داده است") {
          console.warn("Unhandled Supabase error:", err.message);
        }
      }

      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ورود به ویلون فارسی</CardTitle>
            <CardDescription>
              برای ورود، شماره تماس و رمز عبور خودت رو وارد کن
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="phone">شماره</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="0912 345 6789"
                    maxLength={13}
                    value={phone}
                    onChange={handlePhoneChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">رمز عبور</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "در حال ورود..." : "ورود"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                اکانت نداری؟{" "}
                <Link
                  href={
                    backTo ? `/auth/signup?backTo=${backTo}` : "/auth/signup"
                  }
                  className="underline underline-offset-4"
                >
                  ثبت نام کن
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
