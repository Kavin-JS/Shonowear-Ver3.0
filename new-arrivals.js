// New Arrivals page logic

let newProducts = [];

function getNewProducts() {
  return products.filter(p => p.isNew === true).slice(0, 24);
}

function renderNewProducts() {
  const grid = document.getElementById('new-products-grid');
  const noRes = document.getElementById('no-res');
  
  if (!grid) return;
  
  newProducts = getNewProducts();
  
  grid.innerHTML = '';
  
  if (newProducts.length === 0) {
    grid.style.display = 'none';
    noRes.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  noRes.style.display = 'none';
  
  newProducts.forEach(product => {
    grid.innerHTML += renderProductCard(product);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  renderNewProducts();
});
