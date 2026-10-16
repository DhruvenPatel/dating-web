import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, type, className, id, ...rest },
  ref,
) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputId = id ?? rest.name;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={isPassword && visible ? "text" : type}
          aria-invalid={!!error}
          className={cn(
            "h-11 w-full rounded-lg border bg-background px-3.5 text-sm outline-none transition",
            "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
            error && "border-danger focus:border-danger focus:ring-danger/20",
            isPassword && "pr-11",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});