import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/errors";
import type { MyProfileData } from "@/types/profile";
import { profileApi } from "./api";

export const ME_KEY = ["me"] as const;

export function useMyProfile() {
  return useQuery({ queryKey: ME_KEY, queryFn: profileApi.getMe, staleTime: 60_000 });
}

// Update the cached profile instantly instead of refetching.
function useMeCache() {
  const qc = useQueryClient();
  return (fn: (old: MyProfileData) => MyProfileData) =>
    qc.setQueryData<MyProfileData>(ME_KEY, (old) => (old ? fn(old) : old));
}

const onError = (e: unknown) => toast.error(getErrorMessage(e));

export function useUpdateProfile() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (profile) => {
      setMe((old) => ({ ...old, profile }));
      toast.success("Profile updated.");
    },
    onError,
  });
}

export function useUploadProfilePicture() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.uploadPicture,
    onSuccess: (profile_picture) => {
      setMe((old) => ({ ...old, profile: { ...old.profile, profile_picture } }));
      toast.success("Profile picture updated.");
    },
    onError,
  });
}

export function useDeleteProfilePicture() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.deletePicture,
    onSuccess: () => {
      setMe((old) => ({ ...old, profile: { ...old.profile, profile_picture: null } }));
      toast.success("Profile picture removed.");
    },
    onError,
  });
}

export function useUploadCoverPhoto() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.uploadCover,
    onSuccess: (cover_photo) => {
      setMe((old) => ({ ...old, profile: { ...old.profile, cover_photo } }));
      toast.success("Cover photo updated.");
    },
    onError,
  });
}

export function useDeleteCoverPhoto() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.deleteCover,
    onSuccess: () => {
      setMe((old) => ({ ...old, profile: { ...old.profile, cover_photo: null } }));
      toast.success("Cover photo removed.");
    },
    onError,
  });
}

export function useUpdatePrivacy() {
  const setMe = useMeCache();
  return useMutation({
    mutationFn: profileApi.updatePrivacy,
    onSuccess: (privacy) => {
      setMe((old) => ({ ...old, privacy }));
      toast.success("Privacy settings saved.");
    },
    onError,
  });
}