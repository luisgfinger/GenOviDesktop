export function DateToIsoString(datetimeLocal: string): string {
  if (!datetimeLocal) return "";

  const date = new Date(datetimeLocal);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);

  return local.toISOString().slice(0, 19);
}
