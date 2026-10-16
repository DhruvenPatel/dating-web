import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-center">
      <div>
        <p className="text-6xl font-bold tracking-tight text-primary">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}