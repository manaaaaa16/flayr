export function haptic(type: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  const patterns = { light: 8, medium: 15, heavy: 25 };
  navigator.vibrate(patterns[type]);
}
