export const truncateText = (text = "", maxLength = 24) => {
  if (!text || typeof text !== "string") return "";
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};
