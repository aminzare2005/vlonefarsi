"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

function SupportPage() {
  const [started, setStarted] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isPrefetched, setIsPrefetched] = useState(false);
  const telegramUrl = "https://t.me/vl9nefarsi";

  // Pre-fetch لینک به محض لود کامپوننت
  useEffect(() => {
    const prefetchLink = async () => {
      try {
        // استفاده از Prefetch برای لینک
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = telegramUrl;
        link.as = "document";
        document.head.appendChild(link);

        // همچنین می‌توانیم از fetch API برای pre-fetch استفاده کنیم
        await fetch(telegramUrl, { mode: "no-cors", cache: "force-cache" });

        setIsPrefetched(true);
      } catch (error) {
        console.log("Prefetch completed (errors are expected due to CORS)");
        setIsPrefetched(true);
      }
    };

    prefetchLink();
  }, []);

  // بازکردن لینک در تب جدید
  const openInNewTab = () => {
    window.open(telegramUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (started) {
      setProgressValue(100);
      const redirect = setTimeout(() => {
        openInNewTab();
        setStarted(false);
      }, 3000);
      return () => {
        clearTimeout(redirect);
      };
    }
  }, [started]);

  return (
    <div className="flex flex-col items-center max-w-lg justify-center min-h-[70dvh] mx-auto p-6 gap-6 text-center">
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-sky-500/15 to-background h-80 -z-50" />
      <p className="text-5xl font-extrabold mb-4">پشتیبانی تلگرام</p>

      {!started ? (
        <>
          <p className="text-gray-500 text-lg">
            درصورتی که برای سفارش به مشکلی خوردید یا سفارشتون لغو شده، با
            پشتیبانی تلگرام در ارتباط باشید تا توی سریع‌ترین زمان ممکن مشکلتون
            حل بشه.
          </p>
          <Button
            onClick={() => setStarted(true)}
            size="lg"
            dir="ltr"
            className="gap-0.5 w-full"
            disabled={!isPrefetched}
          >
            <SendIcon />
            @vl9nefarsi
          </Button>
        </>
      ) : (
        <div className="w-full flex flex-col items-center gap-3">
          <Progress
            value={progressValue}
            duration={3000}
            className="w-full h-3 rounded-full"
          />
          <p className="text-sm text-gray-500">درحال انتقال به تلگرام...</p>
        </div>
      )}
    </div>
  );
}

export default SupportPage;
