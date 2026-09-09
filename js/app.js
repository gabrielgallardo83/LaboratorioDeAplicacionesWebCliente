document.addEventListener('DOMContentLoaded', async () => {
  const featuredGrid = document.getElementById('featuredGrid');
  const catalogGrid = document.getElementById('catalogGrid');

  const allProducts = await fetchAllProducts();

  // Destacados: selección aleatoria reducida
  const featuredProducts = getRandomSubset(allProducts, 4);
  renderProductGrid(featuredGrid, featuredProducts);

  // Catálogo: todos los productos
  renderProductGrid(catalogGrid, allProducts);
});