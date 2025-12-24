import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { posts } from "../posts/index";
import { trackEvent } from "../utils/analytics";
import "../styles/blog.css";

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

const setJsonLd = (id, data) => {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export default function BlogPage() {
  const { slug } = useParams();
  const postRaw = posts.find((p) => p.slug === slug);
  const [post, setPost] = useState(postRaw);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const contentRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [toc, setToc] = useState([]);
  const location = useLocation();
  const scrollMilestones = useRef({ 25: false, 50: false, 75: false, 100: false });

  const readingTimeMinutes = useMemo(() => {
    if (!post?.content) return 0;
    const text = post.content.replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 225));
  }, [post]);

  useEffect(() => {
    setCoverLoaded(false);
  }, [slug]);

  const url = typeof window !== 'undefined' ? window.location.href : '';
  const onCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage('Link copied');
      trackEvent({ action: 'blog_share_copy', category: 'engagement', label: slug });
    } catch (err) {
      setShareMessage('Copy failed');
    }
    setTimeout(() => setShareMessage(''), 1500);
  };

  const onShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post?.title, text: post?.excerpt || post?.title, url });
        trackEvent({ action: 'blog_share_native', category: 'engagement', label: slug });
      } else {
        await onCopyLink();
      }
    } catch (err) {
      // user cancelled share
    }
  };

  useEffect(() => {
    const onScroll = () => {
      if (!contentRef.current) return;
      const top = contentRef.current.offsetTop;
      const height = contentRef.current.offsetHeight;
      const scrolled = window.scrollY - top;
      const max = Math.max(1, height - window.innerHeight);
      const pct = Math.min(1, Math.max(0, scrolled / max));
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!postRaw?.content) return;
    // Inject IDs into headings and build table of contents
    let html = postRaw.content;
    const tocItems = [];
    html = html.replace(/<h([23])>(.*?)<\/h\1>/gi, (m, level, text) => {
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$|--+/g, '-');
      tocItems.push({ id, text, level: Number(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
    setToc(tocItems);
    setPost({ ...postRaw, content: html });

    // Enhance code blocks with copy buttons
    setTimeout(() => {
      const blocks = contentRef.current?.querySelectorAll('pre');
      blocks?.forEach((pre) => {
        if (pre.querySelector('.code-copy')) return;
        const btn = document.createElement('button');
        btn.className = 'code-copy';
        btn.innerText = 'Copy';
        btn.addEventListener('click', () => {
          const code = pre.querySelector('code')?.innerText || pre.innerText;
          navigator.clipboard.writeText(code);
          btn.innerText = 'Copied!';
          setTimeout(() => (btn.innerText = 'Copy'), 1500);
        });
        pre.style.position = 'relative';
        pre.appendChild(btn);
      });
    }, 0);
  }, [slug]);

  // Minimal per-post SEO tags (no external deps)
  useEffect(() => {
    if (!post) return;
    const origin = window.location.origin;
    const canonicalUrl = origin + location.pathname;
    document.title = `${post.title} | M. Moslemani`;

    const setMeta = (attr, key, value) => {
      let el = document.head.querySelector(`${attr}[${key}="${value}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(key, value);
        document.head.appendChild(el);
      }
      return el;
    };

    const desc = post.excerpt || 'Blog post';
    setMeta('meta','name','description').setAttribute('content', desc);
    setMeta('meta','property','og:title').setAttribute('content', post.title);
    setMeta('meta','property','og:description').setAttribute('content', desc);
    setMeta('meta','property','og:type').setAttribute('content', 'article');
    setMeta('meta','property','og:url').setAttribute('content', canonicalUrl);
    if (post.cover) setMeta('meta','property','og:image').setAttribute('content', origin + post.cover);
    setMeta('meta','property','twitter:card').setAttribute('content', 'summary_large_image');
    setMeta('meta','property','twitter:title').setAttribute('content', post.title);
    setMeta('meta','property','twitter:description').setAttribute('content', desc);
    if (post.cover) setMeta('meta','property','twitter:image').setAttribute('content', origin + post.cover);

    ensureCanonical(canonicalUrl);

    setJsonLd('ld-article', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      datePublished: post.date,
      author: { '@type': 'Person', name: 'M. Moslemani' },
      description: desc,
      mainEntityOfPage: canonicalUrl,
      ...(post.cover ? { image: origin + post.cover } : {}),
    });

    setJsonLd('ld-breadcrumb', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Writing', item: origin + '/writing' },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonicalUrl },
      ],
    });
  }, [post, location.pathname]);

  useEffect(() => {
    if (!post) return;
    const pct = Math.round(progress * 100);
    [25, 50, 75, 100].forEach((mark) => {
      if (!scrollMilestones.current[mark] && pct >= mark) {
        scrollMilestones.current[mark] = true;
        trackEvent({ action: 'blog_scroll_depth', category: 'engagement', label: `${mark}%`, value: mark });
      }
    });
  }, [progress, post]);

  if (!post) {
    return (
      <div className="blog-page">
        <div className="blog-header">
          <h1>Post Not Found</h1>
          <p>The blog you are looking for doesn't exist.</p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/writing" className="btn btn-primary">Browse Writing</Link>
            <Link to="/" className="btn btn-secondary">Back to Portfolio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="blog-page" role="article" aria-label={post.title}>
      <div className="reading-progress" aria-hidden="true">
        <div className="reading-progress-bar" style={{ width: `${progress * 100}%` }} />
      </div>
      <header className="blog-header">
        <div className="blog-header-top">
          <h1>{post.title}</h1>
          <div className="blog-share-actions" aria-label="Share actions">
            <button type="button" className="btn-ghost" onClick={onCopyLink}>Copy link</button>
            <button type="button" className="btn-ghost" onClick={onShare}>Share</button>
            {shareMessage && <span className="share-hint">{shareMessage}</span>}
          </div>
        </div>
        <p className="blog-meta">
          Published {new Date(post.date).toLocaleDateString()} • Last updated {new Date(post.updated || post.date).toLocaleDateString()} • {readingTimeMinutes} min read
        </p>
      </header>
      {post.cover && (
        <div className="blog-cover-wrap">
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            className={`blog-cover ${coverLoaded ? 'is-loaded' : ''}`}
            onLoad={() => setCoverLoaded(true)}
          />
        </div>
      )}
      {toc.length > 0 && (
        <nav className="blog-toc" aria-label="Table of contents">
          {toc.map((t) => (
            <a key={t.id} href={`#${t.id}`} className={`toc-item level-${t.level}`}>{t.text}</a>
          ))}
        </nav>
      )}

      <div ref={contentRef} className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <footer className="blog-footer">
        <Link to="/" className="btn btn-secondary">Back to Portfolio</Link>
      </footer>
    </article>
  );
}
