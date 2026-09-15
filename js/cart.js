const CART_STORAGE_KEY = 'ecommerce_cart';

/**
 * Obtengo el carrito actual desde localStorage
 * @returns {Array} Lista de items del carrito: { id, title, price, image, quantity }
 */
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('getCart: error al leer localStorage', error);
    return [];
  }
}

/**
 * Guardo el carrito completo en localStorage
 * @param {Array} cart
 */
function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('saveCart: error al escribir localStorage', error);
  }
}

/**
 * Agrego un producto al carrito. Si ya existe, incrementa su cantidad
 * @param {Object} product - Producto completo de la API
 * @returns {Array} Carrito actualizado
 */
function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Actualizo la cantidad de un item del carrito. Mínimo 1
 * @param {number} productId
 * @param {number} newQuantity
 * @returns {Array} Carrito actualizado
 */
function updateCartItemQuantity(productId, newQuantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);

  if (item && newQuantity >= 1) {
    item.quantity = newQuantity;
    saveCart(cart);
  }

  return cart;
}

/**
 * Elimino un producto del carrito
 * @param {number} productId
 * @returns {Array} Carrito actualizado
 */
function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

/**
 * Vacío el carrito por completo y borra el localStorage
 * @returns {Array} Carrito vacío.
 */
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
}

/**
 * Calculo la cantidad total de productos en el carrito (sumando quantities)
 * @param {Array} cart
 * @returns {number}
 */
function getCartTotalItems(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Calculo el precio total del carrito
 * @param {Array} cart
 * @returns {number}
 */
function getCartTotalPrice(cart) {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}