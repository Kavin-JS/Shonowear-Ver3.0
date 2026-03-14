/**
 * app.js — Shonowear Pass 4: Startup Visual Overhaul
 * Clean architecture — no pitch-deck sections, image-first
 */

/* ── UTILITIES ───────────────────────────────────────────────── */
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ── BOOT ────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initNavSearch();
  initProducts();
  initLookbook();
  initFadeIn();
  initProofCounters();
  initCollReel();
});

/* ── 1. NAVBAR ───────────────────────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const progress = document.getElementById('nav-progress');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    if (progress) {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      progress.style.width = Math.min(pct, 100) + '%';
    }
  }, { passive: true });
}

/* ── 2. LIVE SEARCH ──────────────────────────────────────────── */
function initNavSearch() {
  const input   = document.getElementById('nav-search-input');
  const results = document.getElementById('nav-search-results');
  if (!input || !results) return;

  const run = debounce((q) => {
    if (!q || q.length < 2) { results.classList.remove('open'); return; }
    if (typeof products === 'undefined') return;
    const hits = products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.anime||'').toLowerCase().includes(q.toLowerCase())
    ).slice(0, 7);

    results.innerHTML = hits.length
      ? hits.map(p => `
          <div class="nsr-item" onclick="window.location='collection.html?q=${encodeURIComponent(p.name)}'">
            <div class="nsr-emoji">${p.img}</div>
            <div>
              <span class="nsr-name">${hl(p.name, q)}</span>
              <span class="nsr-price">₹${p.price.toLocaleString()}</span>
            </div>
          </div>`).join('')
      : `<div class="nsr-empty">No results for "${q}"</div>`;
    results.classList.add('open');
  }, 180);

  input.addEventListener('input',   e => run(e.target.value.trim()));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = input.value.trim(); if (v) window.location.href = `collection.html?q=${encodeURIComponent(v)}`; }
    if (e.key === 'Escape') results.classList.remove('open');
  });
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !results.contains(e.target)) results.classList.remove('open');
  });
}
function hl(text, q) {
  return text.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'),
    '<mark>$1</mark>');
}

/* Mobile search */
function doMobSearch() {
  const v = document.getElementById('mob-search-input')?.value.trim();
  if (v) window.location.href = `collection.html?q=${encodeURIComponent(v)}`;
}
function doSearch() {
  const v = document.getElementById('search-input')?.value.trim();
  if (v) window.location.href = `collection.html?q=${encodeURIComponent(v)}`;
}

/* ── 3. PRODUCTS ─────────────────────────────────────────────── */
function initProducts() {
  const skeleton = document.getElementById('prod-skeleton');
  const grid     = document.getElementById('featured-products');
  if (!grid) return;

  // Show skeleton briefly, then reveal real grid
  setTimeout(() => {
    if (skeleton) skeleton.style.display = 'none';
    grid.style.display = 'grid';
    renderProdGrid('all');
    stagger(grid);
    renderNewArrivals();
  }, 550);

  // Filter tabs
  document.querySelectorAll('#prod-filters .pf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#prod-filters .pf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      grid.style.cssText = 'opacity:0;transform:translateY(8px);transition:opacity .2s,transform .2s;display:grid';
      setTimeout(() => {
        renderProdGrid(btn.dataset.filter);
        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        stagger(grid);
      }, 200);
    });
  });
}

function renderProdGrid(filter) {
  const grid = document.getElementById('featured-products');
  if (!grid || typeof products === 'undefined') return;
  const subset = filter === 'all'
    ? products.slice(0, 8)
    : products.filter(p => p.type === filter).slice(0, 8);
  grid.innerHTML = subset.length
    ? subset.map(p => renderProductCard(p)).join('')
    : `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--muted)"><i class="fas fa-box-open" style="font-size:2.5rem;display:block;margin-bottom:14px;opacity:.3"></i>No items in this category yet.</div>`;
  attachWish(grid);
}

function renderNewArrivals() {
  const el = document.getElementById('new-arrivals-preview');
  if (!el || typeof products === 'undefined') return;
  const items = products.filter(p => p.isNew).slice(0, 4);
  el.innerHTML = items.map(p => renderProductCard(p)).join('');
  attachWish(el);
  stagger(el);
}

function stagger(grid) {
  grid.querySelectorAll('.prd-card').forEach((c, i) => {
    c.style.cssText = `opacity:0;transform:translateY(18px);transition:opacity .4s ease ${i*.065}s,transform .4s ease ${i*.065}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.style.opacity = '1'; c.style.transform = 'translateY(0)';
    }));
  });
}

function attachWish(grid) {
  grid.querySelectorAll('.prd-wish').forEach(btn => {
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener('click', e => {
      e.stopPropagation();
      const icon = fresh.querySelector('i');
      const on = icon.classList.contains('fas');
      icon.className = on ? 'far fa-heart' : 'fas fa-heart';
      icon.style.color = on ? '' : 'var(--red)';
      if (typeof toast === 'function') toast(on ? 'Removed from wishlist' : 'Saved ❤️', 'info');
    });
  });
}

/* ── 4. LOOKBOOK FILTER ──────────────────────────────────────── */
function initLookbook() {
  const tabs  = document.querySelectorAll('.lb-tab');
  const cards = document.querySelectorAll('.lb-card');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const u = tab.dataset.lb;
      cards.forEach(card => {
        const match = u === 'all' || card.dataset.universe === u;
        card.style.transition = 'opacity .3s,transform .3s';
        card.style.opacity    = match ? '1' : '0.12';
        card.style.transform  = match ? 'scale(1)' : 'scale(.97)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });
}

/* ── 5. FADE-IN ON SCROLL ────────────────────────────────────── */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in-section');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.07 });
  els.forEach(e => io.observe(e));
}

/* ── 6. PROOF COUNTERS ───────────────────────────────────────── */
function initProofCounters() {
  document.querySelectorAll('.proof-num[data-target]').forEach(el => {
    const target  = parseFloat(el.dataset.target);
    const dec     = parseInt(el.dataset.decimal || '0');
    const suffix  = el.dataset.suffix || '';
    const dur     = 1600;
    const start   = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (dec ? (e * target).toFixed(dec) : Math.floor(e * target)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

/* ── 7. COLLECTION REEL DRAG ─────────────────────────────────── */
function initCollReel() {
  const reel = document.querySelector('.coll-reel');
  if (!reel) return;
  // Keyboard-navigable collection clicks already handled via onclick in HTML
}

function goCollection(type) {
  window.location.href = `collection.html?type=${encodeURIComponent(type)}`;
}

/* ── 8. NEWSLETTER ───────────────────────────────────────────── */
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
    setTimeout(() => { btn.innerHTML = 'Subscribe <i class="fas fa-arrow-right"></i>'; btn.style.background = ''; btn.disabled = false; }, 3500);
  }, 1200);
}
