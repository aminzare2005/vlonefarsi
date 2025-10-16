import Image from "next/image";
import Link from "next/link";
import React from "react";

function PhonecaseCard({
  href,
  image_url,
  name,
}: {
  href?: string;
  image_url?: string;
  name?: string;
}) {
  return (
    <div className="aspect-[9/18] hover:scale-101 w-full border border-stone-700 duration-300 bg-stone-900 rounded-2xl overflow-hidden relative cursor-pointer">
      <Link className="h-full w-full" href={href || ""}>
        <div className="absolute w-full h-full top-0 right-0 left-0">
          <Image
            width={120}
            height={120}
            src={image_url || "/images/card-default.jpg"}
            alt={name || "قاب موبایل"}
            loading="lazy"
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
