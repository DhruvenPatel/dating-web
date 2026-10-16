import { useState } from "react";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useBlockUser, useIsBlocked, useUnblockUser, type BlockTarget } from "../hooks";

interface BlockButtonProps {
  target: BlockTarget;
  variant?: "icon" | "button";
}

export function BlockButton({ target, variant = "icon" }: BlockButtonProps) {
  const isBlocked = useIsBlocked(target.id);
  const block = useBlockUser();
  const unblock = useUnblockUser();
  const [open, setOpen] = useState(false);

  if (isBlocked) {
    return (
      <Button
        variant="outline"
        size="sm"
        loading={unblock.isPending}
        onClick={() => unblock.mutate(target.id)}
      >
        Unblock
      </Button>
    );
  }

  return (
    <>
      {variant === "icon" ? (
        <button
          onClick={() => setOpen(true)}
          aria-label={`Block ${target.name}`}
          title="Block"
          className="grid h-9 w-9 place-items-center rounded-lg border bg-card text-muted-foreground transition hover:border-danger hover:text-danger"
        >
          <Ban size={16} />
        </button>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Ban size={14} /> Block
        </Button>
      )}

      <ConfirmDialog
        open={open}
        title={`Block ${target.name}?`}
        description="They'll be removed from your matches, any pending like will be cancelled, and you won't see each other in Discover."
        confirmLabel="Block"
        loading={block.isPending}
        onCancel={() => setOpen(false)}
        onConfirm={() => block.mutate(target, { onSettled: () => setOpen(false) })}
      />
    </>
  );
}