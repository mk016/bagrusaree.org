// Define API endpoints for data fetching
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  BANNERS: '/api/banners',
  ORDERS: '/api/orders',
  REVIEWS: '/api/reviews',
};

// Import the Category type
import { Category, Product } from './types';

// Empty arrays as placeholders - data should be fetched from API
export const CATEGORIES: Category[] = [];
export const MOCK_PRODUCTS: Product[] = [];

// Other constants that aren't data
export const IMAGE_PLACEHOLDER = 'https://placehold.co/400x400?text=Image+Not+Available';

// App configuration
export const APP_CONFIG = {
  name: 'BagruSarees',
  description: 'Authentic Indian Fashion',
  contactEmail: 'support@bagrusarees.org',
  contactPhone: '+91-76656 29448',
  socialLinks: {
    facebook: 'https://facebook.com/bagrusarees',
    instagram: 'https://instagram.com/bagrusarees',
    twitter: 'https://twitter.com/bagrusarees',
  },
};