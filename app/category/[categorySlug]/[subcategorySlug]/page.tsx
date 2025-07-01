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
import { CATEGORIES, MOCK_PRODUCTS } from '@/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Product, ProductCategoryType } from '@/lib/types';

// Define ProductSubcategoryType as string since it's not defined in types.ts
type ProductSubcategoryType = string;

const allProducts = [
  ...MOCK_PRODUCTS,
  {
    id: '4',
    name: 'Cotton Palazzo Suit',
    description: 'Comfortable cotton palazzo suit perfect for daily wear',
    price: 1599,
    comparePrice: 2199,
    images: ['https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg'],
    category: 'suit-sets',
    subcategory: 'palazzo-suits',
    tags: ['cotton', 'casual', 'comfortable'],
    stock: 20,
    sku: 'PS001',
    featured: false,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Banarasi Silk Saree',
    description: 'Authentic Banarasi silk saree with gold zari work',
    price: 4999,
    comparePrice: 7999,
    images: ['https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg'],
    category: 'sarees',
    subcategory: 'silk-sarees',
    tags: ['silk', 'traditional', 'banarasi'],
    stock: 5,
    sku: 'BS001',
    featured: true,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Georgette Sharara Set',
    description: 'Elegant georgette sharara set with heavy embroidery',
    price: 3799,
    comparePrice: 5499,
    images: ['https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg'],
    category: 'suit-sets',
    subcategory: 'sharara-suits',
    tags: ['georgette', 'party-wear', 'embroidery'],
    stock: 12,
    sku: 'GS001',
    featured: false,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '7',
    name: 'Premium Cotton Fabric',
    description: 'High-quality cotton fabric perfect for dress making',
    price: 299,
    comparePrice: 399,
    images: ['https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg'],
    category: 'fabrics',
    subcategory: 'cotton-fabrics',
    tags: ['cotton', 'fabric', 'dress-material'],
    stock: 50,
    sku: 'CF001',
    featured: false,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Soft Cotton Blend Fabric',
    description: 'Comfortable cotton blend fabric for casual wear',
    price: 249,
    comparePrice: 349,
    images: ['https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg'],
    category: 'fabrics',
    subcategory: 'cotton-fabrics',
    tags: ['cotton', 'blend', 'casual'],
    stock: 35,
    sku: 'CF002',
    featured: false,
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function SubcategoryPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;
  const subcategorySlug = params?.subcategorySlug as string;
  
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  const category = useMemo(() => 
    CATEGORIES.find(cat => cat.slug === categorySlug), 
    [categorySlug]
  );
  
  const subcategory = useMemo(() => 
    category?.subcategories.find(sub => sub.slug === subcategorySlug), 
    [category, subcategorySlug]
  );

  useEffect(() => {
    if (categorySlug && subcategorySlug) {
      setIsLoading(false);
    }
  }, [categorySlug, subcategorySlug]);

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

  const subcategoryProducts = useMemo(() => {
    if (!categorySlug || !subcategorySlug) return [];

    let filtered = allProducts.filter(product => 
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
        filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }, [categorySlug, subcategorySlug, sortBy]);

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
                product={product as unknown as Product}
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