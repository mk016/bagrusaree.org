import { Product, Order, ShippingMethod } from './types';
import { API_ENDPOINTS } from './constants';
import localData from '../data/data.json';

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

// Convert local data to Product format
function convertLocalDataToProduct(item: any): Product {
  return {
    id: item.handle,
    name: item.name,
    description: item.description,
    price: item.price,
    comparePrice: item.comparePrice,
    images: item.images,
    category: item.category as any,
    subcategory: item.subcategory,
    tags: item.tags,
    stock: 10,
    sku: item.handle,
    featured: false,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Load all products from local data
export async function getAllProducts(): Promise<Product[]> {
  const cacheKey = 'all_products_local';
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    // Convert local data to Product format
    const products = localData.map(convertLocalDataToProduct);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading local products:", error);
    return [];
  }
}

// Load products by category from local data
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const cacheKey = `products_category_${category}_local`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const filteredData = localData.filter(item => item.category === category);
    const products = filteredData.map(convertLocalDataToProduct);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading products by category:", error);
    return [];
  }
}

// Load products by subcategory from local data
export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  const cacheKey = `products_subcategory_${category}_${subcategory}_local`;
  const cached = getCached<Product[]>(cacheKey);
  if (cached) return cached;

  try {
    const filteredData = localData.filter(item => 
      item.category === category && item.subcategory === subcategory
    );
    const products = filteredData.map(convertLocalDataToProduct);
    setCache(cacheKey, products);
    return products;
  } catch (error) {
    console.error("Error loading products by subcategory:", error);
    return [];
  }
}

// Get categories from local data
export const getCategories = async (): Promise<Category[]> => {
  const cacheKey = 'categories_local';
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const categories = [
      {
        id: 'sarees',
        name: 'Sarees',
        slug: 'sarees',
        description: 'Traditional Indian sarees collection',
        image: '/assets/sarees/saree1.jpeg',
        featured: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategories: [
          { id: 'cotton', name: 'Cotton Sarees', slug: 'cotton' },
          { id: 'silk', name: 'Silk Sarees', slug: 'silk' },
          { id: 'chiffon', name: 'Chiffon Sarees', slug: 'chiffon' }
        ],
      },
      {
        id: 'suit',
        name: 'Suit Sets',
        slug: 'suit',
        description: 'Complete suit sets for every occasion',
        image: '/assets/suit/suit2.webp',
        featured: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategories: [
          { id: 'cotton', name: 'Cotton Suits', slug: 'cotton' },
          { id: 'silk', name: 'Silk Suits', slug: 'silk' },
          { id: 'chiffon', name: 'Chiffon Suits', slug: 'chiffon' }
        ],
      },
      {
        id: 'dupattas',
        name: 'Dupattas',
        slug: 'dupattas',
        description: 'Beautiful dupattas and scarves',
        image: '/assets/chiffon_dupatta/dupatta1.webp',
        featured: false,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        subcategories: [
          { id: 'cotton', name: 'Cotton Dupattas', slug: 'cotton' },
          { id: 'silk', name: 'Silk Dupattas', slug: 'silk' },
          { id: 'chiffon', name: 'Chiffon Dupattas', slug: 'chiffon' }
        ],
      }
    ];
    setCache(cacheKey, categories);
    return categories;
  } catch (error) {
    console.error("Error loading categories:", error);
    return [];
  }
};

export async function getProductById(id: string): Promise<Product | undefined> {
  const cacheKey = `product_${id}_local`;
  const cached = getCached<Product>(cacheKey);
  if (cached) return cached;

  try {
    const product = localData.find(item => item.handle === id);
    if (product) {
      const convertedProduct = convertLocalDataToProduct(product);
      setCache(cacheKey, convertedProduct);
      return convertedProduct;
    }
    return undefined;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined;
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