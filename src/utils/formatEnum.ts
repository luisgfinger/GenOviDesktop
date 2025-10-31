export function formatEnum(value?: string) {
  if (!value) return "";
  return value.toLowerCase().replace(/_/g, " ");
}

