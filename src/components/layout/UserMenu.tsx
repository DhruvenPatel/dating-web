import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings, User,Image as ImageIcon } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { useLogout } from "@/features/auth/useLogout";
import { useMyProfile } from "@/features/profile/hooks";
import { useAuthStore } from "@/store/authStore";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);
  const { data: me } = useMyProfile();
  const logout = useLogout();

  const name = me?.profile.display_name || user?.full_name || "Account";

  // Close on outside tap or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass =
    "flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="rounded-full"
      >
        <Avatar src={me?.profile.profile_picture?.url} name={name} size={36} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-40 mt-2 w-56 rounded-lg border bg-card p-1.5 shadow-lg"
        >
          <div className="border-b px-3 py-2">
            <p className="truncate text-sm font-semibold">{name}</p>
            {user && <p className="truncate text-xs text-muted-foreground">@{user.username}</p>}
          </div>
          <Link to="/profile" onClick={() => setOpen(false)} className={itemClass} role="menuitem">
            <User size={16} /> My profile
          </Link>
          <Link to="/gallery" onClick={() => setOpen(false)} className={itemClass} role="menuitem">
            <ImageIcon size={16} /> Gallery
          </Link>
          <Link to="/settings" onClick={() => setOpen(false)} className={itemClass} role="menuitem">
            <Settings size={16} /> Settings
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              void logout();
            }}
            className={`${itemClass} text-danger`}
            role="menuitem"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}