import { api } from "@/lib/api";
import type { ApiEnvelope } from "@/types/api";
import type { CloudImage, MyProfileData, PrivacySettings, Profile } from "@/types/profile";

export interface ProfileUpdatePayload {
  display_name?: string;
  bio?: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  state?: string;
  city?: string;
  languages?: string[];
  interests?: string[];
  hobbies?: string[];
  occupation?: string;
}

function toForm(file: File) {
  const form = new FormData();
  form.append("file", file);
  return form; // axios sets the multipart boundary itself
}

export const profileApi = {
  getMe: async () => (await api.get<ApiEnvelope<MyProfileData>>("/users/me")).data.data,

  updateProfile: async (payload: ProfileUpdatePayload) =>
    (await api.patch<ApiEnvelope<{ profile: Profile }>>("/users/me/profile", payload)).data.data
      .profile,

  uploadPicture: async (file: File) =>
    (
      await api.post<ApiEnvelope<{ profile_picture: CloudImage }>>(
        "/users/me/profile-picture",
        toForm(file),
      )
    ).data.data.profile_picture,

  deletePicture: async () => {
    await api.delete("/users/me/profile-picture");
  },

  uploadCover: async (file: File) =>
    (
      await api.post<ApiEnvelope<{ cover_photo: CloudImage }>>(
        "/users/me/cover-photo",
        toForm(file),
      )
    ).data.data.cover_photo,

  deleteCover: async () => {
    await api.delete("/users/me/cover-photo");
  },

  updatePrivacy: async (payload: Partial<PrivacySettings>) =>
    (await api.patch<ApiEnvelope<{ privacy: PrivacySettings }>>("/users/me/privacy", payload))
      .data.data.privacy,
};