'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { ArrowRight, Shield, Truck, CreditCard, RefreshCw, Star, Users, Award } from 'lucide-react';
import Link from 'next/link';

export default function BenefitsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Customer Benefits</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Discover why thousands of customers choose BagruSarees for their ethnic wear needs
          </p>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Quality Assurance */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Quality</h3>
              <p className="text-gray-600 mb-4">
                Every product is carefully selected and quality-checked before reaching you. 
                We work with the finest artisans and use premium materials.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Handpicked materials</li>
                <li>• Expert craftsmanship</li>
                <li>• Quality assurance</li>
              </ul>
            </div>

            {/* Free Shipping */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Shipping</h3>
              <p className="text-gray-600 mb-4">
                Enjoy free shipping on orders above ₹999. Fast and reliable delivery 
                across India with real-time tracking.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Free shipping on ₹999+</li>
                <li>• Fast delivery</li>
                <li>• Real-time tracking</li>
              </ul>
            </div>

            {/* Secure Payment */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-600 mb-4">
                Multiple secure payment options including COD, UPI, cards, and net banking. 
                Your payment information is always protected.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• COD available</li>
                <li>• Multiple payment options</li>
                <li>• Secure transactions</li>
              </ul>
            </div>

            {/* Easy Returns */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <RefreshCw className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Returns</h3>
              <p className="text-gray-600 mb-4">
                Not satisfied? No worries! Easy returns and exchanges within 7 days. 
                We make sure you're completely happy with your purchase.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 7-day return policy</li>
                <li>• Easy exchange process</li>
                <li>• No questions asked</li>
              </ul>
            </div>

            {/* Customer Support */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600 mb-4">
                Our customer support team is always ready to help you. 
                Get assistance via WhatsApp, call, or email anytime.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• WhatsApp support</li>
                <li>• Phone assistance</li>
                <li>• Email support</li>
              </ul>
            </div>

            {/* Authentic Products */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
              <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Products</h3>
              <p className="text-gray-600 mb-4">
                Every product is sourced directly from authentic artisans and weavers. 
                No middlemen, ensuring you get the best quality at fair prices.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Direct from artisans</li>
                <li>• Fair pricing</li>
                <li>• Authentic designs</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Amazing quality sarees! The delivery was super fast and the product exceeded my expectations."
              </p>
              <p className="text-sm font-medium text-gray-900">- Priya Sharma</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Best place to buy ethnic wear online. Customer service is excellent and products are authentic."
              </p>
              <p className="text-sm font-medium text-gray-900">- Meera Patel</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Love their collection! The suits are beautifully crafted and the pricing is very reasonable."
              </p>
              <p className="text-sm font-medium text-gray-900">- Anjali Singh</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Experience the Benefits?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust BagruSarees for their ethnic wear needs.
          </p>
          <Link href="/products" className="bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center space-x-2">
            <span>Shop Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
} 