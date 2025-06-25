'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { useWishlistStore, useCartStore } from '@/lib/store';
import Link from 'next/link';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const handleAddToCart = (item: any) => {
    addToCart({
      productId: item.productId,
      product: item.product,
      quantity: 1,
    });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeItem(productId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved for later
              </p>
            </div>
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Wishlist Content */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love by clicking the heart icon on any product. 
              They'll appear here for easy access later.
            </p>
            <div className="space-y-4">
              <Button asChild size="lg">
                <Link href="/products">
                  <Search className="h-5 w-5 mr-2" />
                  Browse Products
                </Link>
              </Button>
              <div className="text-sm text-gray-500">
                or{' '}
                <Link href="/" className="text-indigo-600 hover:text-indigo-500">
                  return to homepage
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group relative overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/products/${item.productId}`}>
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">
                      {item.product.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                      {item.product.comparePrice && (
                        <Badge variant="destructive" className="text-xs">
                          -{Math.round(((item.product.comparePrice - item.product.price) / item.product.comparePrice) * 100)}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Remove from Wishlist */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(item.productId);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Link>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {item.product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-lg">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      {item.product.comparePrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.product.comparePrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {item.product.stock === 0 ? (
                      <Button disabled className="w-full" size="sm">
                        Out of Stock
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3"
                          onClick={() => handleRemoveFromWishlist(item.productId)}
                        >
                          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        </Button>
                      </div>
                    )}

                    {item.product.stock > 0 && item.product.stock < 10 && (
                      <p className="text-xs text-orange-600">
                        Only {item.product.stock} left in stock!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Recommended Products */}
        {items.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">You might also like</h2>
              <p className="text-gray-600">Discover more products similar to your wishlist items</p>
            </div>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/products">
                  Browse All Products
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}