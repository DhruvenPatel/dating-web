import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        style={style}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      style={style}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary",
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}