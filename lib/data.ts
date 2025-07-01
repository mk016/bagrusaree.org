import { Product, Order, ShippingMethod } from './types';
import { API_ENDPOINTS } from './constants';

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return undefined;
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_ENDPOINTS.PRODUCTS}?category=${category}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch(API_ENDPOINTS.PRODUCTS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch(API_ENDPOINTS.ORDERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders: Order[] = await response.json();
    return orders;
  } catch (e: any) {
    console.error("Error fetching orders:", e);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.CATEGORIES);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getBanners = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.BANNERS);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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