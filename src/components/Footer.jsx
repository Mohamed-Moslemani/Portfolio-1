import { Link, useLocation, useNavigate } from "react-router-dom";
import { NAV_SECTIONS } from "../data/nav";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const go = (e, id) => {
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/#" + id);
    }
  };

  return (
    <footer className="site-footer block-cobalt">
      <div className="wrap site-footer-inner">
        <p className="site-footer-brand">
          <span className="nav-brand" aria-hidden="true">
            m<span>.</span>m
          </span>
          <span className="eyebrow">© {year} Mohamed Moslemani</span>
        </p>
        <nav aria-label="Footer">
          <ul className="site-footer-links eyebrow">
            {NAV_SECTIONS.map((s) => (
              <li key={s.id}>
                {s.to ? (
                  <Link to={s.to} className="link-under">{s.label}</Link>
                ) : (
                  <a href={`/#${s.id}`} className="link-under" onClick={(e) => go(e, s.id)}>
                    {s.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <a href="/resume.pdf" download="Mohamed_Moslemani_CV.pdf" className="link-under">
                Resume (PDF)
              </a>
            </li>
          </ul>
        </nav>
        <a
          href="#main"
          className="site-footer-top eyebrow link-under"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            document.getElementById("main")?.focus({ preventScroll: true });
          }}
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
