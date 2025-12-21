import "../styles/theme-toggle.css";

export default function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-track">
        <span className="theme-icon sun-icon">☀️</span>
        <span className="theme-icon moon-icon">🌙</span>
        <div className={`theme-toggle-thumb ${theme === 'light' ? 'light' : 'dark'}`}></div>
      </div>
    </button>
  );
}
