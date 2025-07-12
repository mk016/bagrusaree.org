'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from '@/components/products/product-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Sparkles } from 'lucide-react';

interface TrendingProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: string;
    subcategory?: string;
    tags: string[];
    stock: number;
    sku: string;
    featured: boolean;
    status: string;
  };
  trending: boolean;
  order: number;
  createdAt: string;
}

export default function TrendingPage() {
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await fetch('/api/trending');
        if (!response.ok) {
          throw new Error('Failed to fetch trending products');
        }
        const data = await response.json();
        setTrendingProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Unable to load trending products
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-pink-500" />
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Trending Now</h1>
          <p className="text-gray-600 mt-2">Discover what's popular this season</p>
        </div>
      </div>

      {/* Featured Badge */}
      <div className="mb-6">
        <Badge variant="secondary" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
          🔥 {trendingProducts.length} Hot Items
        </Badge>
      </div>

      {/* Products Grid */}
      {trendingProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingProducts.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard 
                product={{
                  id: item.product.id,
                  name: item.product.name,
                  description: item.product.description,
                  price: item.product.price,
                  comparePrice: item.product.price * 1.2, // Mock compare price
                  images: item.product.images,
                  category: item.product.category as any,
                  subcategory: item.product.subcategory,
                  tags: item.product.tags,
                  stock: item.product.stock,
                  featured: item.product.featured,
                  status: item.product.status as any,
                  createdAt: new Date(item.createdAt),
                  updatedAt: new Date(item.createdAt)
                }}
              />
              {/* Trending Badge */}
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold">
                  🔥 #{item.order}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No trending products yet</h2>
          <p className="text-gray-500">Check back later for the latest trends!</p>
        </div>
      )}
    </div>
  );
} 