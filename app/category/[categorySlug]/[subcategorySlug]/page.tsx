"use client";

import { useParams } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { API_ENDPOINTS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Product, Category, Subcategory } from '@/lib/types';
import { getAllProducts, getCategories } from '@/lib/data';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';

export default function SubcategoryPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;
  const subcategorySlug = params?.subcategorySlug as string;
  
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const category = useMemo(() => 
    categories.find(cat => cat.slug === categorySlug), 
    [categories, categorySlug]
  );
  
  const subcategory = useMemo(() => 
    category?.subcategories?.find(sub => sub.slug === subcategorySlug), 
    [category, subcategorySlug]
  );

  useEffect(() => {
    let filtered = products.filter(product => 
      product.category === categorySlug && 
      product.subcategory?.toLowerCase().replace(/\s+/g, '-') === subcategorySlug
    );

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
  }, [products, categorySlug, subcategorySlug, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <CartSidebar />
        <FloatingWhatsApp />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category || !subcategory) {
    notFound();
  }

  const subcategoryName = subcategory.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

      <main className="flex-1">
        {/* Breadcrumb and Header */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600 mb-4">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/category/${categorySlug}`} className="hover:text-gray-900">
                {category.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{subcategoryName}</span>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {subcategoryName}
            </h1>
            <p className="text-gray-600">
              Explore our collection of {subcategoryName.toLowerCase()} from our {category.name} range
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="text-gray-600 text-sm">
              {filteredProducts.length} products
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
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
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                We don't have any products in this subcategory yet.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link href={`/category/${categorySlug}`}>
                    Browse {category.name}
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/products">Browse All Products</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}