let allProducts = [];
let currentCategory = 'all';
let currentCatalogProducts = []; // Productos del catálogo antes de aplicar búsqueda
let searchDebounceTimer = null;
let lastFocusedElement = null;


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

  renderCartBadge(getCartTotalItems(getCart()));

  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartFooter = document.getElementById('cartFooter');

  cartToggle.addEventListener('click', openCartSidebar);
  cartClose.addEventListener('click', closeCartSidebar);
  cartOverlay.addEventListener('click', (event) => {
    if (event.target === cartOverlay) closeCartSidebar();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !cartSidebar.hidden) closeCartSidebar();
  });

  cartItemsList.addEventListener('click', handleCartItemAction);
  cartFooter.addEventListener('click', handleCartFooterAction);
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

  lastFocusedElement = document.activeElement;
  modalContent.innerHTML = renderProductModalContent(product);

  modalOverlay.hidden = false;
  productModal.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('modalClose').focus();

  document.getElementById('modalAddToCart').addEventListener('click', () => {
    const updatedCart = addToCart(product);
    renderCartBadge(getCartTotalItems(updatedCart));
    showToast(`"${product.title}" se agregó al carrito`);
    closeProductModal();
  });
}

/**
 * Cierro el modal de detalle de producto
 */
function closeProductModal() {
  const modalOverlay = document.getElementById('modalOverlay');
  const productModal = document.getElementById('productModal');

  modalOverlay.hidden = true;
  productModal.hidden = true;
  document.body.style.overflow = '';

  if (lastFocusedElement) lastFocusedElement.focus();
}


/**
 * Abro el sidebar del carrito y renderiza su contenido actual
 */
function openCartSidebar() {
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');

  lastFocusedElement = document.activeElement;
  renderCartSidebar(getCart());

  cartOverlay.hidden = false;
  cartSidebar.hidden = false;
  document.body.style.overflow = 'hidden';

  document.getElementById('cartClose').focus();
}


/**
 * Cierro el sidebar del carrito
 */
function closeCartSidebar() {
  const cartOverlay = document.getElementById('cartOverlay');
  const cartSidebar = document.getElementById('cartSidebar');

  cartOverlay.hidden = true;
  cartSidebar.hidden = true;
  document.body.style.overflow = '';

  if (lastFocusedElement) lastFocusedElement.focus();
}

/**
 * Manejo clicks dentro de la lista de items: aumentar, disminuir, eliminar
 */
function handleCartItemAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const productId = Number(button.dataset.productId);
  const action = button.dataset.action;
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  let updatedCart;

  if (action === 'increase') {
    updatedCart = updateCartItemQuantity(productId, item.quantity + 1);
  } else if (action === 'decrease') {
    if (item.quantity <= 1) return;
    updatedCart = updateCartItemQuantity(productId, item.quantity - 1);
  } else if (action === 'remove') {
    updatedCart = removeFromCart(productId);
  }

  renderCartSidebar(updatedCart);
  renderCartBadge(getCartTotalItems(updatedCart));
}

/**
 * Manejo clicks en el footer del sidebar: finalizar compra o vaciar carrito
 */
function handleCartFooterAction(event) {
  if (event.target.id === 'checkoutBtn') {
    const updatedCart = clearCart();
    renderCartSidebar(updatedCart);
    renderCartBadge(getCartTotalItems(updatedCart));
    showToast('¡Compra finalizada con éxito!');
  }

  if (event.target.id === 'clearCartBtn') {
    const updatedCart = clearCart();
    renderCartSidebar(updatedCart);
    renderCartBadge(getCartTotalItems(updatedCart));
    showToast('Carrito vaciado');
  }
}