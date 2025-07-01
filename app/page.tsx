'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { getAllProducts, getCategories, getBanners } from '@/lib/data';
import { Product, Category, CategoryProductGroup } from '@/lib/types';
import { Banner } from '@prisma/client';
import { IMAGE_PLACEHOLDER } from '@/lib/constants';

// Stats icons mapping
const statsIcons = {
  'customers': Users,
  'products': ShoppingCart,
  'rating': Star,
  'years': TrendingUp,
};

export default function Home() {
  // Default stats that will be replaced with API data
  const [stats, setStats] = useState([
    { label: 'Happy Customers', value: '50,000+', icon: Users },
    { label: 'Products Sold', value: '100,000+', icon: ShoppingCart },
    { label: 'Customer Rating', value: '4.9/5', icon: Star },
    { label: 'Years of Trust', value: '10+', icon: TrendingUp },
  ]);
  const [currentImage, setCurrentImage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsData, categoriesData, bannersData, statsData] = await Promise.all([
          getAllProducts(),
          getCategories(),
          getBanners(),
          fetch('/api/stats').then(res => res.json())
        ]);
        
        setProducts(productsData);
        setCategories(categoriesData);
        setBanners(bannersData);
        
        // Map stats with icons
        if (Array.isArray(statsData)) {
          const statsWithIcons = statsData.map(stat => ({
            ...stat,
            icon: statsIcons[stat.id as keyof typeof statsIcons] || Users
          }));
          setStats(statsWithIcons);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Banner rotation
  useEffect(() => {
    if (banners.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % banners.length);
    }, 5000);
    
    return () => clearInterval(timer);
  }, [banners.length]);

  // Get trending products (featured products)
  const trendingProducts = products.filter(product => product.featured).slice(0, 4);
  const featuredCategories = categories.filter(cat => cat.featured);

  const productsByCategory: CategoryProductGroup[] = categories.reduce((acc: CategoryProductGroup[], category) => {
    const productsInThisCategory = products.filter(
      (product) => product.category === category.slug
    ).slice(0, 4); // Limit to 4 products per category
    
    if (productsInThisCategory.length > 0) {
      acc.push({
        category: category,
        products: productsInThisCategory,
      });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={banner.image || IMAGE_PLACEHOLDER}
                  alt={banner.title}
                  className="h-full w-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ))
          ) : (
            <div className="absolute inset-0 bg-indigo-900">
              <div className="absolute inset-0 opacity-20" 
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")' }}></div>
            </div>
          )}
        </div>
        <div className="relative z-10 flex h-full items-center w-full">
          <div className="container mx-auto px-4 w-full">
            <div className="max-w-2xl text-white">
              <h1 className="mb-4 text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                Discover Authentic
                <span className="block text-indigo-400">Indian Fashion</span>
              </h1>
              <p className="mb-6 text-sm xs:text-base sm:text-lg md:text-xl text-gray-200">
                Explore our exquisite collection of traditional and contemporary 
                ethnic wear crafted with love and precision.
              </p>
              <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 w-full">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 w-full xs:w-auto" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black w-full xs:w-auto"
                  asChild
                >
                  <Link href="/products">
                    View Collections
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        {/* Image Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 xs:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 w-6 xs:w-8 rounded-full transition-colors ${
                  index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex flex-col items-center">
                <div className="flex justify-center mb-2 sm:mb-4">
                  <div className="bg-indigo-100 p-2 sm:p-3 rounded-full">
                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                  </div>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <section className="py-10 sm:py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                Shop by Category
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                Discover our carefully curated collections designed to celebrate 
                the beauty of traditional Indian fashion.
              </p>
            </div>
            
            <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 bg-white">
                    <div className="aspect-square relative">
                      <img
                        src={category.image || IMAGE_PLACEHOLDER}
                        alt={category.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h3 className="text-white text-base sm:text-lg font-semibold text-center">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Products */}
      {trendingProducts.length > 0 && (
        <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  Trending Products
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Discover what's popular right now
                </p>
              </div>
              <Button variant="outline" asChild className="bg-white w-full sm:w-auto">
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products by Category */}
      {productsByCategory.map((data) => (
        <section key={data.category.id} className="py-10 sm:py-14 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                  {data.category.name} Products
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Handpicked collection of our bestselling items from {data.category.name}
                </p>
              </div>
              <Button variant="outline" asChild className="bg-white w-full sm:w-auto">
                <Link href={`/category/${data.category.slug}`}>
                  View All {data.category.name}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Newsletter Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">
            Stay Updated with Latest Trends
          </h2>
          <p className="text-indigo-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
            Subscribe to our newsletter and be the first to know about new arrivals, 
            exclusive offers, and fashion tips.
          </p>
          <form className="max-w-md mx-auto flex flex-col xs:flex-row gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              required
            />
            <Button type="submit" className="bg-white text-indigo-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}