export function formatDateTime(dateString) {
  const date = new Date(dateString);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-IN", options);
}
