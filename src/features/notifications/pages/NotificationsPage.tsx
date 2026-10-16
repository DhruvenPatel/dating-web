import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BellOff, CheckCheck, Loader2, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs } from "@/components/ui/Tabs";
import { useInView } from "@/hooks/useInView";
import { getErrorMessage } from "@/lib/errors";
import { NotificationItem } from "../components/NotificationItem";
import { PreferencesPanel } from "../components/PreferencesPanel";
import {
  useDeleteAllNotifications,
  useMarkAllRead,
  useNotificationUnreadCount,
  useNotifications,
} from "../hooks";

type Tab = "all" | "unread" | "preferences";

export function NotificationsPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("tab");
  const tab: Tab = raw === "unread" || raw === "preferences" ? raw : "all";

  const unreadCount = useNotificationUnreadCount().data ?? 0;
  const list = useNotifications(tab === "unread");
  const markAll = useMarkAllRead();
  const deleteAll = useDeleteAllNotifications();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const items = useMemo(
    () => list.data?.pages.flatMap((p) => p.notifications) ?? [],
    [list.data],
  );

  const sentinel = useInView(
    () => list.fetchNextPage(),
    tab !== "preferences" && !!list.hasNextPage && !list.isFetchingNextPage,
  );

  const tabs: { value: Tab; label: string }[] = [
    { value: "all", label: "All" },
    { value: "unread", label: `Unread${unreadCount ? ` (${unreadCount})` : ""}` },
    { value: "preferences", label: "Preferences" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground">Stay up to date with your friends.</p>
        </div>

        {tab !== "preferences" && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={unreadCount === 0}
              loading={markAll.isPending}
              onClick={() => markAll.mutate()}
            >
              <CheckCheck size={14} /> Mark all read
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={items.length === 0}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 size={14} /> Delete all
            </Button>
          </div>
        )}
      </div>

      <Tabs
        tabs={tabs}
        value={tab}
        onChange={(t) => setParams(t === "all" ? {} : { tab: t }, { replace: true })}
      />

      {tab === "preferences" ? (
        <PreferencesPanel />
      ) : list.isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-[76px]" />
          ))}
        </div>
      ) : list.isError ? (
        <ErrorState message={getErrorMessage(list.error)} onRetry={() => list.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BellOff size={32} />}
          title={tab === "unread" ? "You're all caught up" : "No notifications yet"}
          hint={
            tab === "unread"
              ? "You have no unread notifications."
              : "Friend requests and acceptances will show up here."
          }
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="divide-y overflow-hidden rounded-lg border bg-card">
            {items.map((n) => (
              <NotificationItem key={n._id} notification={n} />
            ))}
          </div>
          <div ref={sentinel} className="grid h-14 place-items-center">
            {list.isFetchingNextPage && (
              <Loader2 className="animate-spin text-muted-foreground" />
            )}
          </div>
        </motion.div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete all notifications?"
        description="Every notification will be permanently removed. This can't be undone."
        confirmLabel="Delete all"
        loading={deleteAll.isPending}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => deleteAll.mutate(undefined, { onSettled: () => setConfirmDelete(false) })}
      />
    </div>
  );
}