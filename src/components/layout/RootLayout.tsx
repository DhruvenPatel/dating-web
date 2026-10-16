import { useEffect } from "react";
import { Outlet, useLocation, useMatches } from "react-router-dom";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { lenisRef } from "@/lib/lenis";

function RouteTitle() {
  const matches = useMatches();
  const title = [...matches]
    .reverse()
    .map((m) => (m.handle as { title?: string } | undefined)?.title)
    .find(Boolean);

  useEffect(() => {
    document.title = title ? `${title} · VIPXFRIEND` : "VIPXFRIEND";
  }, [title]);

  return null;
}

// Scroll to top when the page (not just a query param like ?tab=) changes.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NetworkBanner() {
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-0 z-[60] bg-danger px-4 py-1.5 text-center text-xs font-medium text-white"
    >
      You're offline. Some features won't work until you reconnect.
    </div>
  );
}

export function RootLayout() {
  return (
    <>
      <RouteTitle />
      <ScrollToTop />
      <NetworkBanner />
      <Outlet />
    </>
  );
}