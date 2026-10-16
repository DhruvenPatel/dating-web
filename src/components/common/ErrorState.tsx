import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="grid place-items-center rounded-lg border bg-card p-10 text-center">
      <AlertCircle className="text-danger" size={32} />
      <p className="mt-3 font-medium">Something went wrong</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}