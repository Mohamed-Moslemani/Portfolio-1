import LinkedIn from '../assets/icons/linkedin.svg';
import GitHub from '../assets/icons/github.svg';
import XIcon from '../assets/icons/X.png';

export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__mark">MM/</div>
          <div>
            <p className="site-footer__title">M. Moslemani</p>
            <p className="site-footer__subtitle">
              Building AI systems and writing about it.
            </p>
          </div>
        </div>

        <div className="site-footer__links">
          <a
            href="https://github.com/mohamed-moslemani"
            className="footer-link"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={GitHub}
              alt="GitHub"
              className="footer-link-icon"
            />
          </a>

          <a
            href="https://www.linkedin.com/in/mohamed-moslemani/"
            className="footer-link"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={LinkedIn}
              alt="LinkedIn"
              className="footer-link-icon"
            />
          </a>

          <a
            href="https://x.com/mohamed07238494"
            className="footer-link"
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={XIcon}
              alt="X"
              className="footer-link-icon"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
