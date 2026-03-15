// collection.js

let filteredProducts = [...products];
let activeFilters = {
  category: '', type: '', anime: '', sort: 'newest', maxPrice: 10000, search: ''
};

// build anime list from products
function getAnimeList() {
  const all = [...new Set(products.map(p => p.anime).filter(a => a && a !== 'Mixed'))];
  return all.sort();
}

function buildAnimeDropdown() {
  const sel = document.getElementById('anime-filter');
  if (!sel) return;
  const animes = getAnimeList();
  animes.forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    sel.appendChild(opt);
  });
}

function filterProducts() {
  activeFilters.category = document.getElementById('category-filter').value;
  activeFilters.type     = document.getElementById('type-filter').value;
  activeFilters.anime    = document.getElementById('anime-filter')?.value || '';
  activeFilters.sort     = document.getElementById('sort-filter').value;
  activeFilters.maxPrice = parseInt(document.getElementById('price-filter').value);

  applyFilters();
  updatePriceDisplay();
}

// search within current filters
function searchProducts() {
  activeFilters.search = document.getElementById('search-input').value.toLowerCase().trim();
  applyFilters();
}

function applyFilters() {
  filteredProducts = products.filter(p => {
    const catMatch   = !activeFilters.category || p.category === activeFilters.category;
    const typeMatch  = !activeFilters.type     || p.type.toLowerCase().includes(activeFilters.type.toLowerCase());
    const animeMatch = !activeFilters.anime    || p.anime === activeFilters.anime;
    const priceMatch = p.price <= activeFilters.maxPrice;
    const searchMatch = !activeFilters.search  ||
      p.name.toLowerCase().includes(activeFilters.search) ||
      (p.anime || '').toLowerCase().includes(activeFilters.search) ||
      p.type.toLowerCase().includes(activeFilters.search);
    return catMatch && typeMatch && animeMatch && priceMatch && searchMatch;
  });

  switch (activeFilters.sort) {
    case 'price-low':  filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price-high': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'name-a':     filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-z':     filteredProducts.sort((a, b) => b.name.localeCompare(a.name)); break;
    default:           filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  renderProducts();
  updatePriceDisplay();
}

function updatePriceDisplay() {
  const el = document.getElementById('price-value');
  if (el) el.textContent = '₹' + activeFilters.maxPrice.toLocaleString();
}


function renderActiveFilterChips() {
  const bar = document.getElementById('active-filters-bar');
  if (!bar) return;
  const chips = [];
  if (activeFilters.category) chips.push({ label: activeFilters.category, key: 'category' });
  if (activeFilters.type)     chips.push({ label: activeFilters.type,     key: 'type' });
  if (activeFilters.anime)    chips.push({ label: activeFilters.anime,    key: 'anime' });
  if (activeFilters.search)   chips.push({ label: `"${activeFilters.search}"`, key: 'search' });
  if (activeFilters.maxPrice < 10000) chips.push({ label: `Max ₹${activeFilters.maxPrice.toLocaleString()}`, key: 'maxPrice' });

  if (!chips.length) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  bar.innerHTML = `<span class="afc-label">Active:</span>` + chips.map(c => `
    <button class="afc-chip" onclick="clearFilter('${c.key}')">
      ${c.label} <i class="fas fa-times"></i>
    </button>`).join('') + `<button class="afc-clear-all" onclick="resetFilters()">Clear all</button>`;
}

function clearFilter(key) {
  if (key === 'category') { activeFilters.category = ''; document.getElementById('category-filter').value = ''; }
  if (key === 'type')     { activeFilters.type = ''; document.getElementById('type-filter').value = ''; }
  if (key === 'anime')    { activeFilters.anime = ''; const el = document.getElementById('anime-filter'); if (el) el.value = ''; }
  if (key === 'search')   { activeFilters.search = ''; document.getElementById('search-input').value = ''; }
  if (key === 'maxPrice') { activeFilters.maxPrice = 10000; document.getElementById('price-filter').value = '10000'; }
  applyFilters();
}

function renderProducts() {
  const grid    = document.getElementById('products-grid');
  const noRes   = document.getElementById('no-res');
  // result count element
  const counter = document.getElementById('result-count');
  if (!grid) return;

  if (filteredProducts.length === 0) {
    grid.style.display = 'none';
    if (noRes) noRes.style.display = 'block';
    if (counter) counter.textContent = '0 items found';
    renderActiveFilterChips();
    return;
  }

  grid.style.display = 'grid';
  if (noRes) noRes.style.display = 'none';
  // update count
  if (counter) counter.textContent = `${filteredProducts.length} item${filteredProducts.length !== 1 ? 's' : ''} found`;
  renderActiveFilterChips();

  grid.innerHTML = filteredProducts.map(p => renderProductCard(p)).join('');

  // stagger cards in
  grid.querySelectorAll('.prd-card').forEach((c, i) => {
    c.style.cssText = `opacity:0;transform:translateY(16px);transition:opacity .35s ease ${i * .045}s,transform .35s ease ${i * .045}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      c.style.opacity = '1'; c.style.transform = 'translateY(0)';
    }));
  });

  // wishlist toggle
  grid.querySelectorAll('.prd-wish').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const { pid, pname, pprice, ptype } = btn.dataset;
      const icon = btn.querySelector('i');
      if (typeof toggleWishItem === 'function' && pid) {
        const wished = toggleWishItem(pid, pname, parseInt(pprice), ptype);
        icon.className   = wished ? 'fas fa-heart' : 'far fa-heart';
        icon.style.color = wished ? 'var(--red)' : '';
        if (typeof toast === 'function') toast(wished ? 'Saved ❤️' : 'Removed', 'info');
      }
    });
  });
}

function resetFilters() {
  document.getElementById('category-filter').value = '';
  document.getElementById('type-filter').value     = '';
  if (document.getElementById('anime-filter')) document.getElementById('anime-filter').value = '';
  document.getElementById('sort-filter').value     = 'newest';
  document.getElementById('price-filter').value    = '10000';
  document.getElementById('search-input').value    = '';
  activeFilters = { category: '', type: '', anime: '', sort: 'newest', maxPrice: 10000, search: '' };
  applyFilters();
}

// read URL params on load
document.addEventListener('DOMContentLoaded', () => {
  buildAnimeDropdown();

  const params = new URLSearchParams(window.location.search);
  const q      = params.get('q');
  const type   = params.get('type');
  const style  = params.get('style');
  const anime  = params.get('anime');

  const typeMap = {
    streetwear: 'hoodie', minimal: 'tee', oversized: 'oversized',
    figurines: 'figurine', jackets: 'jacket'
  };

  if (q) {
    document.getElementById('search-input').value = q;
    activeFilters.search = q.toLowerCase();
  }
  if (type) {
    const mapped = typeMap[type] || type;
    const el = document.getElementById('type-filter');
    if (el) { el.value = mapped; activeFilters.type = mapped; }
  }
  if (style) {
    const mapped = typeMap[style] || style;
    const el = document.getElementById('type-filter');
    if (el) { el.value = mapped; activeFilters.type = mapped; }
  }
  if (anime) {
    const el = document.getElementById('anime-filter');
    if (el) { el.value = anime; activeFilters.anime = anime; }
  }

  applyFilters();

  // live search
  const si = document.getElementById('search-input');
  if (si) {
    si.addEventListener('input', () => {
      activeFilters.search = si.value.toLowerCase().trim();
      applyFilters();
    });
  }

  // navbar scroll state
  const nb = document.getElementById('navbar');
  const pr = document.getElementById('nav-progress');
  window.addEventListener('scroll', () => {
    nb?.classList.toggle('scrolled', window.scrollY > 60);
    if (pr) pr.style.width = Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100) + '%';
  }, { passive: true });
});
