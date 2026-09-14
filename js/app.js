let allProducts = [];
let currentCategory = 'all';
let currentCatalogProducts = []; // Productos del catálogo antes de aplicar búsqueda
let searchDebounceTimer = null;

document.addEventListener('DOMContentLoaded', async () => {
  const featuredGrid = document.getElementById('featuredGrid');
  const catalogGrid = document.getElementById('catalogGrid');
  const categoryNav = document.getElementById('categoryNav');
  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');

  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories()
  ]);

  allProducts = products;
  currentCatalogProducts = allProducts;

  renderProductGrid(featuredGrid, getRandomSubset(allProducts, 4));
  renderProductGrid(catalogGrid, currentCatalogProducts);
  renderCategoryNav(categoryNav, categories, currentCategory);

  categoryNav.addEventListener('click', handleCategoryClick);
  searchToggle.addEventListener('click', () => toggleSearchBar(searchBar, searchInput));
  searchInput.addEventListener('input', handleSearchInput);
});

/**
 * Muestro u oculto la barra de búsqueda y maneja el foco/aria-expanded
 */
function toggleSearchBar(searchBar, searchInput) {
  const searchToggle = document.getElementById('searchToggle');
  const isHidden = searchBar.hidden;

  searchBar.hidden = !isHidden;
  searchToggle.setAttribute('aria-expanded', String(isHidden));

  if (isHidden) {
    searchInput.focus();
  } else {
    searchInput.value = '';
    applySearchFilter('');
  }
}

/**
 * Manejo el input del buscador con un pequeño debounce
 */
function handleSearchInput(event) {
  const term = event.target.value;

  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    applySearchFilter(term);
  }, 250);
}

/**
 * Filtro currentCatalogProducts por título según el término de búsqueda
 * y renderiza el resultado en el catálogo
 */
function applySearchFilter(term) {
  const catalogGrid = document.getElementById('catalogGrid');
  const normalizedTerm = term.trim().toLowerCase();

  if (!normalizedTerm) {
    renderProductGrid(catalogGrid, currentCatalogProducts);
    return;
  }

  const filtered = currentCatalogProducts.filter(product =>
    product.title.toLowerCase().includes(normalizedTerm)
  );

  renderProductGrid(catalogGrid, filtered);
}

/**
 * Manejo el click en una categoría del nav: filtra el catálogo
 */
async function handleCategoryClick(event) {
  const link = event.target.closest('a[data-category]');
  if (!link) return;

  event.preventDefault();

  const category = link.dataset.category;
  if (category === currentCategory) return;

  currentCategory = category;

  const catalogGrid = document.getElementById('catalogGrid');
  const categoryNav = document.getElementById('categoryNav');
  const catalogTitle = document.getElementById('catalogTitle');
  const featuredSection = document.getElementById('featuredSection');
  const searchInput = document.getElementById('searchInput');

  featuredSection.hidden = category !== 'all';

  // Al cambiar de categoría se limpia cualquier búsqueda activa
  searchInput.value = '';

  catalogGrid.innerHTML = `<p class="empty-state">Cargando…</p>`;

  let productsToShow;
  if (category === 'all') {
    productsToShow = allProducts;
    catalogTitle.textContent = 'Catálogo';
  } else {
    productsToShow = await fetchProductsByCategory(category);
    catalogTitle.textContent = formatCategoryName(category);
  }

  currentCatalogProducts = productsToShow;
  renderProductGrid(catalogGrid, currentCatalogProducts);
  updateActiveCategoryLink(categoryNav, category);
}

/**
 * Actualizo la clase 'is-active' en el link de categoría correspondiente
 */
function updateActiveCategoryLink(container, category) {
  container.querySelectorAll('a[data-category]').forEach(link => {
    link.classList.toggle('is-active', link.dataset.category === category);
  });
}