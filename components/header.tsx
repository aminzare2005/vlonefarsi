"use client";

import Link from "next/link";
import { User, ShoppingBasketIcon } from "lucide-react";

export default function Header() {
  const MENU_ITEMS = [
    {
      title: "قاب موبایل",
      href: "/phonecase",
    },
    {
      title: "طرح دلخواه",
      href: "/phonecase/custom",
    },
    {
      title: "درباره ما",
      href: "/about",
    },
  ];
  return (
    <header className="fixed top-3 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-4xl">
      <div className="rounded-full backdrop-blur-md transition-all duration-300 bg-background/70 border border-border/80">
        <div className="container flex h-16 items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 font-bold text-lg"
          >
            <span>ویلون فارسی</span>
          </Link>

          <nav className="hidden md:flex gap-8 text-foreground">
            {MENU_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground transition-colors hover:text-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex gap-2 items-center relative">
            <Link
              href={"/cart"}
              className="overflow-visible rounded-md hover:bg-foreground/10 duration-200 p-1 flex justify-center items-center"
            >
              <ShoppingBasketIcon className="size-6" />
            </Link>
            <Link
              href="/dashboard"
              className="overflow-visible rounded-md hover:bg-foreground/10 duration-200 p-1 flex justify-center items-center"
            >
              <User className="size-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
