import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { posts } from "../posts";
import { trackEvent } from "../utils/analytics";
import "../styles/command-palette.css";

const SECTIONS = [
  ["services", "Services"],
  ["work", "Case Studies"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["about", "About"],
  ["contact", "Contact"],
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const navigate = useNavigate();

  const commands = useMemo(() => {
    const go = (hash) => () => {
      navigate("/");
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      });
    };

    return [
      ...SECTIONS.map(([id, title]) => ({
        id: `nav-${id}`,
        group: "Navigate",
        title,
        hint: `/#${id}`,
        run: go(id),
      })),
      ...posts.map((p) => ({
        id: `post-${p.slug}`,
        group: "Writing",
        title: p.title,
        hint: new Date(p.date).toISOString().slice(0, 10),
        run: () => navigate(`/writing/${p.slug}`),
      })),
      {
        id: "all-writing",
        group: "Writing",
        title: "Browse all posts",
        hint: "/writing",
        run: () => navigate("/writing"),
      },
      {
        id: "book",
        group: "Actions",
        title: "Book a consultation",
        hint: "calendly",
        run: () =>
          window.open("https://calendly.com/moslemanomohamed", "_blank", "noreferrer"),
      },
      {
        id: "resume",
        group: "Actions",
        title: "Download résumé",
        hint: "pdf",
        run: () => window.open("/resume.pdf", "_blank", "noreferrer"),
      },
      {
        id: "email",
        group: "Actions",
        title: "Send an email",
        hint: "moslemanomohamed@gmail.com",
        run: () => {
          window.location.href = "mailto:moslemanomohamed@gmail.com";
        },
      },
      {
        id: "github",
        group: "Actions",
        title: "GitHub profile",
        hint: "mohamed-moslemani",
        run: () =>
          window.open("https://github.com/mohamed-moslemani", "_blank", "noreferrer"),
      },
      {
        id: "linkedin",
        group: "Actions",
        title: "LinkedIn profile",
        hint: "mohamed-moslemani",
        run: () =>
          window.open(
            "https://www.linkedin.com/in/mohamed-moslemani/",
            "_blank",
            "noreferrer"
          ),
      },
    ];
  }, [navigate]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.title} ${c.group} ${c.hint}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setCursor(0);
  }, []);

  const runAt = useCallback(
    (index) => {
      const cmd = results[index];
      if (!cmd) return;
      trackEvent({ action: "command_palette_run", category: "navigation", label: cmd.id });
      close();
      cmd.run();
    },
    [results, close]
  );

  // Global open/close shortcut.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const onInputKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(cursor);
    }
  };

  if (!open) {
    return (
      <button
        className="cmdk-trigger mono"
        onClick={() => setOpen(true)}
        aria-label="Open command palette"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <kbd>⌘K</kbd>
      </button>
    );
  }

  let lastGroup = null;

  return (
    <div className="cmdk-scrim" onMouseDown={close} role="presentation">
      <div
        className="cmdk"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmdk-input-row">
          <span className="cmdk-prompt mono" aria-hidden="true">&gt;</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Jump to a section, post, or action…"
            aria-label="Search commands"
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>esc</kbd>
        </div>

        <div className="cmdk-list" ref={listRef} role="listbox" aria-label="Commands">
          {results.length === 0 && (
            <p className="cmdk-empty mono">no matches</p>
          )}
          {results.map((cmd, i) => {
            const showGroup = cmd.group !== lastGroup;
            lastGroup = cmd.group;
            return (
              <div key={cmd.id}>
                {showGroup && <div className="cmdk-group label">{cmd.group}</div>}
                <button
                  className="cmdk-item"
                  data-active={i === cursor}
                  role="option"
                  aria-selected={i === cursor}
                  onMouseMove={() => setCursor(i)}
                  onClick={() => runAt(i)}
                >
                  <span className="cmdk-item-title">{cmd.title}</span>
                  <span className="cmdk-item-hint mono">{cmd.hint}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="cmdk-foot mono">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
