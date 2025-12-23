"use client";

import PhonecaseCard from "@/components/phonecaseCard";
import Image from "next/image";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

function page() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const id = searchParams.get("id") || "vlonefarsi-mockup";
  const image_url = searchParams.get("image_url") || "/images/mockup-bg.png";

  const handleExportMockup = async () => {
    const node = document.getElementById("mockup");

    if (!node) return;
    setLoading(true);

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
    });

    const link = document.createElement("a");
    link.download = `vf-post-${id}.png`;
    link.href = dataUrl;
    link.click();
    setLoading(false);
  };

  const handleExportPhonecase = async () => {
    const node = document.getElementById("phonecase");

    if (!node) return;
    setLoading(true);

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
    });

    const link = document.createElement("a");
    link.download = `vf-phonecase-${id}.png`;
    link.href = dataUrl;
    link.click();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        id="mockup"
        className="relative w-full aspect-square overflow-hidden"
      >
        <Image
          src={"/images/mockup-bg.png"}
          alt={`Mockup background`}
          fill
          quality={100}
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <div id="phonecase" className="w-[clamp(120px,21.3vw,240px)]">
            <PhonecaseCard size="big" image_url={image_url} />
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-4 w-full">
        <Button disabled={loading} onClick={handleExportMockup}>
          خروجی پست اینستا
        </Button>
        <Button disabled={loading} onClick={handleExportPhonecase}>
          خروجی پی‌ان‌جی قاب
        </Button>
      </div>
    </div>
  );
}

export default page;
