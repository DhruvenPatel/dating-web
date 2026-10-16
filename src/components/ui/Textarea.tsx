import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, className, id, ...rest },
  ref,
) {
  const inputId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      <textarea
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          "min-h-28 w-full resize-y rounded-lg border bg-background px-3.5 py-2.5 text-sm outline-none transition",
          "placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}
        {...rest}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});