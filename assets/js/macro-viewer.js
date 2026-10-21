// ArtKGS Microscopic Macro-Loupe & Detailing Inspector
// Enables fluid 2x-8x magnification, surface lighting shifts, dual detail/scale ruler modes, and instant WhatsApp booking

class MacroViewer {
  constructor() {
    this.modal = document.getElementById('macro-modal');
    this.image = document.getElementById('macro-main-image');
    this.loupe = document.getElementById('macro-loupe');
    this.zoomLevel = 3.5;
    this.currentFilter = 'studio';
    this.currentViewMode = 'detail'; // 'detail' or 'scale'
    this.activeArtwork = null;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
  }

  open(artworkId) {
    const item = ARTKGS_CATALOG.find(a => a.id === artworkId);
    if (!item) return;

    this.activeArtwork = item;
    this.currentViewMode = 'detail';
    
    // Set UI contents
    const titleEl = document.getElementById('macro-modal-title');
    if (titleEl) titleEl.textContent = item.title;

    const hindiEl = document.getElementById('macro-modal-hindi');
    if (hindiEl) hindiEl.textContent = item.hindiTitle || '';

    const mediumEl = document.getElementById('macro-modal-medium');
    if (mediumEl) mediumEl.textContent = item.medium || '';

    const dimEl = document.getElementById('macro-modal-dimensions');
    if (dimEl) dimEl.textContent = item.dimensions || item.size || '';

    const locEl = document.getElementById('macro-modal-location');
    if (locEl) locEl.textContent = item.location || 'Rishikesh Studio';

    const descEl = document.getElementById('macro-modal-desc');
    if (descEl) descEl.textContent = item.description || '';

    const catEl = document.getElementById('macro-modal-category');
    if (catEl) catEl.textContent = item.categoryLabel || item.discipline || 'Pencil Sculpture';

    // Series Piece Number Badge (e.g. 01/16)
    const pieceBadge = document.getElementById('macro-modal-piece-no');
    if (pieceBadge) {
      if (item.pieceNumber) {
        pieceBadge.textContent = `2026 Collection • Piece ${item.pieceNumber}`;
        pieceBadge.classList.remove('hidden');
      } else {
        pieceBadge.classList.add('hidden');
      }
    }

    // Discipline Tag (Single-Piece vs Assembled)
    const disciplineEl = document.getElementById('macro-modal-discipline');
    if (disciplineEl) {
      if (item.discipline) {
        disciplineEl.textContent = item.discipline;
        disciplineEl.classList.remove('hidden');
      } else {
        disciplineEl.classList.add('hidden');
      }
    }

    // Artist Philosophical Calligraphy Quote
    const quoteBox = document.getElementById('macro-modal-quote-box');
    const hindiQuoteEl = document.getElementById('macro-modal-hindi-quote');
    const englishQuoteEl = document.getElementById('macro-modal-english-quote');
    if (quoteBox && hindiQuoteEl && englishQuoteEl) {
      if (item.hindiQuote || item.englishQuote) {
        quoteBox.classList.remove('hidden');
        hindiQuoteEl.textContent = item.hindiQuote ? `"${item.hindiQuote}"` : '';
        englishQuoteEl.textContent = item.englishQuote ? `— ${item.englishQuote}` : '';
      } else {
        quoteBox.classList.add('hidden');
      }
    }

    // Highlights tags
    const highlightsContainer = document.getElementById('macro-modal-highlights');
    if (highlightsContainer) {
      if (item.highlights && item.highlights.length > 0) {
        highlightsContainer.innerHTML = item.highlights.map(h => `
          <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-amber-950/40 text-amber-300 border border-amber-800/40">
            <svg class="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            ${h}
          </span>
        `).join('');
      } else {
        highlightsContainer.innerHTML = '';
      }
    }

    // Millimetre Scale Indicator
    const scaleBox = document.getElementById('macro-scale-indicator');
    const scaleText = document.getElementById('macro-scale-text');
    if (scaleBox && scaleText) {
      if (item.scaleRatio || item.size) {
        scaleBox.classList.remove('hidden');
        scaleText.textContent = item.scaleRatio || item.size;
      } else {
        scaleBox.classList.add('hidden');
      }
    }

    // Dual View Mode Container (Detail vs Scale Ruler)
    const viewModeContainer = document.getElementById('macro-viewmode-container');
    if (viewModeContainer) {
      if (item.scaleImage) {
        viewModeContainer.classList.remove('hidden');
        viewModeContainer.classList.add('flex');
        this.updateViewModeButtons();
      } else {
        viewModeContainer.classList.add('hidden');
        viewModeContainer.classList.remove('flex');
      }
    }

    // Load High-Res image
    this.loadImage(item.image);

    // Reset filter
    this.setFilter('studio');

    // Update WhatsApp book button
    const bookBtn = document.getElementById('macro-modal-whatsapp-btn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        window.openWhatsAppInquiry(item);
      };
    }

    // Show modal
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  loadImage(src) {
    this.image.src = src;
    this.loupe.style.backgroundImage = `url('${src}')`;
    this.loupe.style.backgroundRepeat = 'no-repeat';

    this.image.onload = () => {
      this.updateLoupeBackgroundSize();
    };
  }

  setViewMode(mode) {
    if (!this.activeArtwork) return;
    this.currentViewMode = mode;
    this.updateViewModeButtons();

    const targetSrc = (mode === 'scale' && this.activeArtwork.scaleImage)
      ? this.activeArtwork.scaleImage
      : this.activeArtwork.image;

    this.loadImage(targetSrc);
  }

  updateViewModeButtons() {
    const detailBtn = document.getElementById('macro-mode-detail-btn');
    const scaleBtn = document.getElementById('macro-mode-scale-btn');

    if (detailBtn && scaleBtn) {
      if (this.currentViewMode === 'detail') {
        detailBtn.classList.add('active-viewmode');
        scaleBtn.classList.remove('active-viewmode');
      } else {
        scaleBtn.classList.add('active-viewmode');
        detailBtn.classList.remove('active-viewmode');
      }
    }
  }

  close() {
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
    this.loupe.style.opacity = '0';
  }

  updateLoupeBackgroundSize() {
    const imgWidth = this.image.offsetWidth;
    const imgHeight = this.image.offsetHeight;
    this.loupe.style.backgroundSize = `${imgWidth * this.zoomLevel}px ${imgHeight * this.zoomLevel}px`;
  }

  setZoom(level) {
    this.zoomLevel = parseFloat(level);
    this.updateLoupeBackgroundSize();
    const zoomDisplay = document.getElementById('macro-zoom-val');
    if (zoomDisplay) zoomDisplay.textContent = `${this.zoomLevel.toFixed(1)}x`;
  }

  setFilter(filterName) {
    this.currentFilter = filterName;
    
    // Apply CSS filters on main image and loupe
    let filterCss = 'none';
    if (filterName === 'graphite') {
      filterCss = 'contrast(135%) brightness(105%) saturate(85%) drop-shadow(0 0 12px rgba(212,175,55,0.2))';
    } else if (filterName === 'golden') {
      filterCss = 'sepia(25%) saturate(140%) brightness(102%) contrast(110%)';
    } else if (filterName === 'monochrome') {
      filterCss = 'grayscale(100%) contrast(140%) brightness(95%)';
    }

    this.image.style.filter = filterCss;
    this.loupe.style.filter = filterCss;

    document.querySelectorAll('.lighting-filter-btn').forEach(btn => {
      btn.classList.toggle('active-filter', btn.dataset.filter === filterName);
    });
  }

  bindEvents() {
    // Close on backdrop or close button
    const closeBtn = document.getElementById('macro-modal-close');
    if (closeBtn) closeBtn.onclick = () => this.close();

    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
        this.close();
      }
    });

    // Zoom slider
    const zoomSlider = document.getElementById('macro-zoom-slider');
    if (zoomSlider) {
      zoomSlider.addEventListener('input', (e) => {
        this.setZoom(e.target.value);
      });
    }

    // View mode switch buttons (Detail vs Scale)
    const detailBtn = document.getElementById('macro-mode-detail-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', () => {
        this.setViewMode('detail');
      });
    }

    const scaleBtn = document.getElementById('macro-mode-scale-btn');
    if (scaleBtn) {
      scaleBtn.addEventListener('click', () => {
        this.setViewMode('scale');
      });
    }

    // Filter buttons
    document.querySelectorAll('.lighting-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });

    // Mouse movement inside image container for loupe
    const container = document.getElementById('macro-image-stage');
    if (!container) return;

    const moveLoupe = (e) => {
      const rect = this.image.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Check if mouse is over the image
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        this.loupe.style.opacity = '0';
        return;
      }

      this.loupe.style.opacity = '1';

      // Position loupe centered at cursor
      const loupeRadius = this.loupe.offsetWidth / 2;
      this.loupe.style.left = `${x - loupeRadius}px`;
      this.loupe.style.top = `${y - loupeRadius}px`;

      // Position background in loupe to show magnified coordinates
      const bgX = (x * this.zoomLevel) - loupeRadius;
      const bgY = (y * this.zoomLevel) - loupeRadius;

      this.loupe.style.backgroundPosition = `-${bgX}px -${bgY}px`;
    };

    container.addEventListener('mousemove', moveLoupe);
    container.addEventListener('mouseleave', () => {
      this.loupe.style.opacity = '0';
    });

    container.addEventListener('touchmove', moveLoupe, { passive: true });
    container.addEventListener('touchend', () => {
      this.loupe.style.opacity = '0';
    });

    window.addEventListener('resize', () => {
      if (!this.modal.classList.contains('hidden')) {
        this.updateLoupeBackgroundSize();
      }
    });
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.macroViewer = new MacroViewer();
});
