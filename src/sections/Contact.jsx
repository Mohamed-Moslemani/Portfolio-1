import { useState } from "react";
import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";

/* Hairline SVG glyphs replace the previous emoji (📅 ✉️ 💼 💻). Emoji render
   differently on every platform and read as a personal blog, not a practice. */
const Icon = ({ paths }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths.map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

const GLYPHS = {
  calendar: [
    "M4 6.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
    "M4 10h16",
    "M8 3v3",
    "M16 3v3",
  ],
  mail: ["M3 6.5h18v11H3z", "M3 7l9 6.5L21 7"],
  linkedin: [
    "M4.5 9.5v10",
    "M4.5 5.2v.1",
    "M9.5 19.5v-10",
    "M9.5 13.2c0-2 1.4-3.4 3.3-3.4s3.2 1.3 3.2 3.6v6.1",
  ],
  code: ["M9 7l-5 5 5 5", "M15 7l5 5-5 5"],
};

export default function Contact() {
  const ref = useScrollAnimation();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText("moslemanomohamed@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contacts = [
    {
      title: "Book a Call",
      description: "Schedule a free consultation",
      glyph: "calendar",
      href: "https://calendly.com/moslemanomohamed",
      type: "link",
    },
    {
      title: "Email",
      description: "Prefer direct conversation",
      glyph: "mail",
      action: copyEmail,
      href: "mailto:moslemanomohamed@gmail.com",
      type: "email",
    },
    {
      title: "LinkedIn",
      description: "Let's connect professionally",
      glyph: "linkedin",
      href: "https://www.linkedin.com/in/mohamed-moslemani/",
      type: "link",
    },
    {
      title: "GitHub",
      description: "Check out my work",
      glyph: "code",
      href: "https://github.com/mohamed-moslemani",
      type: "link",
    },
  ];

  return (
    <Section>
      <div
        id="contact"
        ref={ref}
        className="contact"
        role="region"
        aria-label="Contact section"
      >
        <header className="section-head">
          <span className="label">06 — Contact</span>
          <h2>Let's Work Together</h2>
          <p className="section-sub">
            Have an AI challenge? Let's talk about how I can help. Book a free
            consultation or reach out directly.
          </p>
        </header>

        <p className="contact-message">
          Whether you need a full AI system built from scratch, strategic guidance on
          your AI roadmap, or hands-on engineering support. I'm here to help.
        </p>

        <div className="contact-methods" role="list" aria-label="Contact methods">
          {contacts.map((contact, index) => (
            <a
              key={contact.title}
              href={contact.href}
              target={contact.type === "link" ? "_blank" : undefined}
              rel={contact.type === "link" ? "noreferrer" : undefined}
              className="contact-card"
              onClick={(e) => {
                if (contact.type === "email") {
                  e.preventDefault();
                  contact.action();
                }
              }}
              style={{ "--contact-index": index }}
              role="listitem"
              aria-label={
                contact.type === "email"
                  ? `${contact.title}: Click to copy email address`
                  : `${contact.title}: Visit my ${contact.title} profile`
              }
            >
              <span className="contact-icon">
                <Icon paths={GLYPHS[contact.glyph]} />
              </span>

              <span className="contact-info">
                <span className="contact-title">{contact.title}</span>
                <span className="contact-desc">{contact.description}</span>
              </span>

              <span className="contact-value mono">
                {contact.type === "email" ? (
                  <span className={`copy-text${copied ? " copied" : ""}`}>
                    {copied ? "copied" : "copy"}
                  </span>
                ) : (
                  <span className="link-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </span>
            </a>
          ))}
        </div>

        <p className="contact-footer mono">Typically responds within 24 hours</p>
      </div>
    </Section>
  );
}
