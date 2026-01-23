// utils/date.ts
export function formatDateShort(value: string | Date) {
  if (!value) {
    return "";
  }
  try {
    return new Intl.DateTimeFormat("en-US").format(new Date(value));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
