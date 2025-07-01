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
import { API_ENDPOINTS } from '@/lib/constants';
import { getAllProducts } from '@/lib/data';
import { Product } from '@/lib/types';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import Link from 'next/link';

// Define the Category type
interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories: Subcategory[];
}

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');

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
    
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setCategoryLoading(false);
      }
    };
    
    fetchProducts();
    fetchCategories();
  }, []);

  const category = useMemo(() => {
    if (categoryLoading || !categories.length) return null;
    return categories.find(cat => cat.slug === categorySlug);
  }, [categories, categorySlug, categoryLoading]);
  
  useEffect(() => {
    let filtered = products.filter(product => product.category === categorySlug);

    // Get unique subcategories for this category
    const categorySubcategories = Array.from(new Set(
      filtered
        .map(p => p.subcategory)
        .filter(Boolean)
    )) as string[];
    setSubcategories(categorySubcategories);

    // Filter by subcategory if selected
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.comparePrice || a.price) - (b.comparePrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.comparePrice || b.price) - (a.comparePrice || a.price));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    setFilteredProducts(filtered);
  }, [products, categorySlug, selectedSubcategory, sortBy]);

  if (loading || categoryLoading) {
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
      <FloatingWhatsApp />

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
        {category.subcategories && category.subcategories.length > 0 && (
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
            {filteredProducts.length} products found
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
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
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Check back soon for new arrivals in this category.
            </p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-2 gap-3 sm:gap-6'
              : 'space-y-4'
          }>
            {filteredProducts.map(product => (
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