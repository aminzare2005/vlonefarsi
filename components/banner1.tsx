import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

function Banner1() {
  return (
    <Link
      href="/products/custom"
      className="
      w-full aspect-video md:aspect-3/1
        rounded-3xl md:rounded-4xl
        flex items-center justify-center
        bg-gradient-to-br from-zinc-900 via-red-900/60 to-zinc-900
        overflow-hidden relative text-white
      "
    >
      {/* Motion Blur Glow */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-3xl" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center gap-2 p-4">
        <div className="flex items-center gap-2 text-2xl md:text-4xl font-extrabold">
          <span>طرح دلخواه!</span>
          <Sparkles className="size-6 md:size-8 text-yellow-400 fill-yellow-400 drop-shadow" />
        </div>

        <p className="text-sm md:text-lg opacity-90">
          قابی که دوست داشتی رو پیدا نکردی؟
          <br />
          طرحش رو آپلود کن و سفارشش بده!
        </p>
      </div>
    </Link>
  );
}

export default Banner1;
