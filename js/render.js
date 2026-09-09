/**
 * Creo el elemento DOM de una card de producto
 * @param {Object} product - Producto de la API
 * @returns {HTMLElement} Elemento article.product-card
 */
function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.dataset.productId = product.id;

  card.innerHTML = `
    <button class="product-card__trigger" data-product-id="${product.id}" aria-label="Ver detalle de ${product.title}">
      <div class="product-card__image-wrap">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </div>
      <h3 class="product-card__title">${product.title}</h3>
      <p class="product-card__price">$${product.price.toFixed(2)}</p>
    </button>
  `;

  return card;
}

/**
 * Renderizo una lista de productos dentro de un contenedor
 * @param {HTMLElement} container - Elemento donde se inyectan las cards
 * @param {Array} products - Lista de productos a renderizar
 */
function renderProductGrid(container, products) {
  container.innerHTML = '';

  if (!products || products.length === 0) {
    container.innerHTML = `<p class="empty-state">No se encontraron productos.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  products.forEach(product => {
    fragment.appendChild(createProductCard(product));
  });
  container.appendChild(fragment);
}

/**
 * Elijo N elementos aleatorios de un array, sin repetir para mostrar en la sección de destacados
 * @param {Array} array - Array origen
 * @param {number} count - Cantidad de elementos a elegir
 * @returns {Array} Subconjunto aleatorio
 */
function getRandomSubset(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
/**
 * Mapeo de categorías de la API (inglés) a su nombre en español para mostrar
 */
const CATEGORY_TRANSLATIONS = {
  'electronics': 'Electrónica',
  'jewelery': 'Joyería',
  "men's clothing": 'Hombres',
  "women's clothing": 'Mujeres'
};

/**
 * Traduce el nombre de una categoría de la API a español para mostrarlo
 * Si no hay traducción registrada, devuelve el original capitalizado
 * @param {string} category
 * @returns {string}
 */
function formatCategoryName(category) {
  if (CATEGORY_TRANSLATIONS[category]) {
    return CATEGORY_TRANSLATIONS[category];
  }
  return category
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Renderizo la lista de categorías en el nav, incluyendo "Todas"
 * @param {HTMLElement} container - <ul> donde se inyectan los <li><a>
 * @param {Array<string>} categories - Categorías desde la API
 * @param {string} activeCategory - Categoría actualmente activa ('all' por defecto)
 */
function renderCategoryNav(container, categories, activeCategory = 'all') {
  container.innerHTML = '';

  const allCategories = ['all', ...categories];

  allCategories.forEach(category => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#';
    link.dataset.category = category;
    link.textContent = category === 'all' ? 'Todas' : formatCategoryName(category);

    if (category === activeCategory) {
      link.classList.add('is-active');
    }

    li.appendChild(link);
    container.appendChild(li);
  });
}