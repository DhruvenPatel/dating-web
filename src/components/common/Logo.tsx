import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  onBrand?: boolean; // white version for use on the gradient background
  className?: string;
}

const BOX = { sm: "h-7 w-7 rounded-lg", md: "h-9 w-9 rounded-xl", lg: "h-12 w-12 rounded-2xl" };
const ICON = { sm: 14, md: 18, lg: 24 };
const TEXT = { sm: "text-base", md: "text-xl", lg: "text-3xl" };

export function Logo({ size = "md", onBrand = false, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center text-white",
          BOX[size],
          onBrand ? "bg-white/20 backdrop-blur" : "bg-brand shadow-glow",
        )}
      >
        <Heart size={ICON[size]} fill="currentColor" />
      </span>
      <span className={cn("font-display font-bold tracking-tight", TEXT[size], onBrand && "text-white")}>
        VIPX<span className={onBrand ? undefined : "text-brand"}>FRIEND</span>
      </span>
    </span>
  );
}