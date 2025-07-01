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
import { getAllProducts } from '@/lib/data';

export default function SubcategoryPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;
  const subcategorySlug = params?.subcategorySlug as string;
  
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(API_ENDPOINTS.CATEGORIES);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData);
        }
        
        // Fetch products
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const category = useMemo(() => 
    categories.find(cat => cat.slug === categorySlug), 
    [categories, categorySlug]
  );
  
  const subcategory = useMemo(() => 
    category?.subcategories?.find(sub => sub.slug === subcategorySlug), 
    [category, subcategorySlug]
  );

  const subcategoryProducts = useMemo(() => {
    if (!categorySlug || !subcategorySlug || !products.length) return [];

    let filtered = products.filter(product => 
      product.category === categorySlug && product.subcategory === subcategorySlug
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => {
          const aDate = a.createdAt ? (typeof a.createdAt === 'string' ? new Date(a.createdAt) : a.createdAt) : new Date(0);
          const bDate = b.createdAt ? (typeof b.createdAt === 'string' ? new Date(b.createdAt) : b.createdAt) : new Date(0);
          return bDate.getTime() - aDate.getTime();
        });
        break;
    }

    return filtered;
  }, [categorySlug, subcategorySlug, sortBy, products]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!category || !subcategory) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link 
              href={`/category/${categorySlug}`} 
              className="hover:text-indigo-600 transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{subcategory.name}</span>
          </nav>
        </div>
      </div>

      {/* Subcategory Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">{subcategory.name}</h1>
            <p className="text-xl text-gray-300">
              Explore our curated collection of {subcategory.name.toLowerCase()} from the {category.name.toLowerCase()} category.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="text-sm text-gray-600">
            {subcategoryProducts.length} product{subcategoryProducts.length !== 1 ? 's' : ''} found
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
        {subcategoryProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Check back soon for new arrivals in this subcategory.
            </p>
            <Button onClick={() => window.history.back()}>
              Back to {category.name}
            </Button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {subcategoryProducts.map(product => (
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