import { useState } from "react";
import { useReveal } from "../hooks/useReveal";
import { trackEvent } from "../utils/analytics";

const EMAIL = "mh.moslemani@gmail.com";
const CALENDLY = "https://calendly.com/moslemanomohamed";

const PROFILES = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mohamed-moslemani/", note: "Let's connect professionally" },
  { label: "GitHub", href: "https://github.com/mohamed-moslemani", note: "Check out my work" },
  { label: "X", href: "https://x.com/mohamed07238494", note: "@mohamed07238494" },
];

export default function Contact() {
  const ref = useReveal();
  const [copied, setCopied] = useState(null);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied("Email address copied");
    } catch {
      setCopied("Copy failed. Select the address instead");
    }
    trackEvent({ action: "contact_copy_email", category: "engagement", label: "email" });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section id="contact" className="contact block-cobalt" ref={ref} aria-labelledby="contact-title">
      <div className="wrap">
        <div className="section-head eyebrow">
          <span>06 / Contact</span>
          <span>Have an AI challenge? Book a free consultation or reach out directly.</span>
        </div>

        <h2 id="contact-title" className="contact-title" data-reveal>
          Have a problem
          <br />
          worth <span>solving?</span>
        </h2>

        <p className="contact-message" data-reveal>
          Whether you need a full AI system built from scratch, strategic guidance on your AI
          roadmap, or hands-on engineering support, I'm here to help.
        </p>

        <div className="contact-primary">
          <a
            href={CALENDLY}
            target="_blank"
            rel="noreferrer"
            className="contact-book"
            onClick={() => trackEvent({ action: "contact_book", category: "outbound", label: "calendly" })}
          >
            <span className="eyebrow">Book a call</span>
            <span className="contact-book-line">
              Schedule a free consultation
              <span className="round" aria-hidden="true">↗</span>
            </span>
            <span className="sr-only">(opens Calendly in a new tab)</span>
          </a>

          <div className="contact-email">
            <span className="eyebrow">Email · prefer direct conversation</span>
            <div className="contact-email-row">
              <a href={`mailto:${EMAIL}`} className="contact-email-link link-under">
                {EMAIL}
              </a>
              <button type="button" className="contact-copy" onClick={copyEmail}>
                Copy
              </button>
            </div>
            <p className="contact-status eyebrow" role="status" aria-live="polite">
              {copied || ""}
            </p>
          </div>
        </div>

        <ul className="contact-profiles">
          {PROFILES.map((p) => (
            <li key={p.label}>
              <a href={p.href} target="_blank" rel="noreferrer" className="link-under">
                {p.label} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <span className="eyebrow">{p.note}</span>
            </li>
          ))}
        </ul>

        <p className="contact-foot eyebrow">Typically responds within 24 hours</p>
      </div>
    </section>
  );
}
