import { Product, Order, ShippingMethod } from './types';
import { API_ENDPOINTS } from './constants';

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

export async function getProductById(id: string): Promise<Product | undefined> {
  const cacheKey = `product_${id}`;
  const cached = getCached<Product>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const product = await response.json();
    setCache(cacheKey, product);
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const cacheKey = `products_category_${category}`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?category=${category}&limit=20`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  const cacheKey = 'all_products';
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?limit=50`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
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

export const getCategories = async () => {
  const cacheKey = 'categories';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(API_ENDPOINTS.CATEGORIES);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories = await response.json();
    setCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
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