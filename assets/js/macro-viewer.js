// ArtKGS Microscopic Macro-Loupe & Detailing Inspector
// Enables fluid 1.8x-8.0x magnification, surface lighting shifts, dual detail/scale ruler modes, and instant WhatsApp booking

class MacroViewer {
  constructor() {
    this.modal = document.getElementById('macro-modal');
    this.image = document.getElementById('macro-main-image');
    this.loupe = document.getElementById('macro-loupe');
    this.stage = document.getElementById('macro-image-stage');
    this.zoomLevel = 3.5;
    this.currentFilter = 'studio';
    this.currentViewMode = 'detail'; // 'detail' or 'scale'
    this.activeArtwork = null;
    this.lastPointerPos = null;

    if (this.modal && this.image && this.loupe) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.bindGlobalTriggers();
  }

  bindGlobalTriggers() {
    // Delegated click support for any element requesting macro inspection
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-macro-artwork], [data-macro-id]');
      if (trigger) {
        const id = trigger.getAttribute('data-macro-artwork') || trigger.getAttribute('data-macro-id');
        if (id) {
          e.preventDefault();
          this.open(id);
        }
      }
    });
  }

  open(artworkId) {
    if (!window.ARTKGS_CATALOG) return;
    const item = window.ARTKGS_CATALOG.find(a => a.id === artworkId);
    if (!item) {
      console.warn(`[MacroViewer] Artwork not found in catalog: ${artworkId}`);
      return;
    }

    this.activeArtwork = item;
    this.currentViewMode = 'detail';

    // 1. Unhide modal FIRST so DOM dimensions are fully computable
    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // 2. Set UI contents
    const titleEl = document.getElementById('macro-modal-title');
    if (titleEl) titleEl.textContent = item.title;

    const hindiEl = document.getElementById('macro-modal-hindi');
    if (hindiEl) hindiEl.textContent = item.hindiTitle || '';

    const mediumEl = document.getElementById('macro-modal-medium');
    if (mediumEl) mediumEl.textContent = item.medium || '';

    const dimEl = document.getElementById('macro-modal-dimensions');
    if (dimEl) dimEl.textContent = item.dimensions || item.size || '';

    const locEl = document.getElementById('macro-modal-location');
    if (locEl) locEl.textContent = item.location || 'Rishikesh Studio, Uttarakhand';

    const descEl = document.getElementById('macro-modal-desc');
    if (descEl) descEl.textContent = item.description || '';

    const catEl = document.getElementById('macro-modal-category');
    if (catEl) catEl.textContent = item.categoryLabel || item.discipline || 'Pencil Sculpture';

    // Series Piece Number Badge (e.g. Piece 01)
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

    // Reset Zoom UI
    this.setZoom(this.zoomLevel || 3.5);

    // Reset Lighting Filter
    this.setFilter('studio');

    // Update WhatsApp inquiry button
    const bookBtn = document.getElementById('macro-modal-whatsapp-btn');
    if (bookBtn) {
      bookBtn.onclick = () => {
        if (typeof window.openWhatsAppInquiry === 'function') {
          window.openWhatsAppInquiry(item);
        } else {
          const text = encodeURIComponent(`Namaste Harsh ji, I am inquiring about "${item.title}" (${item.medium || 'Miniature Sculpture'}) from your ArtKGS Portfolio.`);
          window.open(`https://wa.me/919870620748?text=${text}`, '_blank');
        }
      };
    }

    // Load High-Res image
    this.loadImage(item.image);
  }

  loadImage(src) {
    if (!this.image || !this.loupe) return;

    this.image.src = src;
    this.loupe.style.backgroundImage = `url('${src}')`;
    this.loupe.style.backgroundRepeat = 'no-repeat';

    const onReady = () => {
      this.updateLoupeBackgroundSize();
      if (this.lastPointerPos) {
        this.renderLoupe(this.lastPointerPos.x, this.lastPointerPos.y);
      }
    };

    if (this.image.complete && this.image.naturalWidth > 0) {
      requestAnimationFrame(onReady);
    }
    this.image.onload = () => {
      requestAnimationFrame(onReady);
    };

    // Fallbacks after DOM paint
    setTimeout(onReady, 50);
    setTimeout(onReady, 200);
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
    if (!this.modal) return;
    this.modal.classList.add('hidden');
    document.body.style.overflow = '';
    if (this.loupe) {
      this.loupe.style.opacity = '0';
    }
    this.lastPointerPos = null;
  }

  updateLoupeBackgroundSize() {
    if (!this.image || !this.loupe) return;
    const rect = this.image.getBoundingClientRect();
    const imgWidth = rect.width || this.image.offsetWidth;
    const imgHeight = rect.height || this.image.offsetHeight;

    if (imgWidth > 0 && imgHeight > 0) {
      const bgW = Math.round(imgWidth * this.zoomLevel);
      const bgH = Math.round(imgHeight * this.zoomLevel);
      this.loupe.style.backgroundSize = `${bgW}px ${bgH}px`;
    }
  }

  setZoom(level) {
    const parsed = Math.min(8.0, Math.max(1.8, parseFloat(level) || 3.5));
    this.zoomLevel = parsed;

    const zoomSlider = document.getElementById('macro-zoom-slider');
    if (zoomSlider && parseFloat(zoomSlider.value) !== parsed) {
      zoomSlider.value = parsed.toFixed(1);
    }

    const zoomDisplay = document.getElementById('macro-zoom-val');
    if (zoomDisplay) {
      zoomDisplay.textContent = `${this.zoomLevel.toFixed(1)}x`;
    }

    this.updateLoupeBackgroundSize();

    if (this.lastPointerPos) {
      this.renderLoupe(this.lastPointerPos.x, this.lastPointerPos.y);
    }
  }

  setFilter(filterName) {
    this.currentFilter = filterName;

    let filterCss = 'none';
    if (filterName === 'graphite') {
      filterCss = 'contrast(135%) brightness(105%) saturate(85%) drop-shadow(0 0 12px rgba(212,175,55,0.2))';
    } else if (filterName === 'golden') {
      filterCss = 'sepia(25%) saturate(140%) brightness(102%) contrast(110%)';
    } else if (filterName === 'monochrome') {
      filterCss = 'grayscale(100%) contrast(140%) brightness(95%)';
    }

    if (this.image) this.image.style.filter = filterCss;
    if (this.loupe) this.loupe.style.filter = filterCss;

    document.querySelectorAll('.lighting-filter-btn').forEach(btn => {
      btn.classList.toggle('active-filter', btn.dataset.filter === filterName);
    });
  }

  renderLoupe(clientX, clientY) {
    if (!this.image || !this.loupe) return;
    const container = this.stage || document.getElementById('macro-image-stage');
    if (!container) return;

    const imgRect = this.image.getBoundingClientRect();
    const stageRect = container.getBoundingClientRect();

    // Check pointer boundary on image with generous tolerance
    if (
      clientX < (imgRect.left - 4) ||
      clientX > (imgRect.right + 4) ||
      clientY < (imgRect.top - 4) ||
      clientY > (imgRect.bottom + 4)
    ) {
      this.loupe.style.opacity = '0';
      return;
    }

    // Save active pointer position
    this.lastPointerPos = { x: clientX, y: clientY };

    // Reveal loupe
    this.loupe.style.opacity = '1';

    // Verify backgroundSize is set
    const bgSize = this.loupe.style.backgroundSize;
    if (!bgSize || bgSize.startsWith('0px') || bgSize === '') {
      this.updateLoupeBackgroundSize();
    }

    const loupeRadius = (this.loupe.offsetWidth / 2) || 85;

    // 1. Stage-relative positioning: centers the loupe right at the user's cursor
    const stageX = clientX - stageRect.left;
    const stageY = clientY - stageRect.top;
    this.loupe.style.left = `${stageX - loupeRadius}px`;
    this.loupe.style.top = `${stageY - loupeRadius}px`;

    // 2. Image-relative positioning: centers the magnified pixel inside the loupe
    const clampedImgX = Math.max(0, Math.min(imgRect.width, clientX - imgRect.left));
    const clampedImgY = Math.max(0, Math.min(imgRect.height, clientY - imgRect.top));

    const bgX = (clampedImgX * this.zoomLevel) - loupeRadius;
    const bgY = (clampedImgY * this.zoomLevel) - loupeRadius;
    this.loupe.style.backgroundPosition = `-${bgX}px -${bgY}px`;
  }

  bindEvents() {
    // Close button & Esc
    const closeBtn = document.getElementById('macro-modal-close');
    if (closeBtn) closeBtn.onclick = () => this.close();

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal && !this.modal.classList.contains('hidden')) {
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

    // Quick Zoom In / Out buttons
    const zoomPlus = document.getElementById('macro-zoom-plus');
    if (zoomPlus) {
      zoomPlus.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setZoom(this.zoomLevel + 0.5);
      });
    }

    const zoomMinus = document.getElementById('macro-zoom-minus');
    if (zoomMinus) {
      zoomMinus.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setZoom(this.zoomLevel - 0.5);
      });
    }

    // View mode switch buttons
    const detailBtn = document.getElementById('macro-mode-detail-btn');
    if (detailBtn) {
      detailBtn.addEventListener('click', () => this.setViewMode('detail'));
    }

    const scaleBtn = document.getElementById('macro-mode-scale-btn');
    if (scaleBtn) {
      scaleBtn.addEventListener('click', () => this.setViewMode('scale'));
    }

    // Lighting Filter buttons
    document.querySelectorAll('.lighting-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setFilter(btn.dataset.filter);
      });
    });

    const container = this.stage || document.getElementById('macro-image-stage');
    if (!container) return;

    // Mouse Movement
    const onMouseMove = (e) => {
      this.renderLoupe(e.clientX, e.clientY);
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseMove);
    container.addEventListener('mouseleave', () => {
      if (this.loupe) this.loupe.style.opacity = '0';
    });

    // Mouse Wheel Zoom on image stage
    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const step = e.deltaY < 0 ? 0.3 : -0.3;
      this.setZoom(this.zoomLevel + step);
      this.renderLoupe(e.clientX, e.clientY);
    }, { passive: false });

    // Touch Support for mobile/tablets
    const onTouch = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      e.preventDefault(); // prevent background scroll while inspecting
      const t = e.touches[0];
      this.renderLoupe(t.clientX, t.clientY);
    };

    container.addEventListener('touchstart', onTouch, { passive: false });
    container.addEventListener('touchmove', onTouch, { passive: false });

    // Click to cycle zoom level: 3.5x -> 5.5x -> 8.0x -> 2.5x
    if (this.image) {
      this.image.addEventListener('click', (e) => {
        let nextZoom = 3.5;
        if (this.zoomLevel < 3.0) nextZoom = 4.0;
        else if (this.zoomLevel < 5.0) nextZoom = 6.0;
        else if (this.zoomLevel < 7.5) nextZoom = 8.0;
        else nextZoom = 2.5;

        this.setZoom(nextZoom);
        this.renderLoupe(e.clientX, e.clientY);
      });
    }

    // Window resize & orientation change
    window.addEventListener('resize', () => {
      if (this.modal && !this.modal.classList.contains('hidden')) {
        this.updateLoupeBackgroundSize();
        if (this.lastPointerPos) {
          this.renderLoupe(this.lastPointerPos.x, this.lastPointerPos.y);
        }
      }
    });
  }
}

// Global initialization & helper
function initGlobalMacroViewer() {
  if (!window.macroViewer) {
    window.macroViewer = new MacroViewer();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalMacroViewer);
} else {
  initGlobalMacroViewer();
}

window.openMacroViewer = function(artworkId) {
  initGlobalMacroViewer();
  if (window.macroViewer) {
    window.macroViewer.open(artworkId);
  }
};
