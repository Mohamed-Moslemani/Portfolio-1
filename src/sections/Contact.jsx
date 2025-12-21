import Section from "../components/Section";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { useState } from "react";

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
      title: "Email",
      description: "Prefer direct conversation",
      value: "moslemanomohamed@gmail.com",
      icon: "✉️",
      action: copyEmail,
      href: "mailto:moslemanomohamed@gmail.com",
      type: "email"
    },
    {
      title: "LinkedIn",
      description: "Let's connect professionally",
      value: "Mohamed Moslemani",
      icon: "💼",
      href: "https://www.linkedin.com/in/mohamed-moslemani/",
      type: "link"
    },
    {
      title: "GitHub",
      description: "Check out my work",
      value: "@mohamed-moslemani",
      icon: "💻",
      href: "https://github.com/mohamed-moslemani",
      type: "link"
    }
  ];

  return (
    <Section>
      <div id="contact" ref={ref} className="contact" role="region" aria-label="Contact section">
        <div className="contact-header">
          <h2>Let's Connect</h2>
          <p className="contact-intro">
            Whether it's about work, research, or just to chat about football and life—reach out.
          </p>
        </div>

        <div className="contact-message">
          <div className="message-icon">💬</div>
          <p>
            I'm always open to interesting conversations and new opportunities. Don't hesitate to get in touch.
          </p>
        </div>

        <div className="contact-methods" role="list" aria-label="Contact methods">
          {contacts.map((contact, index) => (
            <a
              key={index}
              href={contact.href}
              target={contact.type === "link" ? "_blank" : "_self"}
              rel={contact.type === "link" ? "noreferrer" : ""}
              className="contact-card"
              onClick={(e) => {
                if (contact.type === "email") {
                  e.preventDefault();
                  contact.action();
                }
              }}
              style={{ '--contact-index': index }}              role="listitem"
              aria-label={contact.type === "email" ? `${contact.title}: Click to copy email address` : `${contact.title}: Visit my ${contact.title} profile`}            >
              <div className="contact-card-inner">
                <div className="contact-icon">{contact.icon}</div>
                <div className="contact-info">
                  <h3 className="contact-title">{contact.title}</h3>
                  <p className="contact-desc">{contact.description}</p>
                </div>
                <div className="contact-value">
                  {contact.type === "email" ? (
                    <span className={`copy-text ${copied ? 'copied' : ''}`}>
                      {copied ? '✓ Copied!' : 'Click to copy'}
                    </span>
                  ) : (
                    <span className="link-arrow">→</span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="contact-footer">
          <p>
            <span className="footer-icon">⏱️</span>
            Typically responds within 24 hours
          </p>
        </div>
      </div>
    </Section>
  );
}
