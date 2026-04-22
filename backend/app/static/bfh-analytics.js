(function () {
  // URL of the central analytics backend (separate server)
  const COLLECT_URL = "http://3.78.247.149:8000/collect";

  // site_id is derived from hostname, no configuration needed from the site owner
  const siteId = location.hostname || 'unknown-host';

  function getDeviceType() {
    const ua = navigator.userAgent || '';
    if (/Tablet|iPad/i.test(ua)) return 'tablet';
    if (/Mobi|Android/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  function getReferrerType(ref) {
    if (!ref) return 'direct';
    let url;
    try {
      url = new URL(ref);
    } catch {
      return 'direct';
    }
    if (url.hostname === location.hostname) return 'internal';
    if (
      url.hostname.endsWith('google.ch') ||
      url.hostname.endsWith('google.com') ||
      url.hostname.endsWith('bing.com') ||
      url.hostname.endsWith('duckduckgo.com')
    ) {
      return 'external_search';
    }
    return 'external_link';
  }

  function getReferrerDomain(ref) {
    try {
      if (!ref) return '';
      return new URL(ref).hostname;
    } catch {
      return '';
    }
  }

  function sendPageView() {
    const payload = {
      event_type: 'page_view',
      event_timestamp: new Date().toISOString(),
      site_id: siteId,
      page_path: location.pathname,
      language: document.documentElement.lang || 'und',
      device_type: getDeviceType(),
      referrer_type: getReferrerType(document.referrer),
      referrer_domain: getReferrerDomain(document.referrer),
      extra: null // reserved for future extensions
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon(COLLECT_URL, blob);
    } else {
      fetch(COLLECT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true
      }).catch(() => {
        // ignore errors in prototype (no retry / logging on failure)
      });
    }

    console.log('[BFH-Analytics] page_view sent', payload);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendPageView);
  } else {
    sendPageView();
  }
})();
