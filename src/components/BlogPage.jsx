import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { sortedPosts, fmtDate, readingTime } from "../utils/posts";
import { trackEvent } from "../utils/analytics";
import { SITE_URL, setCanonical, setMeta, setJsonLd } from "../utils/seo";
import "../styles/blog.css";

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const renderContent = (raw) => {
  if (!raw) return "";
  if (/<[a-z][\s\S]*>/i.test(raw)) return raw;
  const blocks = raw.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const html = [];
  let listBuf = [];
  const flushList = () => {
    if (listBuf.length) {
      html.push("<ul>" + listBuf.map((li) => `<li>${escapeHtml(li)}</li>`).join("") + "</ul>");
      listBuf = [];
    }
  };
  for (const block of blocks) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const allBullets = lines.length > 0 && lines.every((l) => /^[-*]\s+/.test(l));
    if (allBullets) {
      lines.forEach((l) => listBuf.push(l.replace(/^[-*]\s+/, "")));
      continue;
    }
    flushList();
    // Markdown ATX headings. h1 is reserved for the post title, so # and ## map to h2.
    const atx = block.match(/^(#{1,4})\s+(.+)$/);
    if (atx && !/\n/.test(block)) {
      const level = Math.min(Math.max(atx[1].length, 2), 4);
      html.push(`<h${level}>${escapeHtml(atx[2].trim())}</h${level}>`);
      continue;
    }
    if (block.startsWith("> ")) {
      const inner = block.replace(/^>\s?/gm, "").trim();
      html.push(`<blockquote><p>${escapeHtml(inner)}</p></blockquote>`);
      continue;
    }
    const wordCount = block.split(/\s+/).length;
    const endsLikeSentence = /[.!?…]"?$/.test(block);
    const isHeading = block.length <= 100 && wordCount <= 14 && !endsLikeSentence && !/\n/.test(block);
    if (isHeading) {
      html.push(`<h2>${escapeHtml(block)}</h2>`);
    } else {
      const inner = block.split("\n").map((l) => escapeHtml(l)).join("<br/>");
      html.push(`<p>${inner}</p>`);
    }
  }
  flushList();
  return html.join("\n");
};

// Inject heading ids and collect the table of contents.
const buildArticle = (raw) => {
  const toc = [];
  const seen = new Map();
  const html = renderContent(raw).replace(/<h([23])>(.*?)<\/h\1>/gi, (m, level, text) => {
    // Same slug rule as the previous site so existing #anchors keep working.
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$|--+/g, "-");
    const n = seen.get(id) || 0;
    seen.set(id, n + 1);
    if (n) id = `${id}-${n + 1}`;
    toc.push({ id, text, level: Number(level) });
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
  return { html, toc };
};

const decodeEntities = (s) =>
  s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

export default function BlogPage() {
  const { slug } = useParams();
  const location = useLocation();
  const index = sortedPosts.findIndex((p) => p.slug === slug);
  const post = index >= 0 ? sortedPosts[index] : null;
  const newer = index > 0 ? sortedPosts[index - 1] : null;
  const older = index >= 0 && index < sortedPosts.length - 1 ? sortedPosts[index + 1] : null;

  const { html, toc } = useMemo(() => buildArticle(post?.content), [post]);
  const minutes = useMemo(() => readingTime(post?.content), [post]);

  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [coverFailed, setCoverFailed] = useState(null);
  const scrollMilestones = useRef({});

  const canonicalUrl = SITE_URL + location.pathname;

  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(canonicalUrl);
      setShareMessage("Link copied");
      trackEvent({ action: "blog_share_copy", category: "engagement", label: slug });
    } catch {
      setShareMessage("Copy failed");
    }
    setTimeout(() => setShareMessage(""), 1500);
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, text: post?.excerpt || post?.title, url: canonicalUrl });
        trackEvent({ action: "blog_share_native", category: "engagement", label: slug });
      } else {
        await onCopyLink();
      }
    } catch {
      // user cancelled share
    }
  };

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = Math.max(1, el.offsetHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, (window.scrollY - top) / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  // Copy buttons on code blocks
  useEffect(() => {
    contentRef.current?.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector(".code-copy")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = "Copy";
      btn.addEventListener("click", () => {
        const code = pre.querySelector("code")?.innerText || pre.innerText;
        navigator.clipboard.writeText(code);
        btn.textContent = "Copied";
        setTimeout(() => (btn.textContent = "Copy"), 1500);
      });
      pre.appendChild(btn);
    });
  }, [html]);

  // Per-post SEO
  useEffect(() => {
    if (!post) {
      document.title = "Post Not Found | M. Moslemani";
      return;
    }
    const desc = post.excerpt || "Blog post";
    const image = post.cover ? SITE_URL + post.cover : null;
    document.title = `${post.title} | M. Moslemani`;
    setMeta("name", "description", desc);
    setMeta("property", "og:title", post.title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:url", canonicalUrl);
    if (image) setMeta("property", "og:image", image);
    setMeta("property", "twitter:card", "summary_large_image");
    setMeta("property", "twitter:title", post.title);
    setMeta("property", "twitter:description", desc);
    if (image) setMeta("property", "twitter:image", image);
    setCanonical(canonicalUrl);

    setJsonLd("ld-article", {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      datePublished: post.date,
      author: { "@type": "Person", name: "M. Moslemani" },
      description: desc,
      mainEntityOfPage: canonicalUrl,
      ...(image ? { image } : {}),
    });
    setJsonLd("ld-breadcrumb", {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "Writing", item: SITE_URL + "/writing" },
        { "@type": "ListItem", position: 3, name: post.title, item: canonicalUrl },
      ],
    });
    return () => {
      document.getElementById("ld-article")?.remove();
      document.getElementById("ld-breadcrumb")?.remove();
    };
  }, [post, canonicalUrl]);

  // Scroll-depth analytics
  useEffect(() => {
    if (!post) return;
    const pct = Math.round(progress * 100);
    const seen = (scrollMilestones.current[slug] ||= {});
    [25, 50, 75, 100].forEach((mark) => {
      if (!seen[mark] && pct >= mark) {
        seen[mark] = true;
        trackEvent({ action: "blog_scroll_depth", category: "engagement", label: `${mark}%`, value: mark });
      }
    });
  }, [progress, post, slug]);

  if (!post) {
    return (
      <div className="wrap article-missing">
        <p className="eyebrow">404 / Blogs</p>
        <h1 className="blog-index-title">Post not found<span className="dot">.</span></h1>
        <p>The blog you are looking for doesn't exist.</p>
        <div className="article-missing-actions">
          <Link to="/writing" className="btn btn-solid">Browse writing</Link>
          <Link to="/" className="btn btn-line">Back to portfolio</Link>
        </div>
      </div>
    );
  }

  const showCover = post.cover && coverFailed !== post.cover;

  return (
    <article className="article" aria-labelledby="article-title">
      <div className="reading-progress" aria-hidden="true">
        <div className="reading-progress-bar" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <header className="wrap article-head">
        <nav className="article-crumbs eyebrow" aria-label="Breadcrumb">
          <Link to="/" className="link-under">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/writing" className="link-under">Blogs</Link>
        </nav>
        <h1 id="article-title" className="article-title">{post.title}</h1>
        <div className="article-meta">
          {post.excerpt && <p className="article-dek">{post.excerpt}</p>}
          <dl className="article-facts eyebrow">
            <div>
              <dt>Published</dt>
              <dd><time dateTime={post.date}>{fmtDate(post.date, "long")}</time></dd>
            </div>
            {post.updated && (
              <div>
                <dt>Updated</dt>
                <dd><time dateTime={post.updated}>{fmtDate(post.updated, "long")}</time></dd>
              </div>
            )}
            <div>
              <dt>Reading time</dt>
              <dd>{minutes} min</dd>
            </div>
            {post.tags?.length > 0 && (
              <div>
                <dt>Topics</dt>
                <dd>
                  {post.tags.map((t, i) => (
                    <span key={t}>
                      {i > 0 && " / "}
                      <Link to={`/writing?tag=${encodeURIComponent(t)}`} className="link-under">{t}</Link>
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </header>

      {showCover && (
        <figure className="wrap article-cover">
          <img src={post.cover} alt="" loading="lazy" onError={() => setCoverFailed(post.cover)} />
        </figure>
      )}

      <div className="wrap article-layout">
        <aside className="article-aside" aria-label="Article tools">
          <div className="article-share">
            <button type="button" className="link-under" onClick={onShare}>Share</button>
            <button type="button" className="link-under" onClick={onCopyLink}>Copy link</button>
            <span className="eyebrow" role="status" aria-live="polite">{shareMessage}</span>
          </div>
          {toc.length > 1 && (
            <nav className="article-toc" aria-label="On this page">
              <p className="eyebrow">On this page</p>
              <ol>
                {toc.map((t) => (
                  <li key={t.id} className={`toc-l${t.level}`}>
                    <a href={`#${t.id}`}>{decodeEntities(t.text)}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}
        </aside>

        <div ref={contentRef} className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      <footer className="wrap article-foot">
        <nav className="article-pager" aria-label="More essays">
          {older ? (
            <Link to={`/writing/${older.slug}`} className="pager-link">
              <span className="eyebrow">← Previous essay</span>
              <span className="pager-title">{older.title}</span>
            </Link>
          ) : <span />}
          {newer ? (
            <Link to={`/writing/${newer.slug}`} className="pager-link is-next">
              <span className="eyebrow">Next essay →</span>
              <span className="pager-title">{newer.title}</span>
            </Link>
          ) : <span />}
        </nav>
        <div className="article-foot-actions">
          <Link to="/writing" className="btn btn-solid">All essays</Link>
          <Link to="/" className="btn btn-line">Back to portfolio</Link>
        </div>
      </footer>
    </article>
  );
}
