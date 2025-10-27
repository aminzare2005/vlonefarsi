"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import PhonecaseCard from "@/components/phonecaseCard";
import { useInView } from "react-intersection-observer";
import PhonecaseCardSkeleton from "./phonecaseCardSkeleton";
import { BellIcon, CctvIcon, PackageX, RefreshCcwIcon } from "lucide-react"; // آیکن خالی بودن
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyMedia,
  EmptyHeader,
  EmptyTitle,
  EmptyContent,
} from "./ui/empty";
import { Button } from "./ui/button";
import EmptyCommon from "./empty-common";

type Product = {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
};

type ProductsGridProps = {
  initialProducts: Product[];
  pageSize?: number;
};

export default function ProductGrid({
  initialProducts,
  pageSize = 12,
}: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    rootMargin: "500px",
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      fetchMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  async function fetchMore() {
    setIsLoading(true);
    const supabase = createClient();

    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) console.error(error);

    if (!data || data.length === 0) {
      setHasMore(false);
    } else {
      setProducts((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    }

    setIsLoading(false);
  }

  const isEmpty = !products || products.length === 0;

  return (
    <div className="space-y-4">
      {isEmpty ? (
        <EmptyCommon />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {products.map((product) => (
              <PhonecaseCard
                key={product.id}
                href={`/phonecase/${product.id}`}
                image_url={product.image_url}
                name={product.name}
                size="big"
              />
            ))}

            {isLoading &&
              Array.from({ length: 4 }).map((_, idx) => (
                <PhonecaseCardSkeleton size="big" key={idx} />
              ))}
          </div>

          <div ref={ref} />
        </>
      )}
    </div>
  );
}
