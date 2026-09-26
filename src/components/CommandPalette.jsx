import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { posts } from "../posts";
import { trackEvent } from "../utils/analytics";
import "../styles/palette.css";

import { OPEN_PALETTE_EVENT as OPEN_EVENT } from "../utils/palette";

const SECTIONS = [
  ["experience", "Experience"],
  ["services", "Services"],
  ["work", "Selected work"],
  ["education", "Education"],
  ["about", "About"],
  ["contact", "Contact"],
];

const IS_MAC =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocusRef = useRef(null);
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
        group: "Blogs",
        title: p.title,
        hint: new Date(p.date).toISOString().slice(0, 10),
        run: () => navigate(`/writing/${p.slug}`),
      })),
      {
        id: "all-writing",
        group: "Blogs",
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
        hint: "mh.moslemani@gmail.com",
        run: () => {
          window.location.href = "mailto:mh.moslemani@gmail.com";
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

  const show = useCallback(() => {
    returnFocusRef.current = document.activeElement;
    setOpen(true);
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
        if (open) close();
        else show();
        return;
      }
      if (e.key === "Escape" && open) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [open, close, show]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      const el = returnFocusRef.current;
      if (el && document.contains(el)) el.focus();
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

  const trigger = (
    <button
      type="button"
      className="cmdk-trigger"
      onClick={show}
      aria-label="Search the site (Control or Command + K)"
      aria-haspopup="dialog"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>
      <span className="cmdk-trigger-label">Search</span>
      <kbd aria-hidden="true">{IS_MAC ? "⌘K" : "Ctrl K"}</kbd>
    </button>
  );

  if (!open) return trigger;

  let lastGroup = null;

  return (
    <>
    {trigger}
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
            placeholder="Jump to a section, post, or action"
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
    </>
  );
}
