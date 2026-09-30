import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function SiteFrame({
  children,
  className,
  fit = false,
}: {
  children: ReactNode;
  className?: string;
  fit?: boolean;
}) {
  if (fit) {
    return (
      <div className="portfolio-frame">
        <div className={cn("home-layout", className)}>{children}</div>
      </div>
    );
  }

  return (
    <div className="site-shell">
      <div className={cn("site-frame", className)}>{children}</div>
    </div>
  );
}
