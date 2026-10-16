export function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          VIP<span className="text-primary">X</span>FRIEND
        </h1>
        <div className="mx-auto mt-5 h-1 w-24 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </div>
  );
}