import { DisplayVersion } from "@/components/display-version";
import { Button } from "@/components/ui/button";
import { GlobeIcon, InstagramIcon, SendIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function AboutPage() {
  return (
    <div className="flex max-w-[414px] mx-auto flex-col gap-4 md:[&>p]:text-center pb-6">
      <p className="text-6xl font-extrabold my-4 text-center">درباره ما</p>
      <p>
        برند ویلون فارسی (vlone farsi) اوایل سال 2024 با هدف عرضه محصولاتی که
        کمبودشون واقعا حس میشد تاسیس شد!
      </p>
      <p>
        اسم ما با الگو از برند VLONE که در نیویورک فعالیت داره انتخاب شده که در
        طول فعالیت خودش انقلابی رو در صنعت موسیقی، مد و فشن ایجاد کرده.
      </p>
      <p>
        اولین دراپ ویلون فارسی، تعدادی استیکر و پوستر بود و اونقدری که باید
        بازخورد نگرفت. درنهایت بعد از مدت کوتاهی اولین سری از قاب‌های موبایل
        دراپ شد و با استقبال زیادی روبرو شد.
      </p>
      <p>
        و حالا بعد از کار کردن با وارد کننده‌های مختلف، تونستیم به قیمت نهایی
        مناسب و ثابتی برسیم و تونستیم برند خودمون رو رسمی تر و بهتر توی
        وبسایتمون عرضه کنیم.
      </p>
      <p>
        هدف نهاییمون، عرضه محصولات مختلف با کیفیت بالا در کنار قاب موبایل هست.
        ممنونیم که توی این مسیر کنار ما هستید;)
      </p>
      <div>
        <p dir="ltr" className="text-6xl font-extrabold my-4 text-center">
          FOLLOW US !
        </p>
        <div dir="ltr" className="w-full grid grid-cols-3 gap-4">
          <Link
            href={"https://instagram.com/vlonefarsi"}
            target="_blank"
            className="w-full"
          >
            <Button
              dir="ltr"
              className="w-full gap-1"
              variant="default"
              size="lg"
            >
              <InstagramIcon />
              vlonefarsi
            </Button>
          </Link>
          <Link
            href={"https://t.me/vlonefarsi"}
            target="_blank"
            className="w-full"
          >
            <Button
              dir="ltr"
              className="w-full gap-1"
              variant="default"
              size="lg"
            >
              <SendIcon />
              vlonefarsi
            </Button>
          </Link>
          <Link
            href={"https://vlonefarsi.ir"}
            target="_blank"
            className="w-full"
          >
            <Button
              dir="ltr"
              className="w-full gap-1"
              variant="default"
              size="lg"
            >
              <GlobeIcon />
              vlonefarsi.ir
            </Button>
          </Link>
        </div>
      </div>
      <div
        dir="ltr"
        className="border-t pt-2 text-center opacity-70 font-thin tracking-wider text-xs"
      >
        © VLONEFARSI 2025 - <DisplayVersion />
      </div>
    </div>
  );
}

export default AboutPage;
