import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

// Focus always goes to the first empty box, so digits can never leave gaps.
export function OtpInput({ value, onChange, length = 6, disabled }: OtpInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const focusBox = (index: number) =>
    refs.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const handleChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;
    const next = (value + digits).slice(0, length);
    onChange(next);
    focusBox(next.length);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      onChange(value.slice(0, -1));
      focusBox(value.length - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!digits) return;
    onChange(digits);
    focusBox(digits.length);
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={value[i] ?? ""}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={2}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onFocus={() => {
            const target = Math.min(value.length, length - 1);
            if (i !== target) refs.current[target]?.focus();
          }}
          className={cn(
            "h-14 w-full min-w-0 rounded-lg border bg-background text-center text-xl font-semibold outline-none transition",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            value[i] && "border-primary/60",
            "disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}