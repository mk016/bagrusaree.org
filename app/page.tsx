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
import { MOCK_PRODUCTS, CATEGORIES } from '@/lib/constants';
import { CategoryProductGroup } from '@/lib/types';

const heroImages = [
  '/assets/Banner/Banner1.webp',
  '/assets/Banner/Banner2.webp',
  '/assets/Banner/Banner3.webp',
];

const stats = [
  { label: 'Happy Customers', value: '50,000+', icon: Users },
  { label: 'Products Sold', value: '100,000+', icon: ShoppingCart },
  { label: 'Customer Rating', value: '4.9/5', icon: Star },
  { label: 'Years of Trust', value: '10+', icon: TrendingUp },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = MOCK_PRODUCTS.filter(product => product.featured);
  const featuredCategories = CATEGORIES.filter(cat => cat.featured);

  const productsByCategory: CategoryProductGroup[] = CATEGORIES.reduce((acc: CategoryProductGroup[], category) => {
    const productsInThisCategory = MOCK_PRODUCTS.filter(
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="h-full w-full object-cover"
                style={{ objectPosition: 'center' }}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
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
        <div className="absolute bottom-4 xs:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
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
                      src={category.image}
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

      {/* Featured Products */}
      <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12 gap-4 sm:gap-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Handpicked collection of our bestselling items
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
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Products by Category */}
      {productsByCategory.map((data) => (
        <section key={data.category.id} className="py-10 sm:py-14 md:py-16 bg-gray-50">
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
          <form
            className="flex flex-col xs:flex-row gap-3 sm:gap-4 max-w-md mx-auto w-full"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 bg-white w-full"
              required
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100 w-full xs:w-auto" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}