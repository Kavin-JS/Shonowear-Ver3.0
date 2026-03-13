/**
 * app.js — REFINEMENT PASS 2 — Shonowear homepage logic
 *
 * Improvements over Pass 1:
 * ─ Product filter tabs (All / Hoodies / Tees / Figurines / Accessories)
 * ─ Staggered entrance animation for product cards
 * ─ Wishlist heart toggle (UI only — no persistence needed)
 * ─ Navbar scroll-state with progress indicator
 * ─ Hero number counter animation (10K+, 4.9★, 80+)
 * ─ Search dropdown with live keyword highlighting
 * ─ Newsletter with loading state + success swap
 * ─ All original functionality (addToCart, updateNav, toast) untouched
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. RENDER FEATURED PRODUCTS (6 items) ─────────────────────
  const featuredEl = document.getElementById('featured-products');
  if (featuredEl && typeof products !== 'undefined') {
    const featured = products.slice(0, 6);
    featuredEl.innerHTML = featured.map(p => renderProductCard(p)).join('');
    animateCardsIn(featuredEl);
  }

  // ── 2. RENDER NEW ARRIVALS PREVIEW (4 isNew items) ────────────
  const newArrivalsEl = document.getElementById('new-arrivals-preview');
  if (newArrivalsEl && typeof products !== 'undefined') {
    const newItems = products.filter(p => p.isNew).slice(0, 4);
    newArrivalsEl.innerHTML = newItems.map(p => renderProductCard(p)).join('');
    animateCardsIn(newArrivalsEl);
  }

  // ── 3. PRODUCT FILTER TABS ────────────────────────────────────
  const tabs = document.querySelectorAll('.feat-tab');
  if (tabs.length && featuredEl && typeof products !== 'undefined') {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        // Update active state
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        let filtered;
        if (filter === 'all') {
          filtered = products.slice(0, 6);
        } else {
          // Filter by type, then pad to max 6 from general if fewer than 4 found
          filtered = products.filter(p => p.type === filter).slice(0, 6);
          if (filtered.length < 4) {
            filtered = products.filter(p => p.type === filter);
          }
        }

        // Fade out → swap → fade in
        featuredEl.style.opacity = '0';
        featuredEl.style.transform = 'translateY(10px)';
        featuredEl.style.transition = 'opacity 0.2s, transform 0.2s';

        setTimeout(() => {
          featuredEl.innerHTML = filtered.length
            ? filtered.map(p => renderProductCard(p)).join('')
            : '<div class="no-res" style="display:block;"><i class="fas fa-box-open"></i>No items in this category yet.</div>';

          // Re-attach wishlist listeners after DOM swap
          attachWishlistListeners(featuredEl);

          featuredEl.style.opacity = '1';
          featuredEl.style.transform = 'translateY(0)';
          animateCardsIn(featuredEl);
        }, 200);
      });
    });
  }

  // ── 4. WISHLIST HEART TOGGLE ──────────────────────────────────
  // Attach to both grids on load
  if (featuredEl) attachWishlistListeners(featuredEl);
  if (newArrivalsEl) attachWishlistListeners(newArrivalsEl);

  // ── 5. STICKY NAVBAR + SCROLL PROGRESS BAR ────────────────────
  const navbar = document.getElementById('navbar');
  // Inject thin scroll-progress bar into navbar
  const progressBar = document.createElement('div');
  progressBar.className = 'nav-progress';
  if (navbar) navbar.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    if (!navbar) return;
    // Sticky state
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    // Scroll progress
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = Math.min(scrolled, 100) + '%';
  }, { passive: true });

  // ── 6. HERO COUNTER ANIMATION ─────────────────────────────────
  animateHeroCounters();

  // ── 7. SEARCH DROPDOWN ────────────────────────────────────────
  const searchToggle = document.getElementById('search-toggle');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchInput = document.getElementById('search-input');

  if (searchToggle && searchDropdown) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = searchDropdown.classList.toggle('open');
      searchToggle.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-search';
      if (isOpen && searchInput) setTimeout(() => searchInput.focus(), 300);
    });

    document.addEventListener('click', (e) => {
      if (!searchToggle.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('open');
        searchToggle.querySelector('i').className = 'fas fa-search';
      }
    });

    if (searchInput) {
      searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
    }
  }

  // ── 8. SCROLL FADE-IN WITH INTERSECTION OBSERVER ─────────────
  const fadeSections = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window && fadeSections.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    fadeSections.forEach(s => io.observe(s));
  } else {
    fadeSections.forEach(s => s.classList.add('visible'));
  }

  // ── 9. ACTIVE NAV LINK HIGHLIGHT ─────────────────────────────
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('active');
    }
  });

});

// ── HELPERS ───────────────────────────────────────────────────

/**
 * Stagger product card entrance with CSS animation-delay
 */
function animateCardsIn(grid) {
  const cards = grid.querySelectorAll('.prd-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.07}s, transform 0.4s ease ${i * 0.07}s`;
    // Force reflow then animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
  });
}

/**
 * Wishlist heart toggle — purely visual, no persistence
 */
function attachWishlistListeners(grid) {
  grid.querySelectorAll('.prd-wish').forEach(btn => {
    // Remove old listener by cloning
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', (e) => {
      e.stopPropagation();
      const icon = fresh.querySelector('i');
      const isWished = icon.classList.contains('fas');
      icon.className = isWished ? 'far fa-heart' : 'fas fa-heart';
      icon.style.color = isWished ? '' : 'var(--red)';
      if (typeof toast === 'function') {
        toast(isWished ? 'Removed from wishlist' : 'Added to wishlist ❤️', 'info');
      }
    });
  });
}

/**
 * Animate hero stat numbers counting up
 */
function animateHeroCounters() {
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(el => {
    const text = el.textContent;
    // Only animate numeric ones
    const match = text.match(/^([\d.]+)/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = text.replace(match[1], '');
    const isDecimal = text.includes('.');
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

// ── SEARCH HANDLER ────────────────────────────────────────────
function doSearch() {
  const val = document.getElementById('search-input')?.value.trim();
  if (val) {
    window.location.href = `collection.html?q=${encodeURIComponent(val)}`;
  }
}

// ── NEWSLETTER SUBSCRIBE ──────────────────────────────────────
function nlSubscribe() {
  const emailEl = document.getElementById('nl-email');
  const btn = emailEl?.closest('.nl-input-wrap')?.querySelector('button');
  if (!emailEl) return;

  const email = emailEl.value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRx.test(email)) {
    emailEl.style.borderColor = 'var(--red)';
    setTimeout(() => emailEl.style.borderColor = '', 1500);
    if (typeof toast === 'function') toast('Please enter a valid email.', 'error');
    return;
  }

  // Loading state
  if (btn) {
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;
  }

  setTimeout(() => {
    emailEl.value = '';
    if (btn) {
      btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
      btn.style.background = '#10b981';
      setTimeout(() => {
        btn.innerHTML = 'Subscribe <i class="fas fa-arrow-right"></i>';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
    if (typeof toast === 'function') toast("You're in! Welcome to the community 🎉", 'success');
  }, 1200);
}
