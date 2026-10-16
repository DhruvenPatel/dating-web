export function personName(
  p: { display_name?: string | null; full_name?: string | null; username?: string | null } | null | undefined,
): string {
  return p?.display_name || p?.full_name || p?.username || "Unknown user";
}