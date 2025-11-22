"use client";

import { useEffect, useRef, useState } from "react";
import PhonecaseCard from "@/components/phonecaseCard";
import {
  CustomPhoneCaseSelector,
  uploadAndCreateProduct,
} from "@/features/custom/custom-phonecase-selector";
import {
  Download,
  ImageIcon,
  ImagePlusIcon,
  ShoppingBasket,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CustomPhoneCasePageClient({
  phoneCases,
}: {
  phoneCases: any[];
}) {
  const { toast } = useToast();
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [isAddingToProducts, setIsAddingToProducts] = useState(false);
  const [createdProductId, setCreatedProductId] = useState<string | null>(null);

  useEffect(() => {
    const savedImage = localStorage.getItem("customPhonecasePreviewImage");
    if (savedImage) {
      setImageUrl(savedImage);
    }
  }, []);

  const handleFileChange = (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "فایل باید حتما تصویر باشه",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "حجم فایل باید کمتر از 5 مگابایت باشه",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setImageUrl(base64);
      localStorage.setItem("customPhonecasePreviewImage", base64);
      setCreatedProductId(null);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    localStorage.removeItem("customPhonecasePreviewImage");
    setCreatedProductId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleAddToProducts = async () => {
    if (!imageUrl) return;

    setIsLoading(true);
    setIsAddingToProducts(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const result = await uploadAndCreateProduct(imageUrl, user.id, supabase);
      setCreatedProductId(result.product_id);

      toast({
        title: "موفق",
        description: "محصول به قاب‌ها اضافه شد",
      });

      router.refresh();
    } catch (error) {
      console.error("Error adding to products:", error);
      toast({
        title: "خطا",
        description: "مشکلی در افزودن به قاب‌ها پیش آمد",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsAddingToProducts(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-12 pb-20 md:pb-4">
      {/* Product Image Section */}
      <div className="w-full md:w-1/3">
        <div className="flex items-center justify-center p-4 md:p-0">
          <div
            className="w-1/2 md:w-full"
            onClick={() => fileInputRef.current?.click()}
          >
            <PhonecaseCard
              size="big"
              image_url={imageUrl}
              className="pointer-events-none"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 justify-between">
        {/* Upload Section */}
        <div className="flex flex-col gap-4">
          <div className="opacity-70 cursor-pointer inline-flex flex-wrap gap-x-2 font-light text-sm">
            <Link href={"/"}>ویلون فارسی</Link>/
            <Link href={"/products"}>قاب موبایل</Link>/
            <Link href={"/products/custom"}>کاستوم</Link>
          </div>
          {/* Header */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white pb-4">
            قاب موبایل کاستوم
          </h1>
          <div
            className={`
                    border-2 hidden md:block w-full border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
                    ${
                      isDragging
                        ? "border-blue-500 bg-blue-500/10"
                        : imageUrl
                        ? createdProductId
                          ? "border-green-600/70 bg-green-500/5"
                          : "border-green-600/70 bg-green-500/5"
                        : "border-zinc-700 hover:border-zinc-700"
                    }
                  `}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileChange(file);
              }}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-3">
              {imageUrl ? (
                <>
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      createdProductId ? "bg-green-500" : "bg-green-500"
                    }`}
                  >
                    <ImageIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {createdProductId
                        ? "محصول آماده افزودن به سبد خرید است"
                        : "تصویر با موفقیت آپلود شد"}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {createdProductId
                        ? "می‌توانید به سبد خرید اضافه کنید"
                        : "برای تغییر تصویر، اینجا کلیک کنید یا فایل جدیدی رها کنید"}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white font-medium">
                      {isDragging
                        ? "رها کنید"
                        : "تصویر خود را اینجا آپلود کنید"}
                    </p>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <span>•</span>
                      <span>فرمت‌های مجاز: JPG, PNG, WebP</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs opacity-80">
                      <span>•</span>
                      <span>سایز پیشنهادی: 1000px در 2000px</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="fixed md:static z-50 bottom-3 right-3 left-3 md:p-0 p-4 backdrop-blur-sm bg-background/50 md:border-0 border border-input rounded-xl">
            <div className="flex justify-between gap-2">
              {imageUrl ? (
                <div className="flex gap-2">
                  <Button
                    variant={"destructive"}
                    size={"icon-lg"}
                    onClick={handleRemoveImage}
                    disabled={isLoading}
                  >
                    <X className="size-6" />
                  </Button>
                  <Link href={"#AddToCartButton"}>
                    <Button variant={"outline"} size={"icon-lg"}>
                      <ShoppingBasket className="size-6" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  variant={"outline"}
                  size={"lg"}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-6" />
                  آپلود عکس
                </Button>
              )}
              <Button
                variant={"outline"}
                size={"lg"}
                disabled={!imageUrl || isAddingToProducts || !!createdProductId}
                onClick={handleAddToProducts}
              >
                <ImagePlusIcon className="size-6" />
                {createdProductId
                  ? "اضافه شده به قاب‌ها"
                  : isAddingToProducts
                  ? "در حال افزودن..."
                  : "ارسال پیشنهاد"}
              </Button>
            </div>
          </div>
        </div>
        {/* Customization Options */}
        <div>
          <CustomPhoneCaseSelector
            image_url={imageUrl}
            phoneCases={phoneCases}
            createdProductId={createdProductId}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
