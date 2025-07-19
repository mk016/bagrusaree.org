'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, Users, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
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

// Default/fallback data that shows immediately
const DEFAULT_STATS = [
  { label: 'Happy Customers', value: '1,000+', icon: Users },
  { label: 'Products Sold', value: '5,000+', icon: ShoppingCart },
  { label: 'Customer Rating', value: '4.9/5', icon: Star },
  { label: 'Years of Trust', value: '5+', icon: TrendingUp },
];

const DEFAULT_BANNERS: Banner[] = [
  {
    id: '1',
    order: 0,
    title: 'Discover Authentic Indian Fashion',
    description: 'Explore our exquisite collection',
    image: '/assets/Banner/Banner1.webp',
    imageId: 'default-1',
    imageName: 'Banner1.webp',
    link: '/products',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'system'
  }
];

export default function Home() {
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [currentImage, setCurrentImage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS);

  // Default categories to ensure the section always shows
  const DEFAULT_CATEGORIES = [
    {
      id: '1',
      name: 'Sarees',
      slug: 'sarees',
      description: 'Traditional Indian sarees collection',
      image: '/assets/sarees/saree1.jpeg',
      featured: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
    {
      id: '2',
      name: 'Suit Sets',
      slug: 'suit-sets',
      description: 'Complete suit sets for every occasion',
      image: '/assets/suit/suit2.webp',
      featured: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
    {
      id: '3',
      name: 'Dress Material',
      slug: 'dress-material',
      description: 'Unstitched dress materials',
      image: '/assets/chiffon_dupatta/dupatta1.webp',
      featured: false,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
    {
      id: '4',
      name: 'Dupattas',
      slug: 'dupattas',
      description: 'Beautiful dupattas and scarves',
      image: '/assets/chiffon_dupatta/dupatta2.webp',
      featured: false,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
    {
      id: '5',
      name: 'Bedsheets',
      slug: 'bedsheets',
      description: 'Comfortable bedsheets and home textiles',
      image: '/assets/Banner/Banner1.webp',
      featured: false,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
    {
      id: '6',
      name: 'Stitched Collection',
      slug: 'stitched-collection',
      description: 'Ready-to-wear stitched garments',
      image: '/assets/suit/suit3.webp',
      featured: true,
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [],
    },
  ];

  // Progressive data loading - each section loads independently
  useEffect(() => {
    // Load banners first (lightweight)
    getBanners()
      .then(data => {
        if (data && data.length > 0) {
          setBanners(data);
        }
      })
      .catch(console.error);

    // Load categories (lightweight) - start with defaults
    setCategories(DEFAULT_CATEGORIES);
    getCategories()
      .then(data => {
        if (data && data.length > 0) {
          console.log('Loaded categories from API:', data.length);
          setCategories(data);
        } else {
          console.log('Using default categories');
        }
      })
      .catch(err => {
        console.log('Categories API failed, using defaults:', err);
      });

    // Use default stats only - no API call needed

    // Load products last (heavier) - don't block UI
    getAllProducts()
      .then(setProducts)
      .catch(console.error);
  }, []);

  // Banner rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />

      {/* Banner Section - Enhanced for Mobile & Desktop */}
      <section className="relative h-[300px] xs:h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-100">
        {banners.length > 0 ? (
          banners.map((banner, index) => (
            <Link 
              key={banner.id} 
              href={banner.link || '/products'}
              className={`absolute inset-0 cursor-pointer transition-opacity duration-1000 ${
                index === currentImage ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Banner Image */}
              <img
                src={banner.image || IMAGE_PLACEHOLDER}
                alt={banner.title}
                className="h-full w-full object-cover object-center"
                loading="eager"
              />
              
              {/* Banner Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/20 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 xs:p-6 sm:p-8 md:p-12 text-white">
                  <div className="max-w-2xl">
                    <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3">
                      {banner.title || 'Discover Amazing Products'}
                    </h2>
                    {banner.description && (
                      <p className="text-sm xs:text-base sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4 hidden xs:block">
                        {banner.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className="text-xs xs:text-sm sm:text-base font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        Shop Now
                      </span>
                      <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <Link href="/products" className="absolute inset-0 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700">
              <div className="absolute inset-0 opacity-10" 
                   style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 1.895 2 2 2z" fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"/%3E%3C/svg%3E")' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-6">

                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-xs xs:text-sm sm:text-base font-medium bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                      Explore Products
                    </span>
                    <ArrowRight className="h-4 w-4 xs:h-5 xs:w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}
        
        {/* Navigation Arrows - Desktop Only */}
        {banners.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage((prev) => (prev - 1 + banners.length) % banners.length)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 hidden sm:flex items-center justify-center z-10"
              aria-label="Previous banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentImage((prev) => (prev + 1) % banners.length)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 hidden sm:flex items-center justify-center z-10"
              aria-label="Next banner"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
        
        {/* Image Indicators - Enhanced */}
        {banners.length > 1 && (
          <div className="absolute bottom-4 xs:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`h-2 w-6 xs:w-8 rounded-full transition-all duration-200 ${
                  index === currentImage 
                    ? 'bg-white shadow-lg scale-110' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Categories - Responsive Horizontal Scroll Section */}
      {categories.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-4">
              Shop by Categories
            </h2>
            <div
              className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2"
              style={{
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none', // IE 10+
              }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="flex-shrink-0 flex flex-col items-center w-20 h-auto xs:w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56"
                >
                  <div
                    className="rounded-full overflow-hidden bg-gray-100 border-2 border-indigo-100 flex items-center justify-center mb-2 shadow-sm transition-transform hover:scale-105 w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52"
                  >
                    <img
                      src={category.image || IMAGE_PLACEHOLDER}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span
                    className="text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-800 text-center font-medium"
                  >
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section - Shows immediately */}
      <section className="py-10 sm:py-14 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div 
            className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 justify-center"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE 10+
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {stats.map((stat, index) => (
              <div key={index} className="text-center flex-shrink-0 flex flex-col items-center min-w-[120px] sm:min-w-[150px] max-w-[200px]">
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

      {/* Featured Categories - Shows when available */}
    
     



      {/* Trending Products - Shows when available */}
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
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products by Category - Shows when available */}
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
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}

      

      <Footer />
    </div>
  );
}