/* Organisation mark, rendered as a single-colour ink silhouette on a
   transparent background so it sits on the page like type. The colour is
   flipped per surface in CSS (paper, dark theme, red block). Decorative:
   the organisation name is always printed next to it. */
export default function LogoMark({ src, size = "md" }) {
  if (!src) return null;
  return (
    <img
      className={`logo-mark logo-mark--${size}`}
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
    />
  );
}
