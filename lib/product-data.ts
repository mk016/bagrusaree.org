import { Product, ProductCategoryType } from './types';
import { API_ENDPOINTS } from './constants';

// Get all products (alias for getAllProducts for backward compatibility)
export const getProducts = async (): Promise<Product[]> => {
  return getAllProducts();
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products: Product[] = await response.json();
    return products;
  } catch (e: any) {
    console.error("Error fetching products:", e);
    return [];
  }
};

// Get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?category=${category}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products: Product[] = await response.json();
    return products;
  } catch (e: any) {
    console.error(`Error fetching products for category ${category}:`, e);
    return [];
  }
};

// Get featured products
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?featured=true`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products: Product[] = await response.json();
    return products;
  } catch (e: any) {
    console.error("Error fetching featured products:", e);
    return [];
  }
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product: Product = await response.json();
    return product;
  } catch (e: any) {
    console.error(`Error fetching product with ID ${id}:`, e);
    return null;
  }
};

// Add new product
export const addProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newProduct: Product = await response.json();
    console.log('Product added successfully:', newProduct);
    return newProduct;
  } catch (e: any) {
    console.error('Error adding product:', e);
    throw e;
  }
};

// Update existing product
export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    if (!product.id) {
      throw new Error('Product ID is required for updating.');
    }
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedProduct: Product = await response.json();
    console.log('Product updated successfully:', updatedProduct);
    return updatedProduct;
  } catch (e: any) {
    console.error('Error updating product:', e);
    throw e;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    console.log('Product deleted successfully');
  } catch (e: any) {
    console.error('Error deleting product:', e);
    throw e;
  }
}; 