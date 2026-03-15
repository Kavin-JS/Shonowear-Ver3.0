// new-arrivals.js

document.addEventListener('DOMContentLoaded', () => {
  renderNewProducts();

  // navbar scroll state
  const nb = document.getElementById('navbar');
  const pr = document.getElementById('nav-progress');
  window.addEventListener('scroll', () => {
    nb?.classList.toggle('scrolled', window.scrollY > 60);
    if (pr) pr.style.width = Math.min((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100) + '%';
  }, { passive: true });
});

function renderNewProducts() {
  const grid  = document.getElementById('new-products-grid');
  const noRes = document.getElementById('no-res');
  if (!grid) return;

  const newItems = products.filter(p => p.isNew === true);

  if (newItems.length === 0) {
    grid.style.display = 'none';
    if (noRes) noRes.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  if (noRes) noRes.style.display = 'none';

  // render all at once
  grid.innerHTML = newItems.map(p => renderProductCard(p)).join('');

  // stagger cards in
  grid.querySelectorAll('.prd-card').forEach((c, i) => {
    c.style.cssText = `opacity:0;transform:translateY(16px);transition:opacity .35s ease ${i * .05}s,transform .35s ease ${i * .05}s`;
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
