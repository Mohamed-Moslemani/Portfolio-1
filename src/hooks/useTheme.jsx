import { useCallback, useEffect, useState } from "react";

/* New key: the previous implementation wrote "dark" for every first-time
   visitor, so the old key can't distinguish a real choice from a default. */
const KEY = "mm-theme";

const readSaved = () => {
  try {
    const v = localStorage.getItem(KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
};

export function useTheme() {
  const [theme, setTheme] = useState(() => readSaved() || "light");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#141715" : "#e9e5dc");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* storage unavailable: choice lasts for this page view only */
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
}
