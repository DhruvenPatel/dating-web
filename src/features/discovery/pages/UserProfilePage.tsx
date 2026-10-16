import type { ReactNode } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  Cake,
  Languages,
  Lock,
  MapPin,
  User as UserIcon,
} from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";
import { Avatar } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { RelationshipButton } from "@/features/friends/components/RelationshipButton";
import { getAge } from "@/lib/date";
import { getErrorMessage } from "@/lib/errors";
import { capitalize } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { usePublicProfile } from "../hooks";
import { BlockButton } from "@/features/friends/components/BlockButton";
import { useIsBlocked, useMutualFriends, useRelationships } from "@/features/friends/hooks";

function Detail({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function TagGroup({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export function UserProfilePage() {
  const { userId = "" } = useParams();
  const navigate = useNavigate();
  const me = useAuthStore((s) => s.user);
  const isSelf = me?.id === userId;

  const { data, isLoading, isError, error, refetch } = usePublicProfile(userId, !isSelf);
  const relations = useRelationships();
  const mutual = useMutualFriends(userId, !isSelf);
  const isBlocked = useIsBlocked(userId);

  if (isSelf) return <Navigate to="/profile" replace />;

  const back = (
    <button
      onClick={() => navigate(-1)}
      className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft size={16} /> Back
    </button>
  );

  if (isLoading || relations.isLoading) {
    return (
      <div>
        {back}
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div>
        {back}
        <ErrorState message={getErrorMessage(error)} onRetry={() => refetch()} />
      </div>
    );
  }

  const { profile } = data;
  const name = profile.display_name || data.full_name;
  const visibility = data.privacy.profile_visibility;
  const isFriend = relations.get(userId).status === "friends";
  const locked = visibility === "private" || (visibility === "friends" && !isFriend);

  const age = getAge(profile.date_of_birth);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");
  const mutualCount = mutual.data?.length ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {back}

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="relative h-40 bg-gradient-to-br from-primary/40 via-primary/15 to-transparent sm:h-56">
          {!locked && profile.cover_photo && (
            <img src={profile.cover_photo.url} alt="" className="h-full w-full object-cover" />
          )}
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex items-end justify-between gap-3 sm:-mt-14">
            <div className="relative">
              <Avatar
                src={profile.profile_picture?.url}
                name={name}
                size={104}
                className="ring-4 ring-card"
              />
              {!locked && profile.is_online && (
                <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-success" />
              )}
            </div>
            <div className="flex w-44 flex-col gap-2 pb-1">
                {!isBlocked && <RelationshipButton userId={userId} />}
                <BlockButton
                    variant="button"
                    target={{
                        id: userId,
                        name,
                        username: data.username,
                        pictureUrl: profile.profile_picture?.url ?? null,
                    }}
                />
            </div>
          </div>

          <div className="mt-3">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              {name}
              {data.is_verified && <BadgeCheck size={20} className="text-primary" />}
            </h2>
            <p className="text-sm text-muted-foreground">@{data.username}</p>
          </div>

          {locked ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-muted p-4 text-sm">
              <Lock size={18} className="shrink-0 text-muted-foreground" />
              <p>
                {visibility === "private"
                  ? "This profile is private."
                  : "Only matches can see this profile. Like them to connect."}
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-6">
              {profile.bio && <p className="max-w-2xl whitespace-pre-line text-sm">{profile.bio}</p>}

              <div className="grid gap-4 sm:grid-cols-2">
                {age !== null && <Detail icon={<Cake size={16} />} label="Age" value={`${age} years`} />}
                {profile.gender && (
                  <Detail icon={<UserIcon size={16} />} label="Gender" value={capitalize(profile.gender)} />
                )}
                {location && <Detail icon={<MapPin size={16} />} label="Location" value={location} />}
                {profile.occupation && (
                  <Detail icon={<Briefcase size={16} />} label="Occupation" value={profile.occupation} />
                )}
                {profile.languages.length > 0 && (
                  <Detail
                    icon={<Languages size={16} />}
                    label="Languages"
                    value={profile.languages.join(", ")}
                  />
                )}
              </div>

              <TagGroup title="Interests" items={profile.interests} />
              <TagGroup title="Hobbies" items={profile.hobbies} />

              {mutualCount > 0 && (
                <div className="flex items-center gap-3 border-t pt-5">
                  <div className="flex -space-x-2">
                    {mutual.data?.slice(0, 5).map((f) => (
                      <Avatar
                        key={f.id}
                        src={f.profile_picture?.url}
                        name={f.display_name || f.full_name || "?"}
                        size={32}
                        className="ring-2 ring-card"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mutualCount} mutual {mutualCount === 1 ? "match" : "matches"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}