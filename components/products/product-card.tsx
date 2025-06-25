'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      product,
      quantity: 1,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart first
    addToCart({
      productId: product.id,
      product,
      quantity: 1,
    });
    // Then redirect to checkout
    router.push('/checkout');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        userId: '1', // This would come from auth
        productId: product.id,
        product,
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view functionality would go here
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        {/* Clickable image area */}
        <Link href={`/products/${product.id}`}>
          <div className="aspect-[3/4] relative cursor-pointer">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={500}
              height={500}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={product.name}
                width={500}
                height={500}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col space-y-1 pointer-events-none">
          {product.featured && (
            <Badge variant="secondary" className="text-xs bg-white text-gray-900">
              Featured
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.stock < 5 && (
            <Badge variant="outline" className="text-xs bg-white text-orange-600 border-orange-600">
              Low Stock
            </Badge>
          )}
        </div>

        {/* Action Buttons - Outside of Link */}
        <div className={cn(
          "absolute top-2 right-2 flex flex-col space-y-1 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isWishlisted && "fill-red-500 text-red-500"
              )}
            />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white hover:bg-gray-100"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Actions - Outside of Link */}
        <div className={cn(
          "absolute bottom-2 left-2 right-2 transition-all duration-300 space-y-2",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <Button
            className="w-full bg-white text-gray-900 hover:bg-gray-100"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white border-gray-300 text-gray-900 hover:bg-gray-50"
            size="sm"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Product Info - Clickable */}
      <Link href={`/products/${product.id}`}>
        <CardContent className="p-4 bg-white cursor-pointer">
          <div className="space-y-2">
            <h3 className="font-medium leading-tight line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )}
                />
              ))}
              <span className="text-xs text-gray-500 ml-1">(24)</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="font-semibold text-lg">
                ₹{product.price.toLocaleString()}
              </span>
              {product.comparePrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.comparePrice.toLocaleString()}
                </span>
              )}
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-white"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}