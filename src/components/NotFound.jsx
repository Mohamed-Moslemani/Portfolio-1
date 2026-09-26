import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/blog.css";

export default function NotFound() {
  useEffect(() => {
    document.title = "Page Not Found | M. Moslemani";
  }, []);

  return (
    <section className="wrap not-found" aria-labelledby="nf-title">
      <p className="eyebrow">404</p>
      <h1 id="nf-title" className="blog-index-title">
        That page drifted off<span className="dot">.</span>
      </h1>
      <p>The link you followed doesn't exist. Check out the writing index or head back home.</p>
      <div className="article-missing-actions">
        <Link to="/writing" className="btn btn-solid">Go to writing</Link>
        <Link to="/" className="btn btn-line">Back to portfolio</Link>
      </div>
    </section>
  );
}
