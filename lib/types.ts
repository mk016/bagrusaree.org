export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProductCategoryType = 'sarees' | 'suit-sets' | 'dress-material' | 'dupattas' | 'bedsheets' | 'bags' | 'men\'s-collection' | 'home' | 'uncategorized';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: ProductCategoryType;
  subcategory?: string;
  tags: string[];
  stock: number;
  sku?: string;
  featured: boolean;
  status: 'active' | 'draft' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories: Subcategory[];
  featured: boolean;
  order: number;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  categoryId: string;
  order: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customer?: Customer;
  items: OrderItem[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  userId: string;
  user: User;
  productId: string;
  product: Product;
  rating: number;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface CategoryProductGroup {
  category: Category;
  products: Product[];
}

export interface Analytics {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  conversionRate: number;
  avgOrderValue: number;
  topProducts: Product[];
  salesByCategory: { category: string; sales: number }[];
  recentOrders: Order[];
}

export interface RawProductData {
  name: string;
  handle: string;
  images: { src: string; image_id: number; position: number; product_id: number; variant_ids: number[]; created_at_site: string; updated_at_site: string; }[];
  vendor: string;
  options: { name: string; values: string[]; position: number; }[];
  variants: { sku: string; grams: number; price: number; title: string; option1: string | null; option2: string | null; option3: string | null; taxable: boolean; position: number; available: boolean; created_at: string; product_id: number; updated_at: string; variant_id: number; featured_image: string | null; created_at_site: string; updated_at_site: string; requires_shipping: boolean; }[];
  max_price: number;
  min_price: number;
  bestseller: boolean;
  instore_id: number;
  description: string;
  variants_count: number;
  created_at_site: string;
  updated_at_site: string;
  published_at_site: string;
  instore_product_type: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  active: boolean;
}

export interface ContentPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  lastUpdated: string;
}

export interface Customer {
  id: string;
  fullName?: string;
  displayName?: string;
  email?: string;
  isEmailVerified?: boolean;
  createdAt: string;
  isActive: boolean;
  defaultAddressID?: string;
  defaultAddress?: Address;
  addresses: Address[];
  paymentTransactions: PaymentTransaction[];
  orders: Order[];
}

// Payment Transaction model to record the users payment 
export interface PaymentTransaction {
  id: string;
  paymentId: string;
  customerId: string;
  amount: number;
  status: string;
  createdAt: string;
}