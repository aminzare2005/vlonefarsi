"use client";

import PhonecaseCard from "@/components/phonecaseCard";
import Image from "next/image";
import React from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";

function page() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const id = params.id;
  const image_url = searchParams.get("image_url") || "/images/mockup-bg.png";

  const handleExport = async () => {
    const node = document.getElementById("mockup");

    if (!node) return;
    console.log(node);

    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio: 3,
    });
    console.log(dataUrl);

    const link = document.createElement("a");
    link.download = `${id}.png`;
    link.href = dataUrl;
    link.click();
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
          <div className="w-[clamp(120px,21.3vw,240px)]">
            <PhonecaseCard size="big" image_url={image_url} />
          </div>
        </div>
      </div>
      <Button onClick={handleExport}>خروجی پی‌ان‌جی پست اینستا</Button>
    </div>
  );
}

export default page;
