import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorScreenProps {
  title: string;
  message: string;
  children?: ReactNode; // action buttons
}

export function ErrorScreen({ title, message, children }: ErrorScreenProps) {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center">
        <AlertTriangle className="mx-auto text-danger" size={36} />
        <h1 className="mt-4 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        {children && <div className="mt-6 flex justify-center gap-2">{children}</div>}
      </div>
    </div>
  );
}