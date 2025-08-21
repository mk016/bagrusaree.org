import { Product, Order, ShippingMethod, Category } from './types';
import { API_ENDPOINTS } from './constants';
import { 
  getAllProducts as getAllProductsFromDb,
  getProductById as getProductByIdFromDb,
  getProductsByCategory as getProductsByCategoryFromDb,
  getProductsBySubcategory as getProductsBySubcategoryFromDb,
  getCategories as getCategoriesFromDb,
  searchProducts as searchProductsFromDb,
  getFeaturedProducts as getFeaturedProductsFromDb,
  getLowStockProducts as getLowStockProductsFromDb,
} from './database';

// Simple client-side cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds cache for client-side

function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }
  return null;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Load all products from database
export async function getAllProducts(): Promise<Product[]> {
  const cacheKey = 'all_products_db';
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await getAllProductsFromDb();
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading products from database:", error);
    return [];
  }
}

// Load products by category from database
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const cacheKey = `products_category_${category}_db`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await getProductsByCategoryFromDb(category);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading products by category from database:", error);
    return [];
  }
}

// Load products by subcategory from database
export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  const cacheKey = `products_subcategory_${category}_${subcategory}_db`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await getProductsBySubcategoryFromDb(category, subcategory);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading products by subcategory from database:", error);
    return [];
  }
}

// Get categories from database
export const getCategories = async (): Promise<Category[]> => {
  const cacheKey = 'categories_db';
  const cached = getCached<Category[]>(cacheKey);
  if (cached) return cached;

  try {
    const categories = await getCategoriesFromDb();
    setCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error("Error loading categories from database:", error);
    return [];
  }
};

export async function getProductById(id: string): Promise<Product | undefined> {
  const cacheKey = `product_${id}_db`;
  const cached = getCached<Product>(cacheKey);
  if (cached) return cached;

  try {
    const product = await getProductByIdFromDb(id);
    if (product) {
      setCache(cacheKey, product);
      return product;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching product by ID from database:", error);
    return undefined;
  }
}

// Search products from database
export async function searchProducts(query: string): Promise<Product[]> {
  const cacheKey = `search_${query}_db`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await searchProductsFromDb(query);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error searching products from database:", error);
    return [];
  }
}

// Get featured products from database
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  const cacheKey = `featured_products_${limit}_db`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await getFeaturedProductsFromDb(limit);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error fetching featured products from database:", error);
    return [];
  }
}

// Get low stock products from database
export async function getLowStockProducts(threshold: number = 10): Promise<Product[]> {
  const cacheKey = `low_stock_products_${threshold}_db`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const products = await getLowStockProductsFromDb(threshold);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error fetching low stock products from database:", error);
    return [];
  }
}

export const getOrders = async (): Promise<Order[]> => {
  const cacheKey = 'orders';
  const cached = getCached<Order[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(API_ENDPOINTS.ORDERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders: Order[] = await response.json();
    setCache(cacheKey, orders);
    return orders;
  } catch (e: any) {
    console.error("Error fetching orders:", e);
    return [];
  }
};

export const getBanners = async () => {
  const cacheKey = 'banners';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(API_ENDPOINTS.BANNERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const banners = await response.json();
    setCache(cacheKey, banners);
    return banners;
  } catch (error) {
    console.error("Error fetching banners:", error);
    return [];
  }
};

export function generateMockShippingMethods(count: number): ShippingMethod[] {
  const shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      cost: 5.99,
      estimatedDelivery: '5-7 business days',
      active: true,
    },
    {
      id: 'express',
      name: 'Express Shipping',
      cost: 12.99,
      estimatedDelivery: '2-3 business days',
      active: true,
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      cost: 24.99,
      estimatedDelivery: '1 business day',
      active: true,
    },
    {
      id: 'free',
      name: 'Free Shipping',
      cost: 0,
      estimatedDelivery: '7-10 business days',
      active: true,
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      cost: 19.99,
      estimatedDelivery: 'Same day',
      active: false,
    },
  ];

  return shippingMethods.slice(0, count);
}