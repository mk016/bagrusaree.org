"use client";

import { useParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { CATEGORIES } from '@/lib/constants';
import { getAllProducts } from '@/lib/data';
import { Product } from '@/lib/types';

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (err: any) {
        console.error("Failed to fetch products for category page:", err);
        setError("Failed to load products for this category.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const category = CATEGORIES.find(cat => cat.slug === categorySlug);
  
  const categoryProducts = useMemo(() => {
    if (!category || loading || error) return [];
    
    let filtered = products.filter((product: Product) => product.category === categorySlug);

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a: Product, b: Product) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a: Product, b: Product) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a: Product, b: Product) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        break;
    }

    return filtered;
  }, [categorySlug, sortBy, products, category, loading, error]);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          Loading products...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      {/* Category Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-gray-300">
              Discover our beautiful collection of {category.name.toLowerCase()} crafted with love and attention to detail.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Subcategories */}
        {category.subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Shop by Style</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {category.subcategories.map((subcategory) => (
                <Card key={subcategory.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-sm font-medium">{subcategory.name}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-gray-600">
            {categoryProducts.length} products found
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {categoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Check back soon for new arrivals in this category.
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {categoryProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                className={viewMode === 'list' ? 'flex flex-row' : ''}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}