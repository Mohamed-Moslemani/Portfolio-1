import { useEffect, useRef, useState } from 'react';
import { posts } from '../posts';

export default function BlogLinkPreview() {
  const [preview, setPreview] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const handleMouseOver = (e) => {
      const link = e.target.closest('a[data-blog-slug]');
      if (!link) return;

      const slug = link.getAttribute('data-blog-slug');
      const post = posts.find(p => p.slug === slug);
      if (!post) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        const rect = link.getBoundingClientRect();
        setPreview(post);
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top - 10,
        });
      }, 300);
    };

    const handleMouseOut = () => {
      clearTimeout(timeoutRef.current);
      setPreview(null);
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!preview) return null;

  return (
    <div
      ref={previewRef}
      className="blog-link-preview"
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <div className="blog-link-preview-card">
        <h4 className="blog-link-preview-title">{preview.title}</h4>
        <p className="blog-link-preview-date">
          {new Date(preview.date).toLocaleDateString()}
        </p>
        {preview.tags?.length > 0 && (
          <div className="blog-link-preview-tags">
            {preview.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="blog-link-preview-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
