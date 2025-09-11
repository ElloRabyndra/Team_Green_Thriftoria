// Function untuk mengambil semua produk
export const getProducts = async () => {
  const response = await fetch(`https://dummyjson.com/products?limit=0`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}

// Function untuk mencari produk
export const getSearchProducts = async (query) => {
  const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
  if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
}