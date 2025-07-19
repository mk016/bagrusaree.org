'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { ArrowRight, Tag, Clock, Star, Truck, Percent } from 'lucide-react';
import Link from 'next/link';

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Special Offers</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover amazing deals and discounts on authentic Indian ethnic wear
          </p>
        </div>
      </section>

      {/* Current Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Current Offers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Welcome Offer */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Percent className="h-6 w-6" />
                </div>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Limited Time</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Welcome Offer</h3>
              <p className="text-green-100 mb-4">
                Get 10% off on your first order with code: WELCOME10
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4" />
                <span>Valid till 31st Dec 2024</span>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6" />
                </div>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Always Active</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Free Shipping</h3>
              <p className="text-blue-100 mb-4">
                Free shipping on all orders above ₹999 across India
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="h-4 w-4" />
                <span>No minimum order value</span>
              </div>
            </div>

            {/* Bulk Discount */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Tag className="h-6 w-6" />
                </div>
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Bulk Order</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Bulk Discount</h3>
              <p className="text-purple-100 mb-4">
                Get up to 20% off on orders above ₹5000
              </p>
              <div className="flex items-center space-x-2 text-sm">
                <Percent className="h-4 w-4" />
                <span>20% off on ₹5000+</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Seasonal Offers */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Seasonal Offers</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Festival Sale */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <Tag className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Festival Sale</h3>
                  <p className="text-red-600 font-medium">Up to 30% Off</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Celebrate festivals in style with our exclusive collection. 
                Get amazing discounts on sarees, suits, and ethnic wear.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">30% off on sarees</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">25% off on suits</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Free gift with purchase</span>
                </div>
              </div>
              <Link href="/products" className="inline-flex items-center space-x-2 mt-6 text-red-600 hover:text-red-700 font-medium">
                <span>Shop Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* New Collection */}
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4 mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                  <Star className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">New Collection</h3>
                  <p className="text-green-600 font-medium">15% Off</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Explore our latest collection of handcrafted ethnic wear. 
                Fresh designs with modern appeal and traditional craftsmanship.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Latest designs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Premium quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Limited time offer</span>
                </div>
              </div>
              <Link href="/products" className="inline-flex items-center space-x-2 mt-6 text-green-600 hover:text-green-700 font-medium">
                <span>Explore Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* How to Use Offers */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How to Use Our Offers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Products</h3>
              <p className="text-gray-600">
                Explore our collection of sarees, suits, and ethnic wear
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Apply Code</h3>
              <p className="text-gray-600">
                Enter the offer code at checkout to get your discount
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Enjoy Savings</h3>
              <p className="text-gray-600">
                Get your products delivered with amazing savings
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Don't Miss Out on These Amazing Offers!</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Limited time offers are running out fast. Shop now and save big on authentic Indian ethnic wear.
          </p>
          <Link href="/products" className="bg-white text-red-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2 font-semibold">
            <span>Shop Now & Save</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
} 