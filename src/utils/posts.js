import { posts } from "../posts";

export const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

export const fmtDate = (d, month = "short") =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month, year: "numeric" });

export const readingTime = (content = "") => {
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
};
