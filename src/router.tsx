// import { createBrowserRouter, Navigate } from "react-router-dom";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { AuthLayout } from "@/components/layout/AuthLayout";
// import { GuestRoute } from "@/components/routing/GuestRoute";
// import { ProtectedRoute } from "@/components/routing/ProtectedRoute";
// import { PagePlaceholder } from "@/components/common/PagePlaceholder";
// import { LoginPage } from "@/features/auth/pages/LoginPage";
// import { RegisterPage } from "@/features/auth/pages/RegisterPage";
// import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";
// import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
// import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";
// import { ProfilePage } from "@/features/profile/pages/ProfilePage";
// import { SettingsPage } from "@/features/settings/pages/SettingsPage";
// import { DiscoveryPage } from "@/features/discovery/pages/DiscoveryPage";
// import { UserProfilePage } from "@/features/discovery/pages/UserProfilePage";
// import { FriendsPage } from "@/features/friends/pages/FriendsPage";
// import { ChatPage } from "@/features/chat/pages/ChatPage";
// import { NotificationsPage } from "@/features/notifications/pages/NotificationsPage";
// import { GalleryPage } from "@/features/gallery/pages/GalleryPage";
// const page = (title: string, description: string) => (
//   <PagePlaceholder title={title} description={description} />
// );

// export const router = createBrowserRouter([
//   { path: "/", element: <Navigate to="/discover" replace /> },

//   // Public (logged-out only)
//   {
//     element: <GuestRoute />,
//     children: [
//       {
//         element: <AuthLayout />,
//         children: [
//             { path: "/login", element: <LoginPage /> },
//             { path: "/register", element: <RegisterPage /> },
//             { path: "/verify-email", element: <VerifyEmailPage /> },
//             { path: "/forgot-password", element: <ForgotPasswordPage /> },
//             { path: "/reset-password", element: <ResetPasswordPage /> },
//             { path: "/profile", element: <ProfilePage /> },
//             { path: "/settings", element: <SettingsPage /> },
//             { path: "/friends", element: <FriendsPage /> },
          
//         ],
//       },
//     ],
//   },

//   // Private (logged-in only)
//   {
//     element: <ProtectedRoute />,
//     children: [
//       {
//         element: <AppLayout />,
//         children: [
//           { path: "/discover", element: <DiscoveryPage /> },
//           { path: "/users/:userId", element: <UserProfilePage /> },
//           { path: "/friends", element: <FriendsPage /> },
//           { path: "/chat", element: <ChatPage /> },
//           { path: "/chat/:friendId", element: <ChatPage /> },
//           { path: "/notifications", element: <NotificationsPage /> },
//           { path: "/gallery", element: <GalleryPage /> },
//           { path: "/profile", element: page("Profile", "Built in Step 3.") },
//           { path: "/settings", element: page("Settings", "Built in Step 3.") },
         
          
//         ],
//       },
//     ],
//   },

//   { path: "*", element: <Navigate to="/" replace /> },
// ]);

// import type { ComponentType } from "react";
// import { createBrowserRouter, Navigate } from "react-router-dom";
// import { NotFoundPage } from "@/components/common/NotFoundPage";
// import { RouteError } from "@/components/common/RouteError";
// import { Splash } from "@/components/common/Splash";
// import { AppLayout } from "@/components/layout/AppLayout";
// import { AuthLayout } from "@/components/layout/AuthLayout";
// import { RootLayout } from "@/components/layout/RootLayout";
// import { GuestRoute } from "@/components/routing/GuestRoute";
// import { ProtectedRoute } from "@/components/routing/ProtectedRoute";

// // Each page becomes its own chunk, loaded only when first visited.
// const lazyPage = (load: () => Promise<object>, name: string) => async () => ({
//   Component: (await load() as Record<string, ComponentType>)[name],
// });

// export const router = createBrowserRouter([
//   {
//     element: <RootLayout />,
//     errorElement: <RouteError />,
//     hydrateFallbackElement: <Splash />,
//     children: [
//       { path: "/", element: <Navigate to="/discover" replace /> },

//       // Logged-out only
//       {
//         element: <GuestRoute />,
//         children: [
//           {
//             element: <AuthLayout />,
//             children: [
//               {
//                 path: "/login",
//                 handle: { title: "Log in" },
//                 lazy: lazyPage(() => import("@/features/auth/pages/LoginPage"), "LoginPage"),
//               },
//               {
//                 path: "/register",
//                 handle: { title: "Create account" },
//                 lazy: lazyPage(() => import("@/features/auth/pages/RegisterPage"), "RegisterPage"),
//               },
//               {
//                 path: "/verify-email",
//                 handle: { title: "Verify email" },
//                 lazy: lazyPage(
//                   () => import("@/features/auth/pages/VerifyEmailPage"),
//                   "VerifyEmailPage",
//                 ),
//               },
//               {
//                 path: "/forgot-password",
//                 handle: { title: "Forgot password" },
//                 lazy: lazyPage(
//                   () => import("@/features/auth/pages/ForgotPasswordPage"),
//                   "ForgotPasswordPage",
//                 ),
//               },
//               {
//                 path: "/reset-password",
//                 handle: { title: "Reset password" },
//                 lazy: lazyPage(
//                   () => import("@/features/auth/pages/ResetPasswordPage"),
//                   "ResetPasswordPage",
//                 ),
//               },
//             ],
//           },
//         ],
//       },

//       // Logged-in only
//       {
//         element: <ProtectedRoute />,
//         children: [
//           {
//             element: <AppLayout />,
//             children: [
//               {
//                 path: "/discover",
//                 handle: { title: "Discover" },
//                 lazy: lazyPage(
//                   () => import("@/features/discovery/pages/DiscoveryPage"),
//                   "DiscoveryPage",
//                 ),
//               },
//               {
//                 path: "/users/:userId",
//                 handle: { title: "Profile" },
//                 lazy: lazyPage(
//                   () => import("@/features/discovery/pages/UserProfilePage"),
//                   "UserProfilePage",
//                 ),
//               },
//               {
//                 path: "/friends",
//                 handle: { title: "Friends" },
//                 lazy: lazyPage(() => import("@/features/friends/pages/FriendsPage"), "FriendsPage"),
//               },
//               {
//                 path: "/chat",
//                 handle: { title: "Chat" },
//                 lazy: lazyPage(() => import("@/features/chat/pages/ChatPage"), "ChatPage"),
//               },
//               {
//                 path: "/chat/:friendId",
//                 handle: { title: "Chat" },
//                 lazy: lazyPage(() => import("@/features/chat/pages/ChatPage"), "ChatPage"),
//               },
//               {
//                 path: "/notifications",
//                 handle: { title: "Notifications" },
//                 lazy: lazyPage(
//                   () => import("@/features/notifications/pages/NotificationsPage"),
//                   "NotificationsPage",
//                 ),
//               },
//               {
//                 path: "/gallery",
//                 handle: { title: "Gallery" },
//                 lazy: lazyPage(() => import("@/features/gallery/pages/GalleryPage"), "GalleryPage"),
//               },
//               {
//                 path: "/profile",
//                 handle: { title: "My profile" },
//                 lazy: lazyPage(() => import("@/features/profile/pages/ProfilePage"), "ProfilePage"),
//               },
//               {
//                 path: "/settings",
//                 handle: { title: "Settings" },
//                 lazy: lazyPage(
//                   () => import("@/features/settings/pages/SettingsPage"),
//                   "SettingsPage",
//                 ),
//               },
//             ],
//           },
//         ],
//       },

//       { path: "*", element: <NotFoundPage /> },
//     ],
//   },
// ]);
import type { ComponentType } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { NotFoundPage } from "@/components/common/NotFoundPage";
import { RouteError } from "@/components/common/RouteError";
import { Splash } from "@/components/common/Splash";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RootLayout } from "@/components/layout/RootLayout";
import { GuestRoute } from "@/components/routing/GuestRoute";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";

// Each page becomes its own chunk, loaded only when first visited.
const lazyPage = (load: () => Promise<object>, name: string) => async () => ({
  Component: ((await load()) as Record<string, ComponentType>)[name],
});

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    hydrateFallbackElement: <Splash />,
    children: [
      // Public landing page (logged-in users are redirected to /discover)
      {
        path: "/",
        handle: { title: "Find someone worth meeting" },
        lazy: lazyPage(() => import("@/features/landing/pages/HomeRoute"), "HomeRoute"),
      },

      // Logged-out only
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              {
                path: "/login",
                handle: { title: "Log in" },
                lazy: lazyPage(() => import("@/features/auth/pages/LoginPage"), "LoginPage"),
              },
              {
                path: "/register",
                handle: { title: "Create account" },
                lazy: lazyPage(() => import("@/features/auth/pages/RegisterPage"), "RegisterPage"),
              },
              {
                path: "/verify-email",
                handle: { title: "Verify email" },
                lazy: lazyPage(
                  () => import("@/features/auth/pages/VerifyEmailPage"),
                  "VerifyEmailPage",
                ),
              },
              {
                path: "/forgot-password",
                handle: { title: "Forgot password" },
                lazy: lazyPage(
                  () => import("@/features/auth/pages/ForgotPasswordPage"),
                  "ForgotPasswordPage",
                ),
              },
              {
                path: "/reset-password",
                handle: { title: "Reset password" },
                lazy: lazyPage(
                  () => import("@/features/auth/pages/ResetPasswordPage"),
                  "ResetPasswordPage",
                ),
              },
            ],
          },
        ],
      },

      // Logged-in only
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/discover",
                handle: { title: "Discover" },
                lazy: lazyPage(
                  () => import("@/features/discovery/pages/DiscoveryPage"),
                  "DiscoveryPage",
                ),
              },
              {
                path: "/users/:userId",
                handle: { title: "Profile" },
                lazy: lazyPage(
                  () => import("@/features/discovery/pages/UserProfilePage"),
                  "UserProfilePage",
                ),
              },
              {
                path: "/likes",
                handle: { title: "Likes" },
                lazy: lazyPage(() => import("@/features/likes/pages/LikesPage"), "LikesPage"),
              },
              {
                path: "/matches",
                handle: { title: "Matches" },
                lazy: lazyPage(() => import("@/features/friends/pages/FriendsPage"), "FriendsPage"),
              },
              // Old bookmarks and links keep working.
              { path: "/friends", element: <Navigate to="/matches" replace /> },
              {
                path: "/chat",
                handle: { title: "Messages" },
                lazy: lazyPage(() => import("@/features/chat/pages/ChatPage"), "ChatPage"),
              },
              {
                path: "/chat/:friendId",
                handle: { title: "Messages" },
                lazy: lazyPage(() => import("@/features/chat/pages/ChatPage"), "ChatPage"),
              },
              {
                path: "/notifications",
                handle: { title: "Notifications" },
                lazy: lazyPage(
                  () => import("@/features/notifications/pages/NotificationsPage"),
                  "NotificationsPage",
                ),
              },
              {
                path: "/gallery",
                handle: { title: "Gallery" },
                lazy: lazyPage(() => import("@/features/gallery/pages/GalleryPage"), "GalleryPage"),
              },
              {
                path: "/profile",
                handle: { title: "My profile" },
                lazy: lazyPage(() => import("@/features/profile/pages/ProfilePage"), "ProfilePage"),
              },
              {
                path: "/settings",
                handle: { title: "Settings" },
                lazy: lazyPage(
                  () => import("@/features/settings/pages/SettingsPage"),
                  "SettingsPage",
                ),
              },
            ],
          },
        ],
      },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);