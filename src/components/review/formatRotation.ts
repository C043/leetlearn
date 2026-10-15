/** "Sat, Oct 17" in the viewer's locale. */
export function formatRotation(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
