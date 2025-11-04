"use client";

import Link from "next/link";
import { User, ShoppingBasketIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const timeout = setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
    <>
      <header
        className={cn(
          "fixed max-w-2xl h-16 mx-auto flex flex-row items-center gap-2 top-4 right-4 left-4 z-20 px-4 backdrop-blur-sm bg-background/50 border border-input rounded-full",
          isMenuOpen && "bg-transparent backdrop-blur-none border-transparent"
        )}
      >
        <div className="flex w-full h-16 items-center justify-between">
          <div className="inline-flex items-center gap-1">
            <Button
              onClick={toggleMenu}
              className="relative flex items-center justify-center group cursor-pointer hover:!bg-transparent"
              aria-label="Menu"
              variant={"ghost"}
              size={"icon"}
            >
              <span
                className={cn(
                  "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                  isMenuOpen
                    ? "rotate-45 translate-y-[0px]"
                    : "-translate-y-1.5 group-hover:-translate-y-2"
                )}
              ></span>
              <span
                className={cn(
                  "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                  isMenuOpen
                    ? "opacity-0 scale-x-0"
                    : "opacity-100 group-hover:scale-x-95"
                )}
              ></span>
              <span
                className={cn(
                  "absolute w-5 h-0.5 bg-foreground rounded-full transition-all duration-300",
                  isMenuOpen
                    ? "-rotate-45 -translate-y-[0px]"
                    : "translate-y-1.5 group-hover:translate-y-2"
                )}
              ></span>
            </Button>

            <Link
              href="/"
              className="flex items-center gap-1.5 font-bold text-lg"
            >
              <h1>ویلون فارسی</h1>
            </Link>
          </div>

          <div className="flex gap-0.5 items-center relative">
            <Link href={"/cart"}>
              <Button variant={"ghost"} size={"icon"}>
                <ShoppingBasketIcon className="size-6" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant={"ghost"} size={"icon"}>
                <User className="size-6" />
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="fixed inset-0 z-10">
          <div
            className="absolute inset-0 bg-background/50 backdrop-blur-md"
            onClick={() => setIsMenuOpen(false)}
          ></div>

          <div
            className={`absolute top-0 left-0 w-full transition-transform duration-200 ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            }`}
          >
            <div className="flex flex-col px-6 pt-24 gap-2 max-w-xl mx-auto">
              {MENU_ITEMS.map((item) => {
                const isCurrentPage = item.href === pathname;

                return isCurrentPage ? (
                  <button
                    key={item.href}
                    onClick={() =>
                      setTimeout(() => {
                        setIsMenuOpen(false);
                      }, 200)
                    }
                    className="flex items-center hover:bg-foreground/5 rounded-md transition-colors w-full justify-center gap-2 text-white text-lg font-medium py-2 hoveranim"
                  >
                    {item.title}
                  </button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center hover:bg-foreground/5 rounded-md transition-colors w-full justify-center gap-2 text-white text-lg font-medium py-2 hoveranim"
                  >
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
