// import { Outlet } from "react-router-dom";
// import { ThemeToggle } from "./ThemeToggle";

// export function AuthLayout() {
//   return (
//     <div className="relative grid min-h-screen place-items-center px-4 py-10">
//       <div className="absolute right-4 top-4">
//         <ThemeToggle />
//       </div>
//       <div className="w-full max-w-md">
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold tracking-tight">
//             VIP<span className="text-primary">X</span>FRIEND
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Meet people. Make real friends.
//           </p>
//         </div>
//         <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// }
import { Link, Outlet } from "react-router-dom";
import { Flame, Heart, MessageCircle } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "./ThemeToggle";

const POINTS = [
  { icon: Flame, text: "Swipe through people who share your interests" },
  { icon: Heart, text: "Match when the feeling is mutual" },
  { icon: MessageCircle, text: "Chat with photos and videos" },
];

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel (desktop only) */}
      <aside className="relative hidden overflow-hidden bg-brand lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(40rem_30rem_at_20%_10%,rgba(255,255,255,0.25),transparent)]" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/">
            <Logo onBrand />
          </Link>

          <div>
            <h2 className="font-display text-5xl font-bold leading-[1.1] tracking-tight">
              Find someone
              <br />
              worth meeting.
            </h2>
            <ul className="mt-8 space-y-4">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-white/90">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15">
                    <Icon size={16} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/70">© {new Date().getFullYear()} VIPXFRIEND</p>
        </div>
      </aside>

      {/* Form */}
      <main className="relative flex items-center justify-center px-4 py-10">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </Link>
          <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}