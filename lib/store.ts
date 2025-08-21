import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, User, WishlistItem } from './types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: { productId: string; name: string; price: number; image: string; quantity: number; sku?: string; size?: string; color?: string; }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: { productId: string; name: string; price: number; image: string; sku?: string; }) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

// Custom date reviver function to convert ISO date strings back to Date objects
const dateReviver = (key: string, value: any) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return new Date(value);
  }
  return value;
};

// Custom storage object that handles Date serialization/deserialization
const createCustomStorage = () => {
  if (typeof window === 'undefined') {
    // Return a no-op storage for SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str, dateReviver);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: any) => {
      localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      localStorage.removeItem(name);
    },
  };
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (email, password, name) => {
        // Demo credentials
        if (email === 'demo@example.com' && password === 'demo123') {
          const user: User = {
            id: 'demo-user-1',
            email: email,
            name: name || 'Demo User',
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        
        // Allow any email/password for demo purposes
        if (email && password && password.length >= 6) {
          const user: User = {
            id: `user-${Date.now()}`,
            email: email,
            name: name || email.split('@')[0],
            role: 'user',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...userData } });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createCustomStorage(),
    }
  )
);

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => 
            item.productId === newItem.productId && 
            item.size === newItem.size && 
            item.color === newItem.color
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + newItem.quantity }
                : item
            ),
          });
        } else {
          set({
            items: [...items, { ...newItem, id: Math.random().toString(36) }],
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'cart-storage',
      storage: createCustomStorage(),
    }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        const items = get().items;
        if (!items.find((item) => item.productId === newItem.productId)) {
          set({
            items: [...items, { 
              ...newItem, 
              id: Math.random().toString(36),
              createdAt: new Date().toISOString()
            }],
          });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.productId === productId);
      },
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
      storage: createCustomStorage(),
    }
  )
);