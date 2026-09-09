const API_BASE_URL = 'https://fakestoreapi.com';

/**
 
 * @returns {Promise<Array>} Lista de productos
 */
async function fetchAllProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`Error al obtener productos: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetchAllProducts:', error);
    return [];
  }
}

/**
 
 * @returns {Promise<Array<string>>} Lista de nombres de categorías
 */
async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetchCategories:', error);
    return [];
  }
}

/**
 
 * @param {string} category - Nombre de la categoría
 * @returns {Promise<Array>} Lista de productos de esa categoría
 */
async function fetchProductsByCategory(category) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Error al obtener productos de categoría: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('fetchProductsByCategory:', error);
    return [];
  }
}