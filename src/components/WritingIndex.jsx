import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { posts } from "../posts";
import { trackEvent } from "../utils/analytics";
import "../styles/blog-index.css";

const ensureCanonical = (href) => {
  if (typeof document === 'undefined') return;
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
};

function normalize(str) {
  return (str || "").toLowerCase();
}

export default function WritingIndex() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchInputRef = useRef(null);

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return ["all", ...Array.from(tags).sort()];
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.title = "Writing | M. Moslemani";
    const origin = window.location.origin;
    ensureCanonical(origin + "/writing");
  }, [searchParams]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const tagParam = searchParams.get('tag');
    if (tagParam) setActiveTag(tagParam);
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return posts.filter((p) => {
      const matchesQuery = !q || normalize(p.title).includes(q) || normalize(p.excerpt).includes(q);
      const matchesTag = activeTag === "all" || (p.tags || []).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  return (
    <section className="blog-index" aria-label="Writing index">
      <header className="blog-index-header">
        <h1>Writing</h1>
        <p className="blog-index-subtitle">Essays on AI systems, ML in production, and making research useful.</p>
        <div className="blog-index-controls">
          <div className="blog-search-wrap">
            <input
              ref={searchInputRef}
              type="search"
              className="blog-search"
              placeholder="Search posts... ( / to focus )"
              aria-label="Search posts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="button"
              className={`blog-search-clear ${query ? 'visible' : ''}`}
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                searchInputRef.current?.focus();
              }}
            >
              x
            </button>
          </div>
          <div className="blog-tags" role="list" aria-label="Filter by tag">
            {allTags.map((t) => (
              <button
                key={t}
                className={`tag-chip ${activeTag === t ? "active" : ""}`}
                onClick={() => {
                  setActiveTag(t);
                  setSearchParams(t === 'all' ? {} : { tag: t });
                }}
                role="listitem"
                aria-pressed={activeTag === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="blog-index-list" role="list">
        {filtered.map((p) => (
          <Link
            key={p.slug}
            to={`/writing/${p.slug}`}
            className="blog-index-card"
            role="listitem"
            onClick={() => trackEvent({ action: 'blog_index_click', category: 'navigation', label: p.slug })}
          >
            <div className="blog-card-content">
              <h2 className="blog-card-title">{highlight(p.title, query)}</h2>
              <p className="blog-card-excerpt">{highlight(p.excerpt, query)}</p>
              <div className="blog-card-meta">
                <span className="blog-card-date">{new Date(p.date).toLocaleDateString()}</span>
                <div className="blog-card-tags">
                  {(p.tags || []).map((t) => (
                    <span key={t} className="blog-card-tag">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <span className="blog-card-arrow">→</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="blog-empty">No posts match your filters.</div>
        )}
      </div>
    </section>
  );
}

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + query.length);
  const after = text.slice(idx + query.length);
  return (
    <>
      {before}
      <mark>{match}</mark>
      {after}
    </>
  );
}
