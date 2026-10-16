import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  hideLabel?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, error, hideLabel, className, id, ...rest },
  ref,
) {
  const selectId = id ?? rest.name;
  return (
    <div className="space-y-1.5">
      <label htmlFor={selectId} className={cn("text-sm font-medium", hideLabel && "sr-only")}>
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        className={cn(
          "h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition",
          "focus:border-primary focus:ring-2 focus:ring-primary/20",
          error && "border-danger",
          className,
        )}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});