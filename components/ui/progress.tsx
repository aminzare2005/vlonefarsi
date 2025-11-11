import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  duration?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, duration = 3000, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-orange-400"
          style={{
            width: `${value}%`,
            transition: `width ${duration}ms linear`,
          }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
