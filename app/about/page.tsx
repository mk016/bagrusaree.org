'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { ArrowRight, Star, Users, Award, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">About BagruSarees</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover the legacy of authentic Indian fashion and craftsmanship
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative">
              <img
                src="/assets/Banner/Banner1.webp"
                alt="BagruSarees Collection"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                BagruSarees is your gateway to authentic Indian ethnic wear, bringing you the finest collection 
                of sarees, suits, and traditional garments. We take pride in offering handcrafted pieces that 
                celebrate India's rich cultural heritage and contemporary fashion trends.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Based in the heart of Bagru, Jaipur, we source our materials from the finest artisans and 
                weavers, ensuring that every piece tells a story of tradition, craftsmanship, and elegance.
              </p>
              
              <div className="flex items-center space-x-4">
                <Link href="/products" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                  <span>Explore Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose BagruSarees?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handpicked materials and expert craftsmanship</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and reliable shipping across India</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600">24/7 support for all your queries</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Designs</h3>
              <p className="text-gray-600">Traditional patterns with modern appeal</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get in Touch</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-lg text-gray-600">
              Have questions about our products? We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📞</span>
                <span className="text-gray-900 font-medium">+91 76656 29448</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📍</span>
                <span className="text-gray-900 font-medium">Bagru, Jaipur</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 