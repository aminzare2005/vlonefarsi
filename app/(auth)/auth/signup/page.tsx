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

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ backTo: string }>;
}) {
  // Unwrap searchParams with React.use()
  const resolvedSearchParams = use(searchParams);
  const backTo = resolvedSearchParams?.backTo;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // تابع برای فرمت خودکار شماره تلفن
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      setIsLoading(false);
      return;
    }

    // اعتبارسنجی شماره تلفن قبل از ارسال
    const cleanedPhone = phone.replace(/\s/g, "");
    if (!/^09\d{9}$/.test(cleanedPhone)) {
      setError("شماره تماس باید با 09 شروع شود و 11 رقم باشد");
      setIsLoading(false);
      return;
    }

    const internationalPhone = `+98${cleanedPhone.slice(1)}`;

    try {
      const { error } = await supabase.auth.signUp({
        phone: internationalPhone,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });
      if (error) throw error;
      router.push(backTo ? `/products/${backTo}` : "/");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "خطایی رخ داده است");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ثبت نام در ویلون فارسی</CardTitle>
            <CardDescription>اکانت جدید خودت رو ایجاد کن</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                {/* <div className="grid gap-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    required
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div> */}
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
                    placeholder="••••••••"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="repeat-password">تکرار رمز عبور</Label>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    placeholder="••••••••"
                    dir="ltr"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="displayName">چی صدات کنیم؟</Label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="نام شما"
                    dir="rtl"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "در حال ایجاد حساب..." : "ثبت نام"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                اکانت داری؟{" "}
                <Link
                  href={backTo ? `/auth/login?backTo=${backTo}` : "/auth/login"}
                  className="underline underline-offset-4"
                >
                  وارد شو
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
