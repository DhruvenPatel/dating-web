import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RelationshipButton } from "@/features/friends/components/RelationshipButton";
import { capitalize } from "@/lib/utils";
import type { DiscoveryUser } from "@/types/discovery";

export function UserCard({ user }: { user: DiscoveryUser }) {
  const name = user.display_name || user.full_name;
  const location = [user.city, user.country].filter(Boolean).join(", ");
  const meta = [user.age ? `${user.age} yrs` : null, user.gender ? capitalize(user.gender) : null]
    .filter(Boolean)
    .join(" · ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col rounded-lg border bg-card p-4 transition hover:shadow-md"
    >
      <Link to={`/users/${user.id}`} className="flex flex-1 flex-col">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={user.profile_picture?.url} name={name} size={56} />
            {user.is_online && (
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-success" />
            )}
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 truncate font-semibold">
              <span className="truncate">{name}</span>
              {user.is_verified && <BadgeCheck size={16} className="shrink-0 text-primary" />}
            </p>
            <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {(meta || location) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {meta && <span>{meta}</span>}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {location}
              </span>
            )}
          </div>
        )}

        {user.bio && <p className="mt-3 line-clamp-2 text-sm">{user.bio}</p>}

        {user.interests.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {user.interests.slice(0, 3).map((i) => (
              <span key={i} className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {i}
              </span>
            ))}
            {user.interests.length > 3 && (
              <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                +{user.interests.length - 3}
              </span>
            )}
          </div>
        )}
      </Link>

      <div className="mt-4">
        <RelationshipButton userId={user.id} />
      </div>
    </motion.article>
  );
}