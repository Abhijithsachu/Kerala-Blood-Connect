export const formatDate = (value, fallback = "Not provided") => {
  if (!value) return fallback;
  return new Date(value).toLocaleDateString("en-GB");
};

export const formatDateTime = (value, fallback = "Not provided") => {
  if (!value) return fallback;
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
