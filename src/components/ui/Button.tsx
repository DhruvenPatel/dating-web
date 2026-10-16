import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "md" | "sm";
  loading?: boolean;
  fullWidth?: boolean;
}

const VARIANTS = {
  primary: "bg-brand text-white hover:brightness-110",
  outline: "border bg-card text-foreground hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-white hover:opacity-90",
};

const SIZES = {
  md: "h-11 px-5 text-sm",
  sm: "h-9 px-3.5 text-xs",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        SIZES[size],
        VARIANTS[variant],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />}
      {children}
    </button>
  );
}