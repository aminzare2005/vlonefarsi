import TrackPageClient from "@/components/track-page-client";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import React from "react";

export default async function OrderIdPage({
  params,
}: {
  params: Promise<{ track: number }>;
}) {
  const { track } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        id,
        product_name,
        product_id,
        product_price,
        quantity,
        phone_brand,
        phone_model,
        products (
          image_url
        )
      )
    `
    )
    .eq("track_id", track)
    .single();

  if (!order) {
    notFound();
  }
  console.log("NIGNIG", order);
  return <TrackPageClient order={order} />;
}
