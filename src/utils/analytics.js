export function trackEvent({ action, category = 'interaction', label, value } = {}) {
  try {
    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', action || 'event', {
          event_category: category,
          event_label: label,
          value,
        });
        return;
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event: action || 'event', category, label, value });
        return;
      }
      if (window.analytics?.track) {
        window.analytics.track(action || 'event', { category, label, value });
        return;
      }
    }
  } catch (err) {
    console.debug('[analytics:error]', err);
  }
  console.debug('[analytics]', action, { category, label, value });
}
