// ArtKGS Real-Time Content & Catalog Synchronization Module
// Powers the /admin portal and dynamically hydrates the live website with owner updates

(function() {
  const STORAGE_CATALOG_KEY = 'ARTKGS_LIVE_CATALOG';
  const STORAGE_CONTENT_KEY = 'ARTKGS_SITE_CONTENT';
  const STORAGE_AUTH_KEY = 'ARTKGS_ADMIN_AUTH';

  // Default editable site texts
  const DEFAULT_SITE_CONTENT = {
    heroBadge: "Harsh • Self-Taught Miniature Sculptor • Rishikesh (Banks of Maa Ganga)",
    heroDevanagari: '"अधूरा ही पूर्ण है" — Incompleteness as Wholeness',
    heroSubtitle: "Pencil-Tip Miniature Carving (0.5 to 2.7 cm) • Portfolio 2026 Collection",
    heroBio: "Single-Piece Carvings cut whole from single graphite leads without additions, and Assembled Carvings engineered with sub-millimetre precision. Photographed against millimetre rulers under optical magnification.",
    studioPhone: "+91 98706 20748",
    studioPhoneRaw: "9870620748",
    studioWhatsapp: "+91 98706 20748",
    studioWhatsappRaw: "919870620748",
    studioEmail: "art.kgs143@gmail.com",
    studioAddress: "Tapovan, Ganga Ghats, Rishikesh, Uttarakhand 249192, India",
    priceNameCarving: "₹1,499",
    priceTemple: "₹4,999",
    priceMasterwork: "₹9,999",
    priceCanvas: "₹14,999",
    philosophyTitle: "Incompleteness as Wholeness (अधूरा ही पूर्ण है)",
    philosophyText: "On the banks of the sacred river Ganga in Rishikesh, Harsh transforms brittle 0.5mm graphite pencil leads into microscopic architectural sanctuaries, celestial instruments, and devotional expressions. Each piece requires sustained meditation, respiratory control, and hand steadiness measured in fractions of a millimeter."
  };

  // Get current site content
  function getSiteContent() {
    try {
      const stored = localStorage.getItem(STORAGE_CONTENT_KEY);
      if (stored) {
        return Object.assign({}, DEFAULT_SITE_CONTENT, JSON.parse(stored));
      }
    } catch (e) {
      console.warn('[ContentSync] Failed to read stored content:', e);
    }
    return Object.assign({}, DEFAULT_SITE_CONTENT);
  }

  // Save site content
  function saveSiteContent(newContent) {
    try {
      const merged = Object.assign({}, getSiteContent(), newContent);
      localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(merged));
      applySiteContent(merged);
      return true;
    } catch (e) {
      console.error('[ContentSync] Failed to save content:', e);
      return false;
    }
  }

  // Get active catalog (merging default with live edits)
  function getLiveCatalog() {
    try {
      const stored = localStorage.getItem(STORAGE_CATALOG_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[ContentSync] Failed to read stored catalog:', e);
    }
    return (typeof window !== 'undefined' && window.ARTKGS_CATALOG) || (typeof ARTKGS_CATALOG !== 'undefined' ? ARTKGS_CATALOG : []);
  }

  // Save catalog
  function saveLiveCatalog(newCatalog) {
    try {
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(newCatalog));
      if (typeof window !== 'undefined') {
        window.ARTKGS_CATALOG = newCatalog;
      }
      return true;
    } catch (e) {
      console.error('[ContentSync] Failed to save catalog:', e);
      return false;
    }
  }

  // Apply content updates to the DOM
  function applySiteContent(content) {
    if (typeof document === 'undefined') return;

    // Apply by data-sync attribute
    document.querySelectorAll('[data-sync]').forEach(el => {
      const key = el.getAttribute('data-sync');
      if (content[key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.value = content[key];
        } else {
          el.textContent = content[key];
        }
      }
    });

    // Update Phone links
    if (content.studioPhoneRaw) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = `tel:+${content.studioPhoneRaw.replace(/\D/g, '')}`;
      });
    }

    // Update WhatsApp links
    if (content.studioWhatsappRaw) {
      const cleanWa = content.studioWhatsappRaw.replace(/\D/g, '');
      document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
        try {
          const url = new URL(a.href);
          const textParam = url.searchParams.get('text') || '';
          a.href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(textParam)}`;
        } catch (err) {
          a.href = `https://wa.me/${cleanWa}`;
        }
      });
    }

    // Update Email links
    if (content.studioEmail) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
        a.href = `mailto:${content.studioEmail}`;
      });
    }
  }

  // Hydrate on document load
  function initHydration() {
    // 1. Hydrate Catalog
    const liveCatalog = getLiveCatalog();
    if (liveCatalog && liveCatalog.length > 0) {
      window.ARTKGS_CATALOG = liveCatalog;
    }

    // 2. Hydrate Site Content
    const content = getSiteContent();
    applySiteContent(content);
  }

  // Global Export
  window.ArtkgsSync = {
    getSiteContent,
    saveSiteContent,
    getLiveCatalog,
    saveLiveCatalog,
    applySiteContent,
    DEFAULT_SITE_CONTENT,
    STORAGE_CATALOG_KEY,
    STORAGE_CONTENT_KEY,
    STORAGE_AUTH_KEY,
    resetToDefault: function() {
      localStorage.removeItem(STORAGE_CATALOG_KEY);
      localStorage.removeItem(STORAGE_CONTENT_KEY);
      window.location.reload();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHydration);
  } else {
    initHydration();
  }
})();
