let allProducts = [];
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  const featuredGrid = document.getElementById('featuredGrid');
  const catalogGrid = document.getElementById('catalogGrid');
  const categoryNav = document.getElementById('categoryNav');

  // Carga inicial: productos y categorías en paralelo
  const [products, categories] = await Promise.all([
    fetchAllProducts(),
    fetchCategories()
  ]);

  allProducts = products;

  renderProductGrid(featuredGrid, getRandomSubset(allProducts, 4));
  renderProductGrid(catalogGrid, allProducts);
  renderCategoryNav(categoryNav, categories, currentCategory);

  categoryNav.addEventListener('click', handleCategoryClick);
});

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

  // Destacados solo se muestra en "Todas" (home)
  featuredSection.hidden = category !== 'all';

  // Estado de carga simple mientras filtra
  catalogGrid.innerHTML = `<p class="empty-state">Cargando…</p>`;

  let productsToShow;
  if (category === 'all') {
    productsToShow = allProducts;
    catalogTitle.textContent = 'Catálogo';
  } else {
    productsToShow = await fetchProductsByCategory(category);
    catalogTitle.textContent = formatCategoryName(category);
  }

  renderProductGrid(catalogGrid, productsToShow);
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