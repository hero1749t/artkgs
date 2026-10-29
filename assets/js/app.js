// ArtKGS Main Application Script
// Multi-disciplinary Artist Harsh — Rishikesh, Uttarakhand

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function getActiveCatalog() {
  if (window.ArtkgsSync && typeof window.ArtkgsSync.getLiveCatalog === 'function') {
    const live = window.ArtkgsSync.getLiveCatalog();
    if (Array.isArray(live) && live.length > 0) return live;
  }
  if (window.ARTKGS_CATALOG && Array.isArray(window.ARTKGS_CATALOG)) {
    return window.ARTKGS_CATALOG;
  }
  if (typeof ARTKGS_CATALOG !== 'undefined' && Array.isArray(ARTKGS_CATALOG)) {
    return ARTKGS_CATALOG;
  }
  return [];
}

function initApp() {
  // 1. Initialize 3D Stage
  if (document.getElementById('pencil-3d-container')) {
    window.stage3d = window.initPencil3DStage('pencil-3d-container');

    // 3D mode buttons
    document.querySelectorAll('.model-switcher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.stage3d) {
          window.stage3d.setMode(btn.dataset.mode);
        }
      });
    });
  }

  // 2. Render Gallery Cards
  renderGallery('all');

  // 3. Category Filter Tabs
  setupCategoryFilters();

  // 4. Mobile Navigation Toggle
  setupMobileNav();

  // 5. Featured Slider / Showcase
  setupFeaturedCarousel();

  // 6. Theme Mode Toggle (Warm Linen vs Dark Velvet)
  setupThemeToggle();

  // 7. Ambient Audio (Optional meditative Ganga water chime)
  setupAmbientSound();

  // 8. Dynamic Header Scroll Effect
  setupHeaderScroll();

  // 9. Dynamic Hero Wall Hydration (if custom items exist in live catalog)
  hydrateHeroArtWall();
}

// Hydrate Hero Art Wall from Live Catalog
function hydrateHeroArtWall() {
  const wallGrid = document.querySelector('#hero-art-wall .grid');
  if (!wallGrid) return;

  const catalog = getActiveCatalog();
  if (!catalog || catalog.length === 0) return;

  // Filter hero items, fallback to first 12
  let heroItems = catalog.filter(a => a.isHero);
  if (heroItems.length === 0) {
    heroItems = catalog.slice(0, 12);
  } else if (heroItems.length > 12) {
    heroItems = heroItems.slice(0, 12);
  }

  // Check if any hero item was edited or custom added
  const hasCustomEdits = Boolean(localStorage.getItem('ARTKGS_LIVE_CATALOG'));
  if (!hasCustomEdits) {
    // Keep high-performance static HTML intact if no custom edits
    return;
  }

  wallGrid.innerHTML = heroItems.map((art, idx) => {
    const isSingle = art.discipline && art.discipline.toLowerCase().includes('assembled') ? '🧩 Assembled' : '✏️ Single-Piece';
    const displaySize = art.size || art.dimensions || '';

    return `
      <div class="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 hover:border-amber-500/70 transition-all duration-300 group relative aspect-[3/4] cursor-pointer select-none active:scale-[0.98] shadow-xl hero-card-item" data-macro-artwork="${art.id}" role="button" tabindex="0" style="touch-action: manipulation;" onclick="window.openMacroViewer('${art.id}')">
        <img src="${art.image}" alt="${art.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy">
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none"></div>
        <span class="absolute top-2.5 left-2.5 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-stone-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md pointer-events-none">
          ${isSingle}
        </span>
        ${displaySize ? `
          <span class="absolute top-2.5 right-2.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md pointer-events-none">
            📏 ${displaySize}
          </span>
        ` : ''}
        <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div class="truncate">
            <span class="font-serif text-xs font-bold text-white group-hover:text-amber-300 block truncate">${art.title}</span>
            ${art.hindiTitle ? `<span class="text-[10px] font-devanagari text-amber-400/80 block truncate">${art.hindiTitle}</span>` : ''}
          </div>
          <span class="text-amber-400 text-xs flex-shrink-0">🔎</span>
        </div>
      </div>
    `;
  }).join('');
}

// Render Gallery Cards dynamically
function renderGallery(activeCategory = 'all') {
  const container = document.getElementById('art-gallery-grid');
  if (!container) return;

  const catalog = getActiveCatalog();

  let filtered = catalog;
  if (activeCategory === 'single-piece') {
    filtered = catalog.filter(item => item.category === 'single-piece');
  } else if (activeCategory === 'assembled') {
    filtered = catalog.filter(item => item.category === 'assembled');
  } else if (activeCategory === 'pencil') {
    filtered = catalog.filter(item => item.category === 'single-piece' || item.category === 'assembled' || item.category === 'pencil');
  } else if (activeCategory === 'hyperrealism') {
    filtered = catalog.filter(item => item.category === 'hyperrealism' || item.category === 'satire' || item.category === 'murals');
  } else if (activeCategory !== 'all') {
    filtered = catalog.filter(item => item.category === activeCategory);
  }

  container.innerHTML = '';

  filtered.forEach((art, idx) => {
    const card = document.createElement('div');
    card.className = 'art-card group relative bg-stone-900/60 rounded-2xl overflow-hidden border border-amber-900/20 hover:border-amber-500/40 transition-all duration-500 flex flex-col justify-between shadow-xl';
    card.style.animation = `fadeInUp 0.6s ease forwards ${idx * 0.04}s`;

    // Category badge color
    const badgeColors = {
      'single-piece': 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      'assembled': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      'pencil': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      'sculpture': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'devbhoomi': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      'hyperrealism': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      'commissions': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'satire': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'murals': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    };

    const badgeClass = badgeColors[art.category] || 'bg-stone-500/20 text-stone-300 border-stone-500/30';
    const displaySize = art.size || art.dimensions || '';

    card.innerHTML = `
      <div class="relative overflow-hidden aspect-[4/5] bg-stone-950 flex items-center justify-center cursor-pointer select-none art-image-wrap" data-id="${art.id}" data-macro-artwork="${art.id}" role="button" tabindex="0" style="touch-action: manipulation;">
        <img 
          src="${art.image}" 
          alt="${art.title}" 
          loading="lazy"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        <!-- Hover Overlay with Quick Actions -->
        <div class="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
          <div class="flex items-center gap-2 mb-3">
            <button class="macro-inspect-btn flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all" data-id="${art.id}">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
              Macro Inspect (2x-8x)
            </button>
            <button class="whatsapp-card-btn p-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all" data-id="${art.id}" title="Inquire on WhatsApp">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.073.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.203c.043.072.043.419-.101.824z"/></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs text-stone-300">
            <span class="truncate font-light">${art.location}</span>
            ${art.scaleImage ? `<span class="text-emerald-400 font-mono text-[10px] bg-stone-900/90 px-2 py-0.5 rounded border border-emerald-500/30">📏 MM Scale Included</span>` : ''}
          </div>
        </div>

        <!-- Category Floating Badge -->
        <span class="absolute top-3.5 left-3.5 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded-full border backdrop-blur-md ${badgeClass}">
          ${art.categoryLabel}
        </span>

        <!-- Scale Badge -->
        ${displaySize ? `
          <span class="absolute top-3.5 right-3.5 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-stone-950/85 text-amber-300 border border-amber-500/35 backdrop-blur-md">
            📏 ${displaySize}
          </span>
        ` : ''}
      </div>

      <!-- Card Details -->
      <div class="p-5 flex flex-col justify-between flex-1">
        <div>
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <h3 class="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-300 transition-colors leading-snug line-clamp-1">
              ${art.title}
            </h3>
            <span class="text-xs font-mono text-amber-500/80 whitespace-nowrap">${art.year || ''}</span>
          </div>
          
          ${art.hindiQuote ? `
            <p class="font-devanagari text-xs text-amber-300/90 italic mb-2 leading-relaxed truncate">"${art.hindiQuote}"</p>
          ` : (art.hindiTitle ? `
            <p class="text-xs font-serif text-amber-400/80 mb-2 truncate">${art.hindiTitle}</p>
          ` : '')}

          <p class="text-xs text-stone-400 mb-3 line-clamp-2 leading-relaxed font-light min-h-[2.5rem]">
            ${art.description}
          </p>
        </div>

        <div class="pt-3 border-t border-stone-800/60 flex items-center justify-between text-xs mt-auto">
          <span class="text-stone-400 truncate max-w-[180px] font-light">${art.medium}</span>
          <button class="inquire-quick-link text-amber-400 hover:text-amber-300 font-medium inline-flex items-center gap-1 group/btn" data-id="${art.id}">
            Book Art
            <svg class="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Click on image opens Macro Viewer
    card.querySelector('.art-image-wrap').addEventListener('click', (e) => {
      if (e.target.closest('.whatsapp-card-btn')) return;
      window.openMacroViewer(art.id);
    });

    // Macro Inspect button
    card.querySelector('.macro-inspect-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      window.openMacroViewer(art.id);
    });

    // Direct WhatsApp booking button
    card.querySelector('.whatsapp-card-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      window.openWhatsAppInquiry(art);
    });

    card.querySelector('.inquire-quick-link').addEventListener('click', (e) => {
      e.stopPropagation();
      window.openWhatsAppInquiry(art);
    });

    container.appendChild(card);
  });
}

// Category filter setup
function setupCategoryFilters() {
  const filterButtons = document.querySelectorAll('.gallery-filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active-tab', 'bg-amber-500', 'text-stone-950', 'shadow-amber-500/20');
        b.classList.add('bg-stone-900/60', 'text-stone-300');
      });

      btn.classList.add('active-tab', 'bg-amber-500', 'text-stone-950', 'shadow-amber-500/20');
      btn.classList.remove('bg-stone-900/60', 'text-stone-300');

      const cat = btn.dataset.category;
      renderGallery(cat);
    });
  });
}

// Mobile navigation toggle
function setupMobileNav() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-nav-close');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.remove('hidden');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    }

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
}

// Featured carousel
function setupFeaturedCarousel() {
  const carouselTrack = document.getElementById('featured-carousel-track');
  if (!carouselTrack) return;

  const catalog = getActiveCatalog();
  const featuredItems = catalog.filter(a => a.featured);

  carouselTrack.innerHTML = featuredItems.map(item => `
    <div class="carousel-slide flex-shrink-0 w-80 sm:w-96 rounded-2xl overflow-hidden bg-stone-900/80 border border-stone-800 hover:border-amber-500/40 transition-all p-4 cursor-pointer group" data-id="${item.id}" onclick="window.openMacroViewer('${item.id}')">
      <div class="relative aspect-video rounded-xl overflow-hidden bg-stone-950 mb-4">
        <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
        <span class="absolute top-3 left-3 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
          ${item.categoryLabel}
        </span>
      </div>
      <h4 class="font-serif text-base font-bold text-stone-100 group-hover:text-amber-300 transition-colors">${item.title}</h4>
      <p class="text-xs text-stone-400 mt-1 line-clamp-2 font-light">${item.description}</p>
      <div class="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
        <span class="text-amber-400 font-medium">Inspect Macro 🔎</span>
        <span class="text-stone-400 font-mono text-[11px]">${item.size || item.dimensions}</span>
      </div>
    </div>
  `).join('');

  // Auto scroll logic for carousel
  let scrollAmount = 0;
  const slideWidth = 340;
  
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -slideWidth, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: slideWidth, behavior: 'smooth' });
    });
  }
}

// Theme mode toggle (Warm Gallery Linen vs Midnight Studio)
function setupThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('artkgs_theme') || 'dark';
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('artkgs_theme', newTheme);
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.remove('theme-linen');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.add('theme-linen');
  }
}

// Ambient Audio (Sacred Ganga River & Tibetan Singing Bowl Chime)
function setupAmbientSound() {
  const audioBtn = document.getElementById('ambient-audio-btn');
  const audioEl = document.getElementById('ambient-audio');
  if (!audioBtn || !audioEl) return;

  let isPlaying = false;

  audioBtn.addEventListener('click', () => {
    if (!isPlaying) {
      audioEl.play().then(() => {
        isPlaying = true;
        audioBtn.classList.add('active-audio');
        audioBtn.querySelector('span').textContent = 'Mute Ganga Ambience';
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    } else {
      audioEl.pause();
      isPlaying = false;
      audioBtn.classList.remove('active-audio');
      audioBtn.querySelector('span').textContent = 'Play Ganga Ambience';
    }
  });
}

// Dynamic header scroll effect
function setupHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('py-2.5', 'bg-stone-950/95', 'shadow-xl', 'border-amber-500/20');
      header.classList.remove('py-3.5', 'bg-stone-950/85');
    } else {
      header.classList.remove('py-2.5', 'bg-stone-950/95', 'shadow-xl', 'border-amber-500/20');
      header.classList.add('py-3.5', 'bg-stone-950/85');
    }
  });
}
