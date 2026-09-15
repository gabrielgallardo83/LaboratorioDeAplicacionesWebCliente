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

/**
 * Genero el HTML interno del modal de detalle de producto
 * @param {Object} product
 * @returns {string} HTML del contenido del modal
 */
function renderProductModalContent(product) {
  return `
    <div class="modal__header">
      <h2 id="modalTitle" class="modal__title">${product.title}</h2>
      <p class="modal__price">$${product.price.toFixed(2)}</p>
    </div>
    <div class="modal__image-wrap">
      <img src="${product.image}" alt="${product.title}">
    </div>
    <p class="modal__description">${product.description}</p>
    <button class="btn btn--solid modal__add-btn" id="modalAddToCart" data-product-id="${product.id}">
      Agregar al carrito
    </button>
  `;
}

/**
 * Actualiza el badge del carrito en el navbar con la cantidad total.
 * @param {number} totalItems
 */
function renderCartBadge(totalItems) {
  const badge = document.getElementById('cartBadge');
  badge.textContent = totalItems;
  badge.hidden = totalItems === 0;
}

/**
 * Muestro un mensaje temporal (toast) al usuario
 * @param {string} message
 */
function showToast(message) {
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('toast--visible'));

  setTimeout(() => {
    toast.classList.remove('toast--visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}