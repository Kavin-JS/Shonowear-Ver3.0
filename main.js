// Shared functions for all pages

function updateNav() {
  const user = localStorage.getItem('sw_user');
  const username = localStorage.getItem('sw_username');
  const navLogin = document.getElementById('nav-login');
  const navUser = document.getElementById('nav-user');
  const navUname = document.getElementById('nav-uname');
  const mobLogin = document.getElementById('mob-login');
  const mobLogout = document.getElementById('mob-logout');
  
  if (user) {
    if (navLogin) navLogin.style.display = 'none';
    if (navUser) navUser.style.display = 'flex';
    if (navUname) navUname.textContent = username || 'User';
    if (mobLogin) mobLogin.style.display = 'none';
    if (mobLogout) mobLogout.style.display = 'flex';
  } else {
    if (navLogin) navLogin.style.display = 'block';
    if (navUser) navUser.style.display = 'none';
    if (mobLogin) mobLogin.style.display = 'flex';
    if (mobLogout) mobLogout.style.display = 'none';
  }
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = cart.length;
    if (cart.length > 0) {
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function logout() {
  localStorage.removeItem('sw_user');
  localStorage.removeItem('sw_username');
  updateNav();
  toast('Logged out successfully', 'success');
  setTimeout(() => window.location.href = 'index.html', 1000);
}

function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.style.background = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#e8153a';
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

function showPop(ico, title, msg) {
  document.getElementById('pop-ico').textContent = ico;
  document.getElementById('pop-title').textContent = title;
  document.getElementById('pop-msg').textContent = msg;
  document.getElementById('popup').classList.add('show');
}

function closePop() {
  document.getElementById('popup').classList.remove('show');
}

function openMob() {
  document.getElementById('mob-ov').classList.add('on');
  document.getElementById('mob-menu').classList.add('on');
}

function closeMob() {
  document.getElementById('mob-ov').classList.remove('on');
  document.getElementById('mob-menu').classList.remove('on');
}

document.getElementById('nav-toggle')?.addEventListener('click', openMob);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  updateNav();
});

function renderProductCard(product) {
  return `
    <div class="prd-card">
      <div class="prd-img">
        <div>${product.img}</div>
      </div>
      <div class="prd-ov">
        <button class="prd-ov-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">ADD TO CART</button>
      </div>
      ${product.isNew ? '<span class="prd-badge">NEW</span>' : ''}
      <div class="prd-info">
        <div class="prd-name">${product.name}</div>
        <div class="prd-price">₹${product.price.toLocaleString()}</div>
      </div>
    </div>
  `;
}

function addToCart(id, name, price) {
  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  
  localStorage.setItem('sw_cart', JSON.stringify(cart));
  updateCartBadge();
  toast(`${name} added to cart!`, 'success');
}
