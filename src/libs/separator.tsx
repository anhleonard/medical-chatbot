"use client";

import * as React from "react";
import { cn } from "@/utils/utils";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full h-[0.5px] bg-grey-c200/50", className)}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator }; 