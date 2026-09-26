import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import CommandPalette from "./CommandPalette";
import { openCommandPalette } from "../utils/palette";
import { NAV_SECTIONS } from "../data/nav";
import { sortedPosts, fmtDate } from "../utils/posts";
import { trackEvent } from "../utils/analytics";

const latestPosts = sortedPosts.slice(0, 3);

const trackResume = () =>
  trackEvent({ action: "resume_download", category: "outbound", label: "resume.pdf" });

export default function Navbar({ activeSection, theme, toggleTheme }) {
  const [blogsOpen, setBlogsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const blogsRef = useRef(null);
  const blogsBtnRef = useRef(null);
  const hoverTimer = useRef(null);
  const menuBtnRef = useRef(null);
  const panelRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const onWriting = location.pathname.startsWith("/writing");

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuBtnRef.current?.focus());
  }, []);

  const goToSection = (e, id) => {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/#" + id);
    }
  };

  /* ---- Blogs disclosure ------------------------------------------------ */
  useEffect(() => {
    if (!blogsOpen) return;
    const onDown = (e) => {
      if (!blogsRef.current?.contains(e.target)) setBlogsOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setBlogsOpen(false);
        blogsBtnRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [blogsOpen]);

  const hoverCapable = () => window.matchMedia("(hover: hover)").matches;
  const onBlogsEnter = () => {
    if (!hoverCapable()) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setBlogsOpen(true), 120);
    import("./WritingIndex");
  };
  const onBlogsLeave = () => {
    if (!hoverCapable()) return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setBlogsOpen(false), 180);
  };

  /* ---- Mobile menu: scroll lock, focus trap, escape --------------------- */
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusables = () =>
      panel.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusables()[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1180) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen, closeMenu]);

  const isCurrent = (s) =>
    s.to ? onWriting : location.pathname === "/" && activeSection === s.id;

  return (
    <header className="nav" role="banner">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="nav-inner">
        <Link
          to="/"
          className="nav-brand"
          aria-label="Mohamed Moslemani, home"
          onClick={() => location.pathname === "/" && window.scrollTo({ top: 0 })}
        >
          m<span>.</span>m
        </Link>

        <nav className="nav-primary" aria-label="Primary">
          <ul className="nav-links">
            {NAV_SECTIONS.map((s) =>
              s.to ? (
                <li
                  key={s.id}
                  ref={blogsRef}
                  className="nav-blogs"
                  onMouseEnter={onBlogsEnter}
                  onMouseLeave={onBlogsLeave}
                >
                  <Link
                    to={s.to}
                    className="nav-link"
                    aria-current={isCurrent(s) ? "page" : undefined}
                    onClick={() =>
                      trackEvent({ action: "nav_blog_index", category: "navigation", label: "nav" })
                    }
                  >
                    {s.label}
                  </Link>
                  <button
                    ref={blogsBtnRef}
                    type="button"
                    className="nav-caret"
                    aria-expanded={blogsOpen}
                    aria-controls="nav-blogs-panel"
                    aria-label="Latest blog posts"
                    onClick={() => setBlogsOpen((v) => !v)}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </button>
                  <div id="nav-blogs-panel" className="nav-dropdown" hidden={!blogsOpen}>
                    <p className="eyebrow nav-dropdown-label">Latest</p>
                    <ul>
                      {latestPosts.map((p) => (
                        <li key={p.slug}>
                          <Link
                            to={`/writing/${p.slug}`}
                            className="nav-dropdown-item"
                            onMouseEnter={() => import("./BlogPage")}
                            onClick={() => {
                              setBlogsOpen(false);
                              trackEvent({ action: "nav_blog_click", category: "navigation", label: p.slug });
                            }}
                          >
                            <span className="nav-dropdown-title">{p.title}</span>
                            <span className="nav-dropdown-date">{fmtDate(p.date)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to="/writing"
                      className="nav-dropdown-all"
                      onClick={() => {
                        setBlogsOpen(false);
                        trackEvent({ action: "nav_blog_index", category: "navigation", label: "view_all" });
                      }}
                    >
                      All posts and topics →
                    </Link>
                  </div>
                </li>
              ) : (
                <li key={s.id}>
                  <a
                    href={`/#${s.id}`}
                    className="nav-link"
                    aria-current={isCurrent(s) ? "location" : undefined}
                    onClick={(e) => goToSection(e, s.id)}
                  >
                    {s.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        <div className="nav-actions">
          <CommandPalette />
          <a
            href="/resume.pdf"
            download="Mohamed_Moslemani_CV.pdf"
            className="nav-resume"
            onClick={trackResume}
          >
            Resume<span aria-hidden="true"> ↓</span>
            <span className="sr-only"> (PDF download)</span>
          </a>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            ref={menuBtnRef}
            type="button"
            className="nav-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="nav-mobile-panel"
            onClick={() => setMenuOpen(true)}
          >
            Menu
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="nav-mobile-panel"
          className="nav-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          ref={panelRef}
        >
          <div className="nav-panel-top">
            <span className="nav-brand" aria-hidden="true">
              m<span>.</span>m
            </span>
            <button type="button" className="nav-menu-btn is-close" onClick={() => closeMenu()}>
              Close
            </button>
          </div>
          <nav aria-label="Site menu">
            <ol className="nav-panel-links">
              {NAV_SECTIONS.map((s, i) => (
                <li key={s.id}>
                  {s.to ? (
                    <Link
                      to={s.to}
                      aria-current={isCurrent(s) ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </Link>
                  ) : (
                    <a href={`/#${s.id}`} onClick={(e) => goToSection(e, s.id)}>
                      <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                      {s.label}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <div className="nav-panel-actions">
            <a href="/resume.pdf" download="Mohamed_Moslemani_CV.pdf" className="btn btn-solid" onClick={trackResume}>
              Download resume (PDF)
            </a>
            <button
              type="button"
              className="btn btn-line"
              onClick={() => {
                closeMenu(false);
                openCommandPalette();
              }}
            >
              Search the site
            </button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} withLabel />
          </div>
        </div>
      )}
    </header>
  );
}
