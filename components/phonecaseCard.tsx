import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  href?: string;
  image_url?: string;
  name?: string;
  size: "small" | "big";
};

function PhonecaseCard(props: Props) {
  return (
    <div
      className={cn(
        "aspect-[9/18] w-full border border-stone-700 duration-300 bg-stone-900 overflow-hidden relative cursor-pointer",
        props.size === "small" && "rounded-lg",
        props.size === "big" && "rounded-3xl md:rounded-4xl"
      )}
    >
      <Link className="h-full w-full" href={props.href || ""} draggable="false">
        <div className="absolute w-full h-full top-0 right-0 left-0">
          <Image
            width={120}
            height={120}
            src={props.image_url || "/images/card-default.jpg"}
            alt={props.name || "قاب موبایل"}
            loading="lazy"
            draggable="false"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex absolute rounded-full bg-stone-800 border border-stone-900/40 flex-col w-1/3 m-[5%] p-[4%] left-0 top-0">
          <div className="bg-black border border-stone-900 rounded-full w-full aspect-square mb-[10%]"></div>
          <div className="bg-black border border-stone-900 rounded-full w-full aspect-square"></div>
        </div>
      </Link>
    </div>
  );
}

export default PhonecaseCard;
