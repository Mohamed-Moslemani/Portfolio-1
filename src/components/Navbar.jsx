import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { posts } from "../posts";
import ThemeToggle from "./ThemeToggle";
import { trackEvent } from "../utils/analytics";

export default function Navbar({ activeSection, theme, toggleTheme }) {
  const featuredPosts = [...posts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  const [writingOpen, setWritingOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const writingRef = useRef(null);
  const dropdownRef = useRef(null);
  const openTimeout = useRef(null);
  const closeTimeout = useRef(null);
  const navbarRef = useRef(null);


  const openWriting = () => {
    clearTimeout(closeTimeout.current);
    openTimeout.current = setTimeout(() => setWritingOpen(true), 120);
    // Prefetch index route component
    import('./WritingIndex');
  };
  const closeWriting = () => {
    clearTimeout(openTimeout.current);
    closeTimeout.current = setTimeout(() => setWritingOpen(false), 120);
  };
  const toggleWriting = () => setWritingOpen((v) => !v);

  const onWritingKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleWriting();
    }
    if (e.key === "Escape") {
      closeWriting();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = dropdownRef.current?.querySelectorAll('.nav-dropdown-item');
      items && items[0]?.focus();
    }
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!writingOpen) return;
      const target = e.target;
      if (
        writingRef.current && !writingRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setWritingOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('touchstart', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('touchstart', onDocClick);
    };
  }, [writingOpen]);

  // Logo easter egg
  const onLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks === 5) {
      navbarRef.current?.classList.add('easter-egg-triggered');
      setTimeout(() => {
        navbarRef.current?.classList.remove('easter-egg-triggered');
        setLogoClicks(0);
      }, 800);
    }
  };

  return (
    <nav ref={navbarRef} className="navbar" role="navigation" aria-label="Main navigation">
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="Home - M. Moslemani" onClick={onLogoClick}>
          <span className="logo-m logo-m-1" aria-hidden="true">M</span>
          <span className="logo-m logo-m-2" aria-hidden="true">M</span>
          <span className="logo-slash" aria-hidden="true">/</span>
        </Link>

        <div className="nav-links" role="menubar">
          <a href="#work" className={activeSection === "work" ? "active" : ""} role="menuitem" aria-current={activeSection === "work" ? "page" : undefined}>
            <span>Work</span>
          </a>
          <a href="#experience" className={activeSection === "experience" ? "active" : ""} role="menuitem" aria-current={activeSection === "experience" ? "page" : undefined}>
            <span>Experience</span>
          </a>
          <div
            className="nav-writing"
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={writingOpen ? "true" : "false"}
            tabIndex={0}
            onMouseEnter={openWriting}
            onMouseLeave={closeWriting}
            onFocus={openWriting}
            onKeyDown={onWritingKeyDown}
            onClick={toggleWriting}
            ref={writingRef}
          >
            <span>Blogs</span>
            <span className={`nav-caret ${writingOpen ? 'open' : ''}`} aria-hidden="true">▾</span>
            <div ref={dropdownRef} className={`nav-dropdown ${writingOpen ? 'open' : ''}`} role="menu" aria-label="Available blogs">
              <div className="nav-backdrop" aria-hidden="true" onClick={closeWriting}></div>
              <Link
                to="/writing"
                role="menuitem"
                className="nav-dropdown-item nav-dropdown-viewall"
                onClick={() => {
                  trackEvent({ action: 'nav_blog_index', category: 'navigation', label: 'view_all' });
                  closeWriting();
                }}
              >
                <span className="nav-dropdown-title">Browse all blogs</span>
                <span className="nav-dropdown-date">Browse index</span>
              </Link>
              <div className="nav-dropdown-separator" aria-hidden="true"></div>
              {featuredPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/writing/${post.slug}`}
                  role="menuitem"
                  className="nav-dropdown-item"
                  onClick={() => {
                    trackEvent({ action: 'nav_blog_click', category: 'navigation', label: post.slug });
                    closeWriting();
                  }}
                  onMouseEnter={() => {
                    // Prefetch route components
                    import('../components/BlogPage');
                  }}
                  onKeyDown={(e) => {
                    const items = dropdownRef.current?.querySelectorAll('.nav-dropdown-item');
                    if (!items) return;
                    const arr = Array.from(items);
                    const idx = arr.indexOf(e.currentTarget);
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      arr[idx + 1]?.focus();
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      arr[idx - 1]?.focus();
                    }
                  }}
                >
                  <span className="nav-dropdown-title">{post.title}</span>
                  <span className="nav-dropdown-date">{new Date(post.date).toLocaleDateString()}</span>
                  {post.tags?.length ? (
                    <div className="nav-dropdown-tags" aria-hidden="true">
                      {post.tags.map((tag) => (
                        <span key={tag} className="nav-dropdown-tag">{tag}</span>
                      ))}
                    </div>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
          <a href="#about" className={activeSection === "about" ? "active" : ""} role="menuitem" aria-current={activeSection === "about" ? "page" : undefined}>
            <span>About</span>
          </a>
          <a href="#contact" className={activeSection === "contact" ? "active" : ""} role="menuitem" aria-current={activeSection === "contact" ? "page" : undefined}>
            <span>Contact</span>
          </a>
        </div>

        <div className="nav-actions">
          <a 
            href="/resume.pdf" 
            download="M_Moslemani_Resume.pdf"
            className="resume-btn"
            aria-label="Download resume"
            onClick={() => trackEvent({ action: 'resume_download', category: 'outbound', label: 'resume.pdf' })}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Resume</span>
          </a>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  );
}
