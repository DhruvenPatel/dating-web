import { useRef, useState, type ChangeEvent } from "react";
import { BadgeCheck, Briefcase, Camera, ImagePlus, Loader2, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/Avatar";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { validateImage } from "@/lib/images";
import type { MyProfileData } from "@/types/profile";
import {
  useDeleteCoverPhoto,
  useDeleteProfilePicture,
  useUploadCoverPhoto,
  useUploadProfilePicture,
} from "../hooks";

export function ProfileHeader({ data }: { data: MyProfileData }) {
  const { profile, user } = data;
  const name = profile.display_name || user.full_name;

  const uploadPicture = useUploadProfilePicture();
  const deletePicture = useDeleteProfilePicture();
  const uploadCover = useUploadCoverPhoto();
  const deleteCover = useDeleteCoverPhoto();

  const pictureInput = useRef<HTMLInputElement>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const [confirm, setConfirm] = useState<"picture" | "cover" | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>, kind: "picture" | "cover") => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return toast.error(problem);
    (kind === "picture" ? uploadPicture : uploadCover).mutate(file);
  };

  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");
  const memberSince = new Date(profile.created_at).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Cover */}
        <div className="relative h-40 bg-gradient-to-br from-primary/40 via-primary/15 to-transparent sm:h-56">
          {profile.cover_photo && (
            <img src={profile.cover_photo.url} alt="Cover" className="h-full w-full object-cover" />
          )}
          {uploadCover.isPending && (
            <div className="absolute inset-0 grid place-items-center bg-black/40">
              <Loader2 className="animate-spin text-white" />
            </div>
          )}
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              onClick={() => coverInput.current?.click()}
              className="flex items-center gap-1.5 rounded-lg bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur hover:bg-black/70"
            >
              <ImagePlus size={14} />
              {profile.cover_photo ? "Change cover" : "Add cover"}
            </button>
            {profile.cover_photo && (
              <button
                onClick={() => setConfirm("cover")}
                aria-label="Remove cover photo"
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/55 text-white backdrop-blur hover:bg-danger"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <input
            ref={coverInput}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => handleFile(e, "cover")}
          />
        </div>

        {/* Identity */}
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 sm:-mt-14">
            <div className="relative w-fit">
              <Avatar
                src={profile.profile_picture?.url}
                name={name}
                size={104}
                className="ring-4 ring-card"
              />
              {uploadPicture.isPending && (
                <div className="absolute inset-0 grid place-items-center rounded-full bg-black/40">
                  <Loader2 className="animate-spin text-white" />
                </div>
              )}
              <button
                onClick={() => pictureInput.current?.click()}
                aria-label="Change profile picture"
                className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full border-2 border-card bg-primary text-primary-foreground hover:opacity-90"
              >
                <Camera size={16} />
              </button>
              {profile.profile_picture && (
                <button
                  onClick={() => setConfirm("picture")}
                  aria-label="Remove profile picture"
                  className="absolute -right-1 top-0 grid h-7 w-7 place-items-center rounded-full border-2 border-card bg-muted text-muted-foreground hover:bg-danger hover:text-white"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <input
                ref={pictureInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(e) => handleFile(e, "picture")}
              />
            </div>
          </div>

          <div className="mt-3">
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              {name}
              {profile.is_verified && <BadgeCheck size={20} className="text-primary" />}
            </h2>
            <p className="text-sm text-muted-foreground">@{user.username}</p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} /> {location}
                </span>
              )}
              {profile.occupation && (
                <span className="flex items-center gap-1.5">
                  <Briefcase size={15} /> {profile.occupation}
                </span>
              )}
              <span>Member since {memberSince}</span>
            </div>

            {profile.bio && <p className="mt-4 max-w-2xl whitespace-pre-line text-sm">{profile.bio}</p>}

            {profile.interests.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.interests.map((i) => (
                  <span key={i} className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {i}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirm === "picture"}
        title="Remove profile picture?"
        description="Your profile picture will be deleted permanently."
        confirmLabel="Remove"
        loading={deletePicture.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deletePicture.mutate(undefined, { onSettled: () => setConfirm(null) })}
      />
      <ConfirmDialog
        open={confirm === "cover"}
        title="Remove cover photo?"
        description="Your cover photo will be deleted permanently."
        confirmLabel="Remove"
        loading={deleteCover.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteCover.mutate(undefined, { onSettled: () => setConfirm(null) })}
      />
    </>
  );
}