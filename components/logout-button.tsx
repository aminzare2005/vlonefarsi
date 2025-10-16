"use client";

import { useLogout } from "@/hooks/use-logout";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoutButton() {
  const { logout, isLoading } = useLogout();

  return (
    <Button
      onClick={logout}
      disabled={isLoading}
      variant="ghost"
      className="rounded-s-md size-8"
    >
      <LogOut
        className={cn(
          "text-destructive",
          isLoading && "rotate-180 duration-200"
        )}
      />
    </Button>
  );
}
