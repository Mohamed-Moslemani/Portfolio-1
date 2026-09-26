/* Production origin. The previous canonical host (mmoslemani.com) does not
   resolve; the live site is served from www.mohamedmoslemani.com. Keep in
   sync with index.html and scripts/generate-feeds.mjs. */
export const SITE_URL = "https://www.mohamedmoslemani.com";

export const DEFAULT_TITLE = "M. Moslemani - AI/ML Engineer & Researcher | Portfolio";
export const DEFAULT_DESCRIPTION =
  "Experienced AI/ML Engineer and Researcher specializing in machine learning, data science, and innovative tech solutions. Explore my work, research, and technical expertise.";

export const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
};

export const setMeta = (attr, key, content) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
  return el;
};

export const setJsonLd = (id, data) => {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
};

export const removeJsonLd = (id) => document.getElementById(id)?.remove();
