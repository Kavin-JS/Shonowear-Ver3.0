
function updateBreadcrumb(p) {
  const bcName = document.getElementById('pd-bc-name');
  const bcLink = document.querySelector('#pd-breadcrumb a[href="collection.html"]');
  if (bcName) bcName.textContent = p.name;
  // Preserve collection URL context if user came from collection
  if (bcLink && document.referrer) {
    try {
      const ref = new URL(document.referrer);
      if (ref.pathname.includes('collection')) {
        bcLink.href = ref.pathname + ref.search;
        // Show filter label if present
        const anime = ref.searchParams.get('anime');
        const type  = ref.searchParams.get('type');
        if (anime) bcLink.textContent = anime;
        else if (type) bcLink.textContent = type.charAt(0).toUpperCase() + type.slice(1) + 's';
      }
    } catch(e) {}
  }
}

// product.js — product detail page logic

let currentProduct = null;
let selectedSize    = null;
let qty             = 1;
let currentThumb    = 0;

// Multiple images per product type for the gallery
const GALLERY_IMAGES = {
  hoodie: [
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&auto=format&fit=crop&q=85',
  ],
  tee: [
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&auto=format&fit=crop&q=85',
  ],
  oversized: [
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&auto=format&fit=crop&q=85',
  ],
  jacket: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=800&auto=format&fit=crop&q=85',
  ],
  phone: [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=85',
  ],
  figurine: [
    'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1608889476561-6242cfdbf622?w=800&auto=format&fit=crop&q=85',
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get('id');

  if (!id || typeof products === 'undefined') {
    window.location.href = 'collection.html';
    return;
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    window.location.href = 'collection.html';
    return;
  }

  currentProduct = product;
  renderProduct(product);
  renderRelated(product);
  checkWishState(product.id);
  updateWishBadge();
  renderCompleteTheLook(product);

  // Wire image zoom lightbox
  const galleryImgs = GALLERY_IMAGES[product.type] || GALLERY_IMAGES.tee;
  _lbImages = galleryImgs.map(u => u.replace('w=800', 'w=1200'));
  const mainImg = document.getElementById('pd-main-img');
  if (mainImg) {
    mainImg.style.cursor = 'zoom-in';
    mainImg.addEventListener('click', () => {
      const currentBg = mainImg.style.backgroundImage.replace(/url\(['""]?|['""]?\)/g, '');
      const hi = currentBg.replace('w=800', 'w=1200');
      openLightbox(Math.max(0, _lbImages.indexOf(hi)));
    });
  }

  // Navbar scroll
  const nb = document.getElementById('navbar');
  const pr = document.getElementById('nav-progress');
  window.addEventListener('scroll', () => {
    nb?.classList.toggle('scrolled', window.scrollY > 60);
    if (pr) pr.style.width = Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100) + '%';
    document.getElementById('scroll-top')?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
});

function renderProduct(p) {
  // Page title + meta
  document.title = `${p.name} — Shonowear`;
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.content = `${p.name} — Shonowear`;

  const desc = p.desc || 'Premium quality anime-inspired streetwear. Built for culture, designed for comfort.';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = desc;
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.content = desc;

  // Breadcrumb
  const bcName = document.getElementById('pd-bc-name');
  if (bcName) bcName.textContent = p.name;

  // Gallery
  const images = GALLERY_IMAGES[p.type] || GALLERY_IMAGES.tee;
  const mainImg = document.getElementById('pd-main-img');
  mainImg.style.backgroundImage = `url('${images[0]}')`;

  // Thumbnails
  const thumbs = document.getElementById('pd-thumbs');
  thumbs.innerHTML = images.map((src, i) => `
    <div class="pd-thumb ${i === 0 ? 'active' : ''}"
         style="background-image:url('${src}')"
         onclick="switchThumb(${i})"></div>
  `).join('');

  // New badge
  if (p.isNew) document.getElementById('pd-new-badge').style.display = 'block';

  // Info
  document.getElementById('pd-universe').textContent   = p.anime || p.tag || '';
  document.getElementById('pd-name').textContent       = p.name;

  // Rating — deterministic from product id
  const numId   = parseInt(p.id.replace(/\D/g, '')) || 1;
  const ratings = [4.7, 4.8, 4.9, 5.0, 4.6, 4.8, 4.9, 5.0];
  const rating  = ratings[numId % ratings.length];
  const reviews = 12 + (numId * 7 % 88);
  document.getElementById('pd-rating-count').textContent = `${rating} (${reviews} reviews)`;

  // Price
  const orig = Math.ceil(p.price * 1.18 / 100) * 100;
  const disc = Math.round(((orig - p.price) / orig) * 100);
  document.getElementById('pd-price').textContent      = `₹${p.price.toLocaleString()}`;
  document.getElementById('pd-price-orig').textContent = `₹${orig.toLocaleString()}`;
  document.getElementById('pd-discount').textContent   = `${disc}% OFF`;

  // Sizes
  renderSizes(p);

  // Description
  document.getElementById('pd-desc').textContent = p.desc || 'Premium quality anime-inspired streetwear. Built for culture, designed for comfort.';
}

function renderSizes(p) {
  const sizes     = p.sizes || ['XS','S','M','L','XL','XXL'];
  const container = document.getElementById('pd-sizes');
  const section   = document.getElementById('pd-size-section');

  // Hide size section for accessories / figurines
  if (p.type === 'phone' || p.type === 'figurine') {
    section.style.display = 'none';
    selectedSize = 'Standard';
    return;
  }

  // Simulate stock — some sizes sold out based on product id
  const numId  = parseInt(p.id.replace(/\D/g, '')) || 0;
  const oosIdx = numId % sizes.length; // one size per product appears sold out

  container.innerHTML = sizes.map((sz, i) => `
    <button class="pd-size ${i === oosIdx ? 'unavailable' : ''}"
            data-size="${sz}"
            ${i === oosIdx ? 'disabled' : `onclick="selectSize('${sz}', this)"`}>
      ${sz}
    </button>
  `).join('');
}

function selectSize(size, el) {
  document.querySelectorAll('.pd-size').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  selectedSize = size;
}

function switchThumb(idx) {
  const images = GALLERY_IMAGES[currentProduct.type] || GALLERY_IMAGES.tee;
  document.getElementById('pd-main-img').style.backgroundImage = `url('${images[idx]}')`;
  document.querySelectorAll('.pd-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
  currentThumb = idx;
}

function changeQty(delta) {
  qty = Math.max(1, Math.min(10, qty + delta));
  document.getElementById('pd-qty').textContent = qty;
}

function pdAddToCart() {
  if (!currentProduct) return;

  // Check size selected (skip for phone/figurine)
  const needsSize = currentProduct.type !== 'phone' && currentProduct.type !== 'figurine';
  if (needsSize && !selectedSize) {
    // Highlight sizes
    document.getElementById('pd-sizes').style.animation = 'none';
    document.getElementById('pd-sizes').offsetHeight;
    document.getElementById('pd-sizes').style.animation = 'shakeSizes .4s ease';
    if (typeof toast === 'function') toast('Please select a size first.', 'error');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  const key  = `${currentProduct.id}-${selectedSize || 'OS'}`;
  const existing = cart.find(i => i.key === key);

  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      key,
      id:    currentProduct.id,
      name:  currentProduct.name,
      price: currentProduct.price,
      size:  selectedSize || 'One Size',
      qty,
    });
  }

  localStorage.setItem('sw_cart', JSON.stringify(cart));
  updateCartBadge();

  // Cart pulse
  const cw = document.querySelector('.cart-wrap');
  if (cw) { cw.classList.remove('added'); void cw.offsetWidth; cw.classList.add('added'); setTimeout(() => cw.classList.remove('added'), 500); }

  if (typeof toast === 'function') toast(`${currentProduct.name} (${selectedSize || 'One Size'}) × ${qty} added!`, 'success');
}

// Tab switching
function switchTab(id, btn) {
  document.querySelectorAll('.pd-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.pd-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id)?.classList.add('active');
}

// Wishlist
function pdToggleWish() {
  if (!currentProduct) return;
  const wished = toggleWishItem(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.type);
  const icon   = document.getElementById('pd-wish-icon');
  const txt    = document.getElementById('pd-wish-txt');
  const btn    = document.getElementById('pd-wish-btn');
  icon.className = wished ? 'fas fa-heart' : 'far fa-heart';
  txt.textContent = wished ? 'Saved to Wishlist' : 'Save to Wishlist';
  btn.classList.toggle('wished', wished);
  if (typeof toast === 'function') toast(wished ? 'Saved to wishlist ❤️' : 'Removed from wishlist', 'info');
}

function checkWishState(id) {
  const list = JSON.parse(localStorage.getItem('sw_wishlist') || '[]');
  const wished = list.some(i => i.id === id);
  const icon   = document.getElementById('pd-wish-icon');
  const txt    = document.getElementById('pd-wish-txt');
  const btn    = document.getElementById('pd-wish-btn');
  if (!icon) return;
  icon.className = wished ? 'fas fa-heart' : 'far fa-heart';
  txt.textContent = wished ? 'Saved to Wishlist' : 'Save to Wishlist';
  btn.classList.toggle('wished', wished);
}

// Related products
function renderRelated(p) {
  const grid = document.getElementById('pd-related');
  if (!grid || typeof products === 'undefined') return;

  // Same anime, different product; fallback to same type
  let related = products.filter(r => r.id !== p.id && r.anime === p.anime).slice(0, 4);
  if (related.length < 4) {
    const more = products.filter(r => r.id !== p.id && r.type === p.type && !related.find(x => x.id === r.id));
    related = [...related, ...more].slice(0, 4);
  }

  grid.innerHTML = related.map(r => renderProductCard(r)).join('');

  // Wishlist hearts on related
  grid.querySelectorAll('.prd-wish').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.closest('.prd-card')?.dataset.anime;
      const icon = btn.querySelector('i');
      const on = icon.classList.contains('fas');
      icon.className  = on ? 'far fa-heart' : 'fas fa-heart';
      icon.style.color = on ? '' : 'var(--red)';
    });
  });
}

// Share
function pdShare(platform) {
  const url   = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(currentProduct?.name || 'Check this out on Shonowear');
  if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
  } else if (platform === 'instagram') {
    window.open('https://www.instagram.com/kavin.j.s', '_blank');
  } else {
    navigator.clipboard?.writeText(window.location.href)
      .then(() => { if (typeof toast === 'function') toast('Link copied!', 'success'); });
  }
}

// Size guide modal
function openSizeGuide()  { document.getElementById('size-modal').classList.add('open'); }
function closeSizeGuide() { document.getElementById('size-modal').classList.remove('open'); }

/* ── Image zoom lightbox ─────────────────────────────── */
let _lbImages = [];
let _lbIdx    = 0;

function openLightbox(idx) {
  _lbIdx = idx;
  const lb = document.getElementById('img-lightbox');
  const el = document.getElementById('lb-img');
  if (!lb || !el || !_lbImages.length) return;
  el.style.backgroundImage = `url('${_lbImages[_lbIdx]}')`;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('img-lightbox')?.classList.remove('open');
  document.body.style.overflow = '';
}
function lbNav(dir) {
  _lbIdx = (_lbIdx + dir + _lbImages.length) % _lbImages.length;
  document.getElementById('lb-img').style.backgroundImage = `url('${_lbImages[_lbIdx]}')`;
}
document.addEventListener('keydown', e => {
  if (document.getElementById('img-lightbox')?.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  lbNav(-1);
    if (e.key === 'ArrowRight') lbNav(1);
  }
});


/* ── Complete the Look ─────────────────────────────────── */
function renderCompleteTheLook(p) {
  const grid = document.getElementById('ctl-grid');
  if (!grid || typeof products === 'undefined') return;

  // Same anime, different type; fill with same type if needed
  let pool = products.filter(r =>
    r.id !== p.id && r.anime === p.anime && r.type !== p.type
  ).slice(0, 4);
  if (pool.length < 4) {
    const extra = products.filter(r =>
      r.id !== p.id && r.type === p.type && !pool.find(x => x.id === r.id)
    );
    pool = [...pool, ...extra].slice(0, 4);
  }

  grid.innerHTML = pool.map(item => {
    const img = getProductImage(item);
    const safe = (item.name||'').replace(/'/g,"\\'");
    return `
      <div class="ctl-item" onclick="window.location='product.html?id=${item.id}'">
        <div class="ctl-item-img" style="background-image:url('${img}')"></div>
        <p class="ctl-item-name">${item.name}</p>
        <p class="ctl-item-price">₹${item.price.toLocaleString()}</p>
        <button class="ctl-add" onclick="event.stopPropagation();addToCart('${item.id}','${safe}',${item.price})">
          <i class="fas fa-shopping-bag"></i> Quick Add
        </button>
      </div>`;
  }).join('');
}
