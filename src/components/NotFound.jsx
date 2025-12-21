import { Link } from "react-router-dom";

export default function NotFound() {
  if (typeof document !== "undefined") {
    document.title = "Page Not Found | M. Moslemani";
  }

  return (
    <section className="not-found" style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
      <div className="not-found__body" style={{ maxWidth: 640, margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "2.5rem", borderRadius: "12px" }}>
        <p style={{ letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>404</p>
        <h1 style={{ marginBottom: "1rem" }}>That page drifted off.</h1>
        <p style={{ marginBottom: "2rem", color: "var(--text-muted)" }}>
          The link you followed doesn't exist. Check out the writing index or head back home.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/writing" className="btn btn-primary">Go to Writing</Link>
          <Link to="/" className="btn btn-secondary">Back to Portfolio</Link>
        </div>
      </div>
    </section>
  );
}
