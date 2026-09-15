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

  const modalOverlay = document.getElementById('modalOverlay');
  const productModal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');

  featuredGrid.addEventListener('click', handleProductCardClick);
  catalogGrid.addEventListener('click', handleProductCardClick);
  modalClose.addEventListener('click', closeProductModal);
  modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) closeProductModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !productModal.hidden) closeProductModal();
  });
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

/**
 * Manejo el click en una card de producto: abre el modal con su detalle
 */
function handleProductCardClick(event) {
  const trigger = event.target.closest('.product-card__trigger');
  if (!trigger) return;

  const productId = Number(trigger.dataset.productId);
  const product = allProducts.find(p => p.id === productId);
  if (!product) return;

  openProductModal(product);
}

/**
 * Abro el modal con el detalle del producto pasado
 */
function openProductModal(product) {
  const modalOverlay = document.getElementById('modalOverlay');
  const productModal = document.getElementById('productModal');
  const modalContent = document.getElementById('modalContent');

  modalContent.innerHTML = renderProductModalContent(product);

  modalOverlay.hidden = false;
  productModal.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('modalAddToCart').addEventListener('click', () => {
    
    closeProductModal();
  });
}

/**
 * Cierro el modal de detalle de producto.
 */
function closeProductModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const productModal = document.getElementById('productModal');

  modalOverlay.hidden = true;
  productModal.hidden = true;
  document.body.style.overflow = '';
}