import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

interface PersonRowProps {
  userId: string;
  name: string;
  username?: string | null;
  pictureUrl?: string | null;
  verified?: boolean;
  online?: boolean;
  subtitle?: string;
  actions?: ReactNode;
}

export function PersonRow({
  userId,
  name,
  username,
  pictureUrl,
  verified,
  online,
  subtitle,
  actions,
}: PersonRowProps) {
  const meta = [username ? `@${username}` : null, subtitle].filter(Boolean).join(" · ");

  return (
    <div className="flex items-center gap-3 p-4">
      <Link to={`/users/${userId}`} className="relative shrink-0">
        <Avatar src={pictureUrl} name={name} size={48} />
        {online && (
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
        )}
      </Link>

      <Link to={`/users/${userId}`} className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 font-semibold">
          <span className="truncate">{name}</span>
          {verified && <BadgeCheck size={15} className="shrink-0 text-primary" />}
        </p>
        {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
      </Link>

      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}