import { createClient } from "@/lib/supabase/server";
import { PhoneCaseSelector } from "@/components/phone-case-selector";
import { notFound } from "next/navigation";
import PhonecaseCard from "@/components/phonecaseCard";
import Link from "next/link";

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
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-24 md:pb-8">
      {/* Product Image Section */}
      <div className="w-full md:w-1/3">
        <div className="pointer-events-none flex items-center justify-center p-4 md:p-0">
          <div className="w-1/2 md:w-full">
            <PhonecaseCard size="big" image_url={product.image_url} />
          </div>
        </div>
      </div>
      {/* Product Info Section */}
      <div className="flex justify-between flex-col w-full gap-4 pb-4">
        <div className="flex flex-col gap-4">
          <div className="opacity-70 cursor-pointer inline-flex flex-wrap gap-x-2 font-light text-sm">
            <Link href={"/"}>ویلون فارسی</Link>/
            <Link href={"/products"}>قاب موبایل</Link>/
            <Link href={`/products/${product.id}`}>{product.name}</Link>
          </div>
          {/* Title */}
          <div className="space-y-4">
            <h1
              dir="ltr"
              className="text-4xl md:text-5xl text-left md:text-start font-bold text-white leading-tight"
            >
              {product.name}
            </h1>
            <p dir="auto" className="w-full">
              {product.description && product.description}
            </p>
            {/* TODO: put some static data abt phonecases */}
          </div>
        </div>
        <PhoneCaseSelector
          productId={product.id}
          phoneCases={phoneCases || []}
        />
      </div>
    </div>
  );
}
