// Collection page logic with filters and sorting

let filteredProducts = [...products];

function filterProducts() {
  const categoryFilter = document.getElementById('category-filter').value;
  const typeFilter = document.getElementById('type-filter').value;
  const sortFilter = document.getElementById('sort-filter').value;
  const priceFilter = parseInt(document.getElementById('price-filter').value);
  
  // Apply filters
  filteredProducts = products.filter(p => {
    const catMatch = !categoryFilter || p.category === categoryFilter;
    const typeMatch = !typeFilter || p.type.toLowerCase().includes(typeFilter.toLowerCase());
    const priceMatch = p.price <= priceFilter;
    return catMatch && typeMatch && priceMatch;
  });
  
  // Apply sorting
  switch(sortFilter) {
    case 'price-low':
      filteredProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filteredProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name-a':
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-z':
      filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'newest':
    default:
      filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }
  
  renderProducts();
  updatePriceDisplay();
}

function updatePriceDisplay() {
  const priceValue = document.getElementById('price-filter').value;
  document.getElementById('price-value').textContent = '₹' + parseInt(priceValue).toLocaleString();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  const noRes = document.getElementById('no-res');
  
  if (!grid) return;
  
  grid.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    grid.style.display = 'none';
    noRes.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  noRes.style.display = 'none';
  
  filteredProducts.forEach(product => {
    grid.innerHTML += renderProductCard(product);
  });
}

function searchProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  
  filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm) ||
    p.anime.toLowerCase().includes(searchTerm) ||
    p.type.toLowerCase().includes(searchTerm)
  );
  
  renderProducts();
}

function resetFilters() {
  document.getElementById('category-filter').value = '';
  document.getElementById('type-filter').value = '';
  document.getElementById('sort-filter').value = 'newest';
  document.getElementById('price-filter').value = '10000';
  document.getElementById('search-input').value = '';
  
  filterProducts();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  filterProducts();
  
  // Add search on input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') searchProducts();
    });
  }
});
