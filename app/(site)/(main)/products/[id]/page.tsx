import { createClient } from "@/lib/supabase/server";
import { PhoneCaseSelector } from "@/components/phone-case-selector";
import { notFound } from "next/navigation";
import PhonecaseCard from "@/components/phonecaseCard";
import Link from "next/link";
import AdminBar from "@/components/admin-bar";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    notFound();
  }

  const { data: phoneCases } = await supabase
    .from("phone_cases")
    .select("*")
    .order("brand")
    .order("model");

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-28 md:pb-8">
        <AdminBar id={product.id} image_url={product.image_url} />

        {/* Product Image Section */}
        <div className="w-full md:w-1/3">
          <div className="pointer-events-none flex items-center justify-center p-4 md:p-0">
            <div className="w-1/2 md:w-full">
              <PhonecaseCard size="big" image_url={product.image_url} />
            </div>
          </div>
        </div>

        {/* Product Info Section */}
        <div className="flex justify-between flex-col w-full gap-4">
          <div className="flex flex-col gap-4">
            <div className="opacity-70 cursor-pointer inline-flex flex-wrap gap-x-2 font-light text-sm">
              <Link href={"/"}>ویلون فارسی</Link>/
              <Link href={"/products"}>قاب موبایل</Link>/
              <Link href={`/products/${product.id}`}>{product.name}</Link>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1
                dir="auto"
                className="text-4xl md:text-5xl text-start font-bold text-white leading-tight"
              >
                {product.name}
              </h1>

              <p dir="auto" className="w-full text-foreground/80">
                {product.description && product.description}
              </p>

              {/* ✅ Added: trust/feature blocks (keeps layout, just adds content) */}
              <div className="space-y-4">
                {/* Badges row */}
                <div className="flex-wrap gap-2 hidden">
                  <Badge variant="secondary" className="text-foreground/90">
                    چاپ باکیفیت
                  </Badge>
                  <Badge variant="secondary" className="text-foreground/90">
                    محافظت دوربین
                  </Badge>
                  <Badge variant="secondary" className="text-foreground/90">
                    ضد لک و اثر انگشت
                  </Badge>
                  <Badge variant="secondary" className="text-foreground/90">
                    ارسال سریع
                  </Badge>
                </div>

                {/* <Separator className="bg-border/60" /> */}

                {/* Feature grid - responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-xl border border-border/60 bg-card/30 p-3">
                    <p className="text-sm font-medium text-foreground">
                      محافظت از موبایل
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      بدنه مقاوم + لبه‌های ضربه‌گیر
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-card/30 p-3">
                    <p className="text-sm font-medium text-foreground">
                      چاپ پیشرفته
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      رنگ ثابت و با کیفیت (با مراقبت حداقلی!)
                    </p>
                  </div>
                </div>

                {/* Collapsible FAQ/Policy */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="material" className="border-border/60">
                    <AccordionTrigger className="text-foreground">
                      جنس قاب چجوریه؟
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      جنس قاب ها پلاستیکی محکم اما انعطاف پذیر هست و یه سطح فلزی
                      نازک که روی اون طرح قاب پرینت میشه پشت قاب میچسبه که تا
                      حدودی جلو خم شدن قاب رو میگیره. قاب ها کاملا از گوشیتون
                      محافظت میکنن و کاملا دور گوشی رو میپوشونن.
                      <br />
                      <br />
                      بخش زیادی از قاب های ما این جنس رو دارن اما برای بعضی مدل
                      گوشی های خاص، جنس قاب پلاستیک فشرده و سفت هست که قابل خم
                      شدن نیست و نیاز به مراقبت بیشتری دارن اما به خوبی از گوشی
                      محافظت میکنن.
                      <br />
                      <br />
                      * اکثر قاب ها مخصوصا آیفون محافظ لنز دارن و با محافظ لنز
                      هایی که از قبل دارید تداخل داره
                      <br />
                      اگه براتون مهمه که جنس قاب دقیقا چی باشه یا مشکلی با محافظ
                      لنز قاب دارید، از طریق پشتیبانی تلگرام با ما در ارتباط
                      باشید.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="shipping" className="border-border/60">
                    <AccordionTrigger className="text-foreground">
                      چقدر دیگه به دستم میرسه؟
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      آماده سازی قاب ها یه فرایند 5 تا 10 روزه داره و بعد توی
                      اولین فرصت تحویل پست داده میشه که
                      <br />
                      ارسالش به نسبت شهری که هستید ممکنه بین 3 تا 7 روز طول
                      بکشه.
                      <br />
                      در مجموع توی 10 تا نهایتا 20 روز بعد از سفارش، بسته به
                      دستتون میرسه.
                      <br />
                      بعد از سفارش، میتونید بصورت لحظه ای از وبسایت وضعیت
                      سفارشتون رو چک کنید :)
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="returns" className="border-border/60">
                    <AccordionTrigger className="text-foreground">
                      اگه قابم خراب بود چی؟
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      اگه قاب به گوشیتون فیت نباشه، یا هرگونه مشکلی از لحاظ
                      کیفیت داشته باشه (درصورتی که مدل گوشیتونو درست انتخاب کرده
                      باشید!) میتونید قاب رو به ما برگردونید و هزینه ای که
                      پرداخت کردید رو دریافت کنید، یا یه قاب جدید سفارش بدید.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          <PhoneCaseSelector
            productId={product.id}
            phoneCases={phoneCases || []}
          />
        </div>
      </div>
    </>
  );
}
