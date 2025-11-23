// utils.js

export function formatToIST(utcString) {
  if (!utcString) return "Never";

  const date = new Date(utcString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return "Invalid Date";

  // Add 5 hours and 30 minutes (IST = UTC+5:30)
  const istDate = new Date(date.getTime() + (5.5 * 60 * 60 * 1000));

  // Format the date
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  };

  return istDate.toLocaleString("en-IN", options);
}
