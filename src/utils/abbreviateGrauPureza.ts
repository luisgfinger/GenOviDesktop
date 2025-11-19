export function abbreviateGrauPureza(value?: string): string {
  if (!value) return "";

  const ignore = ["por", "de", "da", "do", "das", "dos"];

  return value
    .split(" ")
    .filter(word => !ignore.includes(word.toLowerCase()))
    .map(word => word.charAt(0).toUpperCase())
    .join("");
}
