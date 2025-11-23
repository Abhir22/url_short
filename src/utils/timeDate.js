// utils.js

export function formatToIST(utcString) {
  if (!utcString) return "Never";

  const date = new Date(utcString);

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}
