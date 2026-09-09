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