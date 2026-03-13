// Cart page logic

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  const cartItems = document.getElementById('cart-items');
  const emptCart = document.getElementById('empty-cart');
  const cartSummary = document.getElementById('cart-summary');
  
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    emptCart.style.display = 'block';
    cartSummary.style.display = 'none';
    return;
  }
  
  emptCart.style.display = 'none';
  cartSummary.style.display = 'block';
  
  let total = 0;
  
  cart.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    total += itemTotal;
    
    cartItems.innerHTML += `
      <div class="ci">
        <div style="width:100px;height:100px;display:flex;align-items:center;justify-content:center;font-size:2.5rem;background:var(--bg2);">
          🎌
        </div>
        <div class="ci-info">
          <div class="ci-name">${item.name}</div>
          <div class="ci-price">₹${item.price.toLocaleString()}</div>
          <div class="qty-row">
            <button class="qb" onclick="changeQty(${idx}, -1)">-</button>
            <span class="qn">${item.qty}</span>
            <button class="qb" onclick="changeQty(${idx}, 1)">+</button>
            <button class="rm-btn" onclick="removeItem(${idx})">REMOVE</button>
          </div>
        </div>
        <div style="text-align:right;font-weight:700;">
          ₹${itemTotal.toLocaleString()}
        </div>
      </div>
    `;
  });
  
  document.getElementById('subtotal').textContent = '₹' + total.toLocaleString();
  document.getElementById('total').textContent = '₹' + total.toLocaleString();
}

function changeQty(idx, change) {
  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  if (cart[idx]) {
    cart[idx].qty += change;
    if (cart[idx].qty <= 0) {
      cart.splice(idx, 1);
    }
    localStorage.setItem('sw_cart', JSON.stringify(cart));
    loadCart();
    updateCartBadge();
  }
}

function removeItem(idx) {
  const cart = JSON.parse(localStorage.getItem('sw_cart') || '[]');
  cart.splice(idx, 1);
  localStorage.setItem('sw_cart', JSON.stringify(cart));
  loadCart();
  updateCartBadge();
  toast('Item removed', 'success');
}

function checkout() {
  const user = localStorage.getItem('sw_user');
  if (!user) {
    showPop('⚠️', 'Login Required', 'Please login to proceed with checkout');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
    return;
  }
  
  showPop('✅', 'Order Placed!', 'Thank you for your purchase! Your order has been confirmed.');
  setTimeout(() => {
    localStorage.setItem('sw_cart', '[]');
    closePop();
    loadCart();
    updateCartBadge();
  }, 2000);
}

// Load cart when page loads
document.addEventListener('DOMContentLoaded', loadCart);
