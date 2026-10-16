// import type { PrivacyKey } from "@/types/profile";

// export const GENDER_OPTIONS = [
//   { value: "", label: "Select gender" },
//   { value: "male", label: "Male" },
//   { value: "female", label: "Female" },
//   { value: "non-binary", label: "Non-binary" },
//   { value: "other", label: "Other" },
// ];

// const EVERYONE_FRIENDS_NOBODY = [
//   { value: "everyone", label: "Everyone" },
//   { value: "friends", label: "Friends only" },
//   { value: "nobody", label: "Nobody" },
// ];

// // Allowed values match the backend's validate_privacy_values exactly.
// export const PRIVACY_FIELDS: {
//   key: PrivacyKey;
//   label: string;
//   description: string;
//   options: { value: string; label: string }[];
// }[] = [
//   {
//     key: "profile_visibility",
//     label: "Profile visibility",
//     description: "Who can view your full profile.",
//     options: [
//       { value: "public", label: "Public" },
//       { value: "friends", label: "Friends only" },
//       { value: "private", label: "Private" },
//     ],
//   },
//   {
//     key: "search_visibility",
//     label: "Appear in search",
//     description: "Who can find you in Discover.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
//   {
//     key: "online_status_visibility",
//     label: "Online status",
//     description: "Who can see when you're online.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
//   {
//     key: "last_seen_visibility",
//     label: "Last seen",
//     description: "Who can see when you were last active.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
//   {
//     key: "friend_request_permission",
//     label: "Friend requests",
//     description: "Who can send you friend requests.",
//     options: [
//       { value: "everyone", label: "Everyone" },
//       { value: "friends_of_friends", label: "Friends of friends" },
//       { value: "nobody", label: "Nobody" },
//     ],
//   },
//   {
//     key: "message_permission",
//     label: "Messages",
//     description: "Who can message you.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
//   {
//     key: "voice_call_permission",
//     label: "Voice calls",
//     description: "Who can call you by voice.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
//   {
//     key: "video_call_permission",
//     label: "Video calls",
//     description: "Who can call you by video.",
//     options: EVERYONE_FRIENDS_NOBODY,
//   },
// ];
import type { PrivacyKey } from "@/types/profile";

export const GENDER_OPTIONS = [
  { value: "", label: "Select gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
];

const EVERYONE_MATCHES_NOBODY = [
  { value: "everyone", label: "Everyone" },
  { value: "friends", label: "Matches only" },
  { value: "nobody", label: "Nobody" },
];

// Stored values match the backend's validate_privacy_values exactly.
export const PRIVACY_FIELDS: {
  key: PrivacyKey;
  label: string;
  description: string;
  options: { value: string; label: string }[];
}[] = [
  {
    key: "profile_visibility",
    label: "Profile visibility",
    description: "Who can view your full profile.",
    options: [
      { value: "public", label: "Public" },
      { value: "friends", label: "Matches only" },
      { value: "private", label: "Private" },
    ],
  },
  {
    key: "search_visibility",
    label: "Appear in Discover",
    description: "Who can find you in Discover.",
    options: EVERYONE_MATCHES_NOBODY,
  },
  {
    key: "online_status_visibility",
    label: "Online status",
    description: "Who can see when you're online.",
    options: EVERYONE_MATCHES_NOBODY,
  },
  {
    key: "last_seen_visibility",
    label: "Last seen",
    description: "Who can see when you were last active.",
    options: EVERYONE_MATCHES_NOBODY,
  },
  {
    key: "friend_request_permission",
    label: "Who can like you",
    description: "Who is allowed to send you a like.",
    options: [
      { value: "everyone", label: "Everyone" },
      { value: "friends_of_friends", label: "Mutual connections" },
      { value: "nobody", label: "Nobody" },
    ],
  },
  {
    key: "message_permission",
    label: "Messages",
    description: "Who can message you.",
    options: EVERYONE_MATCHES_NOBODY,
  },
  {
    key: "voice_call_permission",
    label: "Voice calls",
    description: "Who can call you by voice.",
    options: EVERYONE_MATCHES_NOBODY,
  },
  {
    key: "video_call_permission",
    label: "Video calls",
    description: "Who can call you by video.",
    options: EVERYONE_MATCHES_NOBODY,
  },
];