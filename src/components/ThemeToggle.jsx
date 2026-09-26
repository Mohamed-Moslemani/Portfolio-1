export default function ThemeToggle({ theme, toggleTheme, withLabel = false }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className={`theme-toggle${withLabel ? " btn btn-line" : ""}`}
      onClick={toggleTheme}
      aria-label={withLabel ? undefined : `Switch to ${next} theme`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${next} theme`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.75a6.25 6.25 0 0 1 0 12.5z" fill="currentColor" />
      </svg>
      {withLabel && <span>Dark theme: {theme === "dark" ? "on" : "off"}</span>}
    </button>
  );
}
