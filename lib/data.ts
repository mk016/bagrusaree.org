import { getProducts } from './product-data';
import { Product, Order, User, Category, Review, ShippingMethod, ContentPage, Analytics } from './types';

export async function getProductById(id: string): Promise<Product | undefined> {
  const allProducts = await getProducts();
  return allProducts.find(product => product.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts.filter(product => product.category === category);
}

export async function getAllProducts(): Promise<Product[]> {
  const allProducts = await getProducts();
  return allProducts;
}

// Mock Data Generation Functions

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

export function generateMockUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: generateRandomId(),
      email: `user${i + 1}@example.com`,
      name: `User Name ${i + 1}`,
      role: i === 0 ? 'admin' : 'user', // First user is admin
      avatar: `https://i.pravatar.cc/150?img=${i + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return users;
}

export function generateMockOrders(count: number, users: User[], products: Product[]): Order[] {
  const orders: Order[] = [];
  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProducts = products.slice(0, Math.floor(Math.random() * 3) + 1);
    const total = randomProducts.reduce((sum, p) => sum + p.price, 0);

    orders.push({
      id: generateRandomId(),
      userId: randomUser.id,
      user: randomUser,
      items: randomProducts.map(p => ({
        id: generateRandomId(),
        productId: p.id,
        product: p,
        quantity: 1,
        price: p.price,
      })),
      total: total * 1.1, // Adding some tax/shipping
      subtotal: total,
      tax: total * 0.05,
      shipping: total * 0.05,
      status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)] as any,
      shippingAddress: {
        id: generateRandomId(),
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      billingAddress: {
        id: generateRandomId(),
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zipCode: '90210',
        country: 'USA',
      },
      paymentMethod: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
      paymentStatus: ['pending', 'paid', 'failed', 'refunded'][Math.floor(Math.random() * 4)] as any,
      trackingNumber: `TRK${generateRandomId().toUpperCase()}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return orders;
}

export function generateMockCategories(count: number): Category[] {
  const categories: Category[] = [];
  const names = ['Sarees', 'Suit Sets', 'Dress Material', 'Dupattas', 'Bedsheets', 'Bags', 'Men\'s Collection', 'Home'];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    categories.push({
      id: generateRandomId(),
      name: name,
      slug: name.toLowerCase().replace(/\s/g, '-') + (i > names.length -1 ? `-${i}` : ''),
      description: `Description for ${name}`,
      image: `https://picsum.photos/seed/${name}/400/300`,
      subcategories: [],
      featured: Math.random() > 0.5,
      order: i,
    });
  }
  return categories;
}

export function generateMockReviews(count: number, users: User[], products: Product[]): Review[] {
  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    reviews.push({
      id: generateRandomId(),
      userId: randomUser.id,
      user: randomUser,
      productId: randomProduct.id,
      product: randomProduct,
      rating: Math.floor(Math.random() * 5) + 1,
      title: `Review Title ${i + 1}`,
      comment: `This is a sample review comment for ${randomProduct.name}.`,
      verified: Math.random() > 0.5,
      helpful: Math.floor(Math.random() * 100),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return reviews;
}

export function generateMockShippingMethods(count: number): ShippingMethod[] {
  const methods: ShippingMethod[] = [];
  for (let i = 0; i < count; i++) {
    methods.push({
      id: generateRandomId(),
      name: `Shipping Method ${i + 1}`,
      cost: parseFloat((Math.random() * 20 + 5).toFixed(2)),
      estimatedDelivery: `3-${7 + i} business days`,
      active: Math.random() > 0.3,
    });
  }
  return methods;
}

export function generateMockContentPages(count: number): ContentPage[] {
  const pages: ContentPage[] = [];
  const pageTitles = ['About Us', 'Privacy Policy', 'Terms of Service', 'FAQ', 'Contact Us'];
  for (let i = 0; i < count; i++) {
    const title = pageTitles[i % pageTitles.length] + (i >= pageTitles.length ? ` ${i + 1}` : '');
    pages.push({
      id: generateRandomId(),
      title: title,
      slug: title.toLowerCase().replace(/\s/g, '-') + (i >= pageTitles.length ? `-${i + 1}` : ''),
      content: `<p>This is the content for the ${title} page. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>`,
      lastUpdated: new Date().toISOString(),
    });
  }
  return pages;
}

export function generateMockAnalytics(): Analytics {
  return {
    totalSales: parseFloat((Math.random() * 100000 + 50000).toFixed(2)),
    totalOrders: Math.floor(Math.random() * 5000 + 1000),
    totalCustomers: Math.floor(Math.random() * 2000 + 500),
    conversionRate: parseFloat((Math.random() * 0.05 + 0.01).toFixed(4)),
    avgOrderValue: parseFloat((Math.random() * 100 + 50).toFixed(2)),
    topProducts: [],
    salesByCategory: [
      { category: 'Sarees', sales: parseFloat((Math.random() * 20000).toFixed(2)) },
      { category: 'Suit Sets', sales: parseFloat((Math.random() * 15000).toFixed(2)) },
      { category: 'Dupattas', sales: parseFloat((Math.random() * 8000).toFixed(2)) },
      { category: 'Bedsheets', sales: parseFloat((Math.random() * 5000).toFixed(2)) },
    ],
    recentOrders: generateMockOrders(5, generateMockUsers(5), []),
  };
}

export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch('/api/orders');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const orders: Order[] = await response.json();
    return orders;
  } catch (e: any) {
    console.error("Error fetching orders:", e);
    throw e;
  }
};