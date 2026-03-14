/**
 * app.js — Shonowear Pass 3: Startup Product Prototype
 *
 * Architecture:
 *   1. Navbar — scroll state, progress bar, live search with debounce
 *   2. Hero   — stat counter animation on load
 *   3. Lookbook — universe filter tabs
 *   4. Products — skeleton → grid with filter tabs, staggered entrance
 *   5. Collections reel — click to navigate to collection page
 *   6. Scroll fade-in — IntersectionObserver on all .fade-in-section
 *   7. Newsletter — loading state + success swap
 *   8. Wishlist heart toggle
 *   9. Mobile search forward to collection page
 *  10. Cart pulse on add
 *
 * All original functions (addToCart, updateNav, logout, toast,
 * showPop, closePop, openMob, closeMob, renderProductCard)
 * are preserved in main.js — DO NOT duplicate here.
 */

/* ── DEBOUNCE UTILITY ────────────────────────────────────────── */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ── DOM READY ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  initNavbar();
  initHeroCounters();
  initNavSearch();
  initLookbook();
  initProducts();
  initFadeIn();
  initCollectionReel();

});

/* ══════════════════════════════════════════════════════════════
   1. NAVBAR
   ══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('nav-progress');

  if (!navbar) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;

    // Sticky state
    navbar.classList.toggle('scrolled', scrolled > 60);

    // Scroll progress bar
    if (progress) {
      progress.style.width = Math.min((scrolled / docHeight) * 100, 100) + '%';
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════════════════════
   2. HERO COUNTERS
   ══════════════════════════════════════════════════════════════ */
function initHeroCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  counters.forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const decimal = parseInt(el.dataset.decimal || '0');
    const dur     = 1800;
    const start   = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      const val = eased * target;
      el.textContent = decimal ? val.toFixed(decimal) : Math.floor(val);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ══════════════════════════════════════════════════════════════
   3. NAVBAR LIVE SEARCH
   ══════════════════════════════════════════════════════════════ */
function initNavSearch() {
  const input   = document.getElementById('nav-search-input');
  const results = document.getElementById('nav-search-results');
  if (!input || !results) return;

  const search = debounce((q) => {
    if (!q || q.length < 2) { results.classList.remove('open'); return; }
    if (typeof products === 'undefined') return;

    const matches = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.anime || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.tag  || '').toLowerCase().includes(q.toLowerCase())
    ).slice(0, 8);

    if (!matches.length) {
      results.innerHTML = `<div class="nsr-empty">No results for "${q}"</div>`;
    } else {
      results.innerHTML = matches.map(p => `
        <div class="nsr-item" onclick="window.location='collection.html?q=${encodeURIComponent(p.name)}'">
          <div class="nsr-emoji">${p.img}</div>
          <div class="nsr-info">
            <div class="nsr-name">${highlightMatch(p.name, q)}</div>
            <div class="nsr-price">₹${p.price.toLocaleString()}</div>
          </div>
        </div>
      `).join('');
    }
    results.classList.add('open');
  }, 200);

  input.addEventListener('input', e => search(e.target.value.trim()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) window.location.href = `collection.html?q=${encodeURIComponent(q)}`;
    }
    if (e.key === 'Escape') results.classList.remove('open');
  });

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) {
      results.classList.remove('open');
    }
  });
}

function highlightMatch(text, q) {
  const rx = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(rx, '<mark style="background:rgba(232,21,58,0.3);color:#fff;">$1</mark>');
}

/* Mobile search */
function doMobSearch() {
  const val = document.getElementById('mob-search-input')?.value.trim();
  if (val) window.location.href = `collection.html?q=${encodeURIComponent(val)}`;
}

/* Kept for backward compat (old search dropdown) */
function doSearch() {
  const val = document.getElementById('search-input')?.value.trim();
  if (val) window.location.href = `collection.html?q=${encodeURIComponent(val)}`;
}

/* ══════════════════════════════════════════════════════════════
   4. LOOKBOOK FILTER
   ══════════════════════════════════════════════════════════════ */
function initLookbook() {
  const filters = document.querySelectorAll('.lb-filter');
  const cards   = document.querySelectorAll('.lb-card');
  if (!filters.length) return;

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const universe = btn.dataset.lb;
      cards.forEach(card => {
        const match = universe === 'all' || card.dataset.universe === universe;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity    = match ? '1' : '0.15';
        card.style.transform  = match ? 'scale(1)' : 'scale(0.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   5. PRODUCT GRID — skeleton, filter tabs, staggered render
   ══════════════════════════════════════════════════════════════ */
function initProducts() {
  const skeleton  = document.getElementById('prd-skeleton');
  const grid      = document.getElementById('featured-products');
  const tabs      = document.querySelectorAll('#prod-tabs .feat-tab');
  if (!grid) return;

  // Brief skeleton then render
  setTimeout(() => {
    skeleton && (skeleton.style.display = 'none');
    grid.style.display = 'grid';
    renderGrid('all');
    animateCardsIn(grid);
    initNewArrivals();
  }, 600);

  // Filter tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      // Fade out
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(8px)';
      grid.style.transition = 'opacity 0.2s, transform 0.2s';

      setTimeout(() => {
        renderGrid(filter);
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        animateCardsIn(grid);
      }, 220);
    });
  });
}

function renderGrid(filter) {
  const grid = document.getElementById('featured-products');
  if (!grid || typeof products === 'undefined') return;

  let subset = filter === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.type === filter).slice(0, 8);

  if (!subset.length) {
    grid.innerHTML = `<div class="no-results"><i class="fas fa-box-open"></i><p>No items in this category yet.</p></div>`;
    return;
  }

  grid.innerHTML = subset.map(p => renderProductCard(p)).join('');
  attachWishlistListeners(grid);
}

function initNewArrivals() {
  const el = document.getElementById('new-arrivals-preview');
  if (!el || typeof products === 'undefined') return;
  const newItems = products.filter(p => p.isNew).slice(0, 4);
  el.innerHTML = newItems.map(p => renderProductCard(p)).join('');
  attachWishlistListeners(el);
}

function animateCardsIn(grid) {
  const cards = grid.querySelectorAll('.prd-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }));
  });
}

function attachWishlistListeners(grid) {
  grid.querySelectorAll('.prd-wish').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', e => {
      e.stopPropagation();
      const icon = fresh.querySelector('i');
      const wished = icon.classList.contains('fas');
      icon.className = wished ? 'far fa-heart' : 'fas fa-heart';
      icon.style.color = wished ? '' : 'var(--red)';
      if (typeof toast === 'function') toast(wished ? 'Removed from wishlist' : 'Saved to wishlist ❤️', 'info');
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   6. SCROLL FADE-IN
   ══════════════════════════════════════════════════════════════ */
function initFadeIn() {
  const sections = document.querySelectorAll('.fade-in-section');
  if (!('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });
  sections.forEach(s => io.observe(s));
}

/* ══════════════════════════════════════════════════════════════
   7. COLLECTIONS REEL — navigate with query param
   ══════════════════════════════════════════════════════════════ */
function initCollectionReel() {
  // Touch/mouse drag scroll for collections reel
  const reel = document.querySelector('.collections-reel');
  if (!reel) return;

  let isDown = false, startX = 0, scrollLeft = 0;
  reel.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - reel.offsetLeft; scrollLeft = reel.scrollLeft; });
  reel.addEventListener('mouseleave', () => isDown = false);
  reel.addEventListener('mouseup', () => isDown = false);
  reel.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - reel.offsetLeft;
    reel.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
}

function goCollection(style) {
  window.location.href = `collection.html?style=${encodeURIComponent(style)}`;
}

/* ══════════════════════════════════════════════════════════════
   8. NEWSLETTER
   ══════════════════════════════════════════════════════════════ */
function nlSubscribe() {
  const emailEl = document.getElementById('nl-email');
  const btn     = document.getElementById('nl-btn');
  if (!emailEl || !btn) return;

  const email = emailEl.value.trim();
  const rx    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !rx.test(email)) {
    emailEl.style.borderColor = 'var(--red)';
    emailEl.focus();
    setTimeout(() => emailEl.style.borderColor = '', 1600);
    if (typeof toast === 'function') toast('Please enter a valid email.', 'error');
    return;
  }

  btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
  btn.disabled = true;

  setTimeout(() => {
    emailEl.value = '';
    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
    btn.style.background = '#10b981';
    if (typeof toast === 'function') toast("You're in! Welcome to the community 🎉", 'success');
    setTimeout(() => {
      btn.innerHTML = 'Subscribe <i class="fas fa-arrow-right"></i>';
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  }, 1200);
}
