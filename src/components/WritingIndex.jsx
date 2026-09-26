import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { posts } from "../posts";
import { sortedPosts, fmtDate, readingTime } from "../utils/posts";
import { trackEvent } from "../utils/analytics";
import { SITE_URL, setCanonical, setMeta } from "../utils/seo";
import "../styles/blog.css";

const normalize = (str) => (str || "").toLowerCase();

const tagCounts = (() => {
  const counts = new Map();
  posts.forEach((p) => (p.tags || []).forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
})();

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark>{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const track = (slug) =>
  trackEvent({ action: "blog_index_click", category: "navigation", label: slug });

export default function WritingIndex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(() => searchParams.get("tag") || "all");
  const searchInputRef = useRef(null);

  useEffect(() => {
    document.title = "Writing | M. Moslemani";
    setMeta("name", "description", "Essays by Mohamed Moslemani on physics, philosophy, society, and the way people think.");
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", SITE_URL + "/writing");
    setCanonical(SITE_URL + "/writing");
  }, []);

  // "/" focuses search, as before.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      e.preventDefault();
      searchInputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return sortedPosts.filter((p) => {
      const matchesQuery = !q || normalize(p.title).includes(q) || normalize(p.excerpt).includes(q);
      const matchesTag = activeTag === "all" || (p.tags || []).includes(activeTag);
      return matchesQuery && matchesTag;
    });
  }, [query, activeTag]);

  const filtering = Boolean(query) || activeTag !== "all";
  const [featured, ...rest] = sortedPosts;
  const list = filtering ? filtered : rest;

  const selectTag = (t) => {
    setActiveTag(t);
    setSearchParams(t === "all" ? {} : { tag: t });
  };

  return (
    <div className="blog-index">
      <header className="wrap blog-index-head">
        <div className="section-head eyebrow">
          <span>Blogs / {posts.length} essays</span>
          <span>Physics, philosophy, society</span>
        </div>
        <h1 className="blog-index-title">
          Writing<span className="dot">.</span>
        </h1>
        <p className="blog-index-sub">
          Essays on physics, philosophy, society, and the way people think. Written since 2021.
        </p>
      </header>

      {!filtering && featured && (
        <section className="featured block-ink" aria-labelledby="featured-title">
          <div className="wrap featured-grid">
            <p className="eyebrow featured-label">Latest essay · {fmtDate(featured.date, "long")}</p>
            <h2 id="featured-title" className="featured-title">
              <Link to={`/writing/${featured.slug}`} onClick={() => track(featured.slug)}>
                {featured.title}
              </Link>
            </h2>
            <div className="featured-body">
              <p>{featured.excerpt}</p>
              <p className="eyebrow featured-meta">
                {readingTime(featured.content)} min read · {(featured.tags || []).join(" / ")}
              </p>
              <Link
                to={`/writing/${featured.slug}`}
                className="btn btn-invert"
                onClick={() => track(featured.slug)}
              >
                Read the essay<span className="sr-only">: {featured.title}</span> →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="wrap blog-archive" aria-labelledby="archive-title">
        <div className="blog-controls">
          <h2 id="archive-title" className="eyebrow">
            {filtering ? `${filtered.length} of ${posts.length} essays` : "Archive"}
          </h2>
          <div className="blog-search">
            <label htmlFor="blog-search-input" className="sr-only">
              Search posts
            </label>
            <input
              id="blog-search-input"
              ref={searchInputRef}
              type="search"
              placeholder="Search titles and excerpts"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-describedby="blog-search-hint"
            />
            <kbd id="blog-search-hint" aria-label="Press slash to focus search">/</kbd>
            {query && (
              <button
                type="button"
                className="blog-search-clear"
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
              >
                Clear<span className="sr-only"> search</span>
              </button>
            )}
          </div>
        </div>

        <div className="blog-topics" role="group" aria-label="Filter by topic">
          <button type="button" aria-pressed={activeTag === "all"} onClick={() => selectTag("all")}>
            All
          </button>
          {tagCounts.map(([t, n]) => (
            <button key={t} type="button" aria-pressed={activeTag === t} onClick={() => selectTag(t)}>
              {t}
              <span className="blog-topic-count" aria-label={`${n} posts`}>
                {n}
              </span>
            </button>
          ))}
        </div>

        <ol className="blog-list">
          {list.map((p) => (
            <li key={p.slug} className="blog-row">
              <p className="blog-row-date eyebrow">
                <time dateTime={p.date}>{fmtDate(p.date)}</time>
              </p>
              <div className="blog-row-main">
                <h3>
                  <Link to={`/writing/${p.slug}`} onClick={() => track(p.slug)}>
                    {highlight(p.title, query)}
                  </Link>
                </h3>
                <p>{highlight(p.excerpt || "", query)}</p>
              </div>
              <p className="blog-row-meta eyebrow">
                {readingTime(p.content)} min · {(p.tags || []).slice(0, 3).join(" / ")}
              </p>
            </li>
          ))}
        </ol>
        {list.length === 0 && <p className="blog-empty">No posts match your filters.</p>}
      </section>
    </div>
  );
}
