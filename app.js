/**
 * app.js — UPGRADED homepage logic for Shonowear
 * 
 * Changes from original:
 * - renderFeaturedProducts(): renders 6 items (was inline only)
 * - renderNewArrivals(): renders 4 new-arrival items for preview
 * - Sticky navbar scroll detection (adds .scrolled class)
 * - Search dropdown toggle
 * - Scroll-triggered fade-in for sections
 * - Newsletter subscribe handler
 * - Original addToCart/updateNav/toast functions preserved in main.js
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── FEATURED PRODUCTS (6 items) ──────────────────────────────
  const featuredEl = document.getElementById('featured-products');
  if (featuredEl && typeof products !== 'undefined') {
    // Show first 6 products as featured
    const featured = products.slice(0, 6);
    featuredEl.innerHTML = featured.map(p => renderProductCard(p)).join('');
  }

  // ── NEW ARRIVALS PREVIEW (4 isNew items) ─────────────────────
  const newArrivalsEl = document.getElementById('new-arrivals-preview');
  if (newArrivalsEl && typeof products !== 'undefined') {
    const newItems = products.filter(p => p.isNew).slice(0, 4);
    newArrivalsEl.innerHTML = newItems.map(p => renderProductCard(p)).join('');
  }

  // ── STICKY NAVBAR: add .scrolled class on scroll ──────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── SEARCH DROPDOWN TOGGLE ───────────────────────────────────
  const searchToggle = document.getElementById('search-toggle');
  const searchDropdown = document.getElementById('search-dropdown');
  const searchInput = document.getElementById('search-input');

  if (searchToggle && searchDropdown) {
    searchToggle.addEventListener('click', () => {
      searchDropdown.classList.toggle('open');
      if (searchDropdown.classList.contains('open') && searchInput) {
        setTimeout(() => searchInput.focus(), 300);
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!searchToggle.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('open');
      }
    });

    // Enter key to search
    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') doSearch();
      });
    }
  }

  // ── FADE-IN SECTIONS ON SCROLL ───────────────────────────────
  const fadeSections = document.querySelectorAll('.fade-in-section');
  if ('IntersectionObserver' in window && fadeSections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeSections.forEach(section => observer.observe(section));
  } else {
    // Fallback: show all immediately
    fadeSections.forEach(s => s.classList.add('visible'));
  }

});

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
  if (!emailEl) return;
  const email = emailEl.value.trim();
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRx.test(email)) {
    if (typeof toast === 'function') {
      toast('Please enter a valid email address.', 'error');
    }
    return;
  }

  // Simulate subscription success
  emailEl.value = '';
  if (typeof toast === 'function') {
    toast('You\'re in! Welcome to the Shonowear community 🎉', 'success');
  }
}
