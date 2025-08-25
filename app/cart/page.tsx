"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    getTotalPrice 
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18); // 18% GST
  const finalTotal = totalPrice + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-100 p-8 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <div className="space-y-4">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/products">Continue Shopping</Link>
              </Button>
              <div>
                <Button variant="outline" onClick={() => router.back()}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Shopping Cart ({items.length} items)</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  Clear Cart
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4 pb-6 border-b last:border-b-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-medium text-lg leading-tight">
                            <Link 
                              href={`/products/${item.productId}`}
                              className="hover:text-indigo-600 transition-colors"
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {item.name}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                          {item.sku && <span>SKU: {item.sku}</span>}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm font-medium w-12 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-semibold text-lg">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ₹{(999 - totalPrice).toLocaleString()} more to get free shipping!
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button asChild className="w-full" size="lg">
                    <Link href="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/products">
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <div className="text-center text-sm text-gray-500">
                  <p>Secure checkout with SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}