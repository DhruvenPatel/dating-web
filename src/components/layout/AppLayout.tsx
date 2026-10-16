// import { NavLink, Outlet } from "react-router-dom";
// import {
//   Bell, Compass, Image, LogOut, MessageCircle, Settings, User, Users,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useAuthStore } from "@/store/authStore";
// import { ThemeToggle } from "./ThemeToggle";
// import { useLogout } from "@/features/auth/useLogout";
// import { Avatar } from "@/components/ui/Avatar";
// import { useMyProfile } from "@/features/profile/hooks";
// import { useReceivedRequests } from "@/features/friends/hooks";
// import { useChatOverview } from "@/features/chat/hooks";
// import { useNotificationUnreadCount } from "@/features/notifications/hooks";
// import { UserMenu } from "./UserMenu";
// const NAV = [
//   { to: "/discover", label: "Discover", icon: Compass },
//   { to: "/friends", label: "Friends", icon: Users },
//   { to: "/chat", label: "Chat", icon: MessageCircle },
//   { to: "/notifications", label: "Notifications", icon: Bell },
//   { to: "/gallery", label: "Gallery", icon: Image },
//   { to: "/profile", label: "Profile", icon: User },
//   { to: "/settings", label: "Settings", icon: Settings },
// ];

// export function AppLayout() {
  
//     const user = useAuthStore((s) => s.user);
//     const { data: me } = useMyProfile();
//     const displayName = me?.profile.display_name || user?.full_name || "Guest";
//     const handleLogout = useLogout();
//     const received = useReceivedRequests();
//     const pendingCount = received.data?.filter((r) => r.status === "pending").length ?? 0;
//     const { totalUnread } = useChatOverview();
//     const { data: notificationCount = 0 } = useNotificationUnreadCount();
//     const badge = (to: string) =>
//   to === "/friends"
//     ? pendingCount
//     : to === "/chat"
//       ? totalUnread
//       : to === "/notifications"
//         ? notificationCount
//         : 0;

//   return (
//     <div className="min-h-screen">
//       {/* Desktop sidebar */}
//       <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card p-4 md:flex">
//         <h1 className="px-3 py-4 text-xl font-bold tracking-tight">
//           VIP<span className="text-primary">X</span>FRIEND
//         </h1>

//         <nav className="mt-2 flex flex-1 flex-col gap-1">
//           {NAV.map(({ to, label, icon: Icon }) => (
//             <NavLink
//               key={to}
//               to={to}
//               className={({ isActive }) =>
//                 cn(
//                   "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
//                   isActive
//                     ? "bg-primary text-primary-foreground"
//                     : "text-muted-foreground hover:bg-muted hover:text-foreground",
//                 )
//               }
//             >
//               <Icon size={18} />
//               {label}
//              {badge(to) > 0 && (
//                 <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-semibold text-white">
//                   {badge(to)}
//                 </span>
//               )}
//             </NavLink>
//           ))}
//         </nav>

//         <div className="flex items-center justify-between gap-2 border-t pt-4">
//           <NavLink to="/profile" className="flex min-w-0 items-center gap-2.5">
//             <Avatar src={me?.profile.profile_picture?.url} name={displayName} size={36} />
//             <div className="min-w-0">
//               <p className="truncate text-sm font-semibold">{displayName}</p>
//               <p className="truncate text-xs text-muted-foreground">
//                 {user ? `@${user.username}` : ""}
//               </p>
//             </div>
//           </NavLink>
//           <div className="flex gap-2">
//             <ThemeToggle />
//             <button
//               onClick={handleLogout}
//               aria-label="Log out"
//               className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:text-danger"
//             >
//               <LogOut size={18} />
//             </button>
//           </div>
//         </div>
//       </aside>

//       {/* Mobile top bar */}
//       <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card/80 px-4 py-3 backdrop-blur md:hidden">
//         <h1 className="text-lg font-bold">
//           VIP<span className="text-primary">X</span>FRIEND
//         </h1>
//         <div className="flex items-center gap-2">
//           <ThemeToggle />
//           <UserMenu />
//         </div>
//       </header>

//       {/* Page content scrolls with the window so Lenis can smooth it */}
//       <main className="px-4 py-6 pb-24 md:pl-72 md:pr-8 md:pb-8">
//         <div className="mx-auto max-w-5xl">
//           <Outlet />
//         </div>
//       </main>

//       {/* Mobile bottom nav */}
//       <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-card/90 py-2 backdrop-blur md:hidden">
//         {NAV.slice(0, 5).map(({ to, icon: Icon }) => (
//           <NavLink
//             key={to}
//             to={to}
//             className={({ isActive }) =>
//               cn(
//                 "flex flex-col items-center gap-0.5 px-2 text-[11px] font-medium",
//                 isActive ? "text-primary" : "text-muted-foreground",
//               )
//             }
//           >
//            <span className="relative">
//               <Icon size={20} />
//               {badge(to) > 0 && (
//                   <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
//                     {badge(to)}
//                   </span>
//                 )}
//             </span>
//           </NavLink>
//         ))}
//       </nav>
//     </div>
//   );
// }
import { NavLink, Outlet } from "react-router-dom";
import {
  Bell, Flame, Heart, Image, LogOut, MessageCircle, Settings, User, Users, type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { useLogout } from "@/features/auth/useLogout";
import { useChatOverview } from "@/features/chat/hooks";
import { useReceivedRequests } from "@/features/friends/hooks";
import { useNotificationUnreadCount } from "@/features/notifications/hooks";
import { useMyProfile } from "@/features/profile/hooks";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";

const NAV: { to: string; label: string; short?: string; icon: LucideIcon }[] = [
  { to: "/discover", label: "Discover", icon: Flame },
  { to: "/likes", label: "Likes", icon: Heart },
  { to: "/matches", label: "Matches", icon: Users },
  { to: "/chat", label: "Messages", short: "Chat", icon: MessageCircle },
  { to: "/notifications", label: "Notifications", short: "Alerts", icon: Bell },
  { to: "/gallery", label: "Gallery", icon: Image },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppLayout() {
  const user = useAuthStore((s) => s.user);
  const { data: me } = useMyProfile();
  const logout = useLogout();
  const displayName = me?.profile.display_name || user?.full_name || "Guest";

  const received = useReceivedRequests();
  const pendingCount = received.data?.filter((r) => r.status === "pending").length ?? 0;
  const { totalUnread } = useChatOverview();
  const { data: notificationCount = 0 } = useNotificationUnreadCount();

  const badge = (to: string) =>
  to === "/likes"
    ? pendingCount
    : to === "/chat"
      ? totalUnread
      : to === "/notifications"
        ? notificationCount
        : 0;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-card/80 p-4 backdrop-blur md:flex">
        <div className="px-3 py-4">
          <Logo />
        </div>

        <nav className="mt-2 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-brand text-white shadow-glow"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )
              }
            >
              <Icon size={18} />
              {label}
              {badge(to) > 0 && (
                <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[11px] font-semibold text-white">
                  {badge(to)}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-between gap-2 border-t pt-4">
          <NavLink to="/profile" className="flex min-w-0 items-center gap-2.5">
            <Avatar src={me?.profile.profile_picture?.url} name={displayName} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user ? `@${user.username}` : ""}
              </p>
            </div>
          </NavLink>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              onClick={() => void logout()}
              aria-label="Log out"
              className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:text-danger"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-card/80 px-4 py-3 backdrop-blur md:hidden">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      {/* Page content scrolls with the window so Lenis can smooth it */}
      <main className="px-4 py-6 pb-24 md:pl-72 md:pr-8 md:pb-8">
        <div className="mx-auto max-w-5xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t bg-card/90 py-2 backdrop-blur md:hidden">
        {NAV.slice(0, 5).map(({ to, label, short, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-2 text-[11px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground",
              )
            }
          >
            <span className="relative">
              <Icon size={20} />
              {badge(to) > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
                  {badge(to)}
                </span>
              )}
            </span>
            {short ?? label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}