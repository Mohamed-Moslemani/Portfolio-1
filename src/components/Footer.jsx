export default function Footer() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <div className="site-footer__mark">MM/</div>
          <div>
            <p className="site-footer__title">M. Moslemani</p>
            <p className="site-footer__subtitle">Building AI systems and writing about it.</p>
          </div>
        </div>
        <div className="site-footer__links">
          <a href="https://github.com/mohamed-moslemani" className="footer-link" target="_blank" rel="noreferrer">
            <svg className="footer-link-icon" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.12.82-.26.82-.58v-2.1c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.1-.74.08-.73.08-.73 1.22.08 1.86 1.26 1.86 1.26 1.08 1.85 2.82 1.32 3.5 1 .1-.8.43-1.32.78-1.63-2.67-.3-5.47-1.34-5.47-5.95 0-1.32.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0C16.6 5.9 17.6 6.22 17.6 6.22c.66 1.66.25 2.88.12 3.18.77.84 1.24 1.9 1.24 3.22 0 4.62-2.8 5.64-5.48 5.94.44.38.83 1.12.83 2.26v3.35c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/mohamed-moslemani/" className="footer-link" target="_blank" rel="noreferrer">
            <svg className="footer-link-icon" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.44V9h3.42v1.56h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.4 4.31 5.52v6.22ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.56V9H3.56v11.45ZM22.22 0H1.78A1.78 1.78 0 0 0 0 1.78v20.44C0 23.4.6 24 1.78 24h20.44A1.78 1.78 0 0 0 24 22.22V1.78A1.78 1.78 0 0 0 22.22 0Z"/></svg>
          </a>
          <a href="https://x.com/mohamed07238494" className="footer-link" target="_blank" rel="noreferrer">
            <svg className="footer-link-icon" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18.9 2h3.1l-6.8 7.78L23 22h-6.03l-4.72-6.17L6.8 22H3.7l7.3-8.35L2.3 2h6.19l4.27 5.61L18.9 2Zm-1.08 18h1.72L6.25 3.9H4.42L17.82 20Z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
