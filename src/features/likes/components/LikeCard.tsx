import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, MapPin, User } from "lucide-react";
import { usePublicProfile } from "@/features/discovery/hooks";
import { getAge } from "@/lib/date";

export interface LikePerson {
  id: string;
  name: string;
  pictureUrl: string | null;
}

interface LikeCardProps {
  userId: string;
  fallbackName: string; // shown until (or if) the profile can't be loaded
  caption: string; // e.g. "Liked you 2 hours ago"
  actions: (person: LikePerson) => ReactNode;
}

export function LikeCard({ userId, fallbackName, caption, actions }: LikeCardProps) {
  // The requests list has no photos, so fetch the public profile (cached).
  const { data } = usePublicProfile(userId);
  const profile = data?.profile;

  const name = profile?.display_name || data?.full_name || fallbackName;
  const pictureUrl = profile?.profile_picture?.url ?? null;
  const age = getAge(profile?.date_of_birth);
  const location = [profile?.city, profile?.country].filter(Boolean).join(", ");

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="overflow-hidden rounded-2xl border bg-card"
    >
      <Link to={`/users/${userId}`} className="relative block aspect-[3/4] bg-muted">
        {pictureUrl ? (
          <img src={pictureUrl} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-violet-700 via-fuchsia-700 to-pink-600">
            <User size={72} className="text-white/25" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-14 text-white">
          <p className="flex items-center gap-1 font-display text-base font-bold">
            <span className="truncate">
              {name}
              {age !== null ? `, ${age}` : ""}
            </span>
            {data?.is_verified && <BadgeCheck size={15} className="shrink-0 text-sky-300" />}
          </p>
          {location && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80">
              <MapPin size={11} /> <span className="truncate">{location}</span>
            </p>
          )}
          <p className="mt-1 text-[11px] text-white/60">{caption}</p>
        </div>
      </Link>

      <div className="flex gap-2 p-3">{actions({ id: userId, name, pictureUrl })}</div>
    </motion.article>
  );
}