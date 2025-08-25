'use client';

import { useState, memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
  className?: string;
}

function ProductCard({ product, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
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
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      sku: product.sku,
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity: 1,
      sku: product.sku,
    });
    router.push('/checkout');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        sku: product.sku,
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Fallback image
  const fallbackImage = 'https://placehold.co/400x400?text=Image+Not+Available';
  const primaryImage = product.images?.[0] || fallbackImage;
  const secondaryImage = product.images?.[1];

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-white border-0 shadow-sm",
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
              src={imageError ? fallbackImage : primaryImage}
              alt={product.name}
              width={400}
              height={533}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={() => setImageError(true)}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {secondaryImage && !imageError && (
              <Image
                src={secondaryImage}
                alt={product.name}
                width={400}
                height={533}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
            )}
          </div>
        </Link>

        {/* Badges - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 pointer-events-none z-10">
          {/* Sale Badge */}
          {discountPercentage > 0 && (
            <div className="bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-none">
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Sold Out Badge */}
          {product.stock === 0 && (
            <div className="bg-gray-600 text-white text-xs font-medium px-2 py-1 rounded-none">
              Sold Out
            </div>
          )}
          
          {/* Featured Badge */}
          {product.featured && product.stock > 0 && discountPercentage === 0 && (
            <div className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-none">
              Featured
            </div>
          )}
        </div>

        {/* Wishlist Button - Top Left */}
        <div className={cn(
          "absolute top-3 left-3 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 hover:bg-white border-0 shadow-sm"
            onClick={handleWishlistToggle}
          >
            <Heart 
              className={cn(
                "h-4 w-4",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
              )}
            />
          </Button>
        </div>

        {/* Quick Actions on Hover */}
        <div className={cn(
          "absolute bottom-3 left-3 right-3 transition-all duration-300 space-y-2",
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        )}>
          <Button
            className="w-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white border-black text-black hover:bg-gray-50 text-sm font-medium"
            size="sm"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
          >
            Buy Now
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/products/${product.id}`}>
        <CardContent className="p-4 bg-white cursor-pointer">
          <div className="space-y-3">
            {/* Product Title */}
            <h3 className="font-medium text-gray-900 leading-tight line-clamp-2 group-hover:text-gray-700 transition-colors text-center uppercase tracking-wide text-sm">
              {product.name}
            </h3>
            
            {/* Price Section */}
            <div className="text-center space-y-2">
              {/* Original and Sale Price on same line */}
              <div className="flex items-center justify-center space-x-2">
                {/* Compare Price (Original Price) */}
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{Math.round(product.comparePrice).toLocaleString()}
                  </span>
                )}
                {/* Our Sale Price */}
                <span className="text-base font-semibold text-gray-900">
                  ₹{Math.round(product.price).toLocaleString()}
                </span>
              </div>
              
              {/* Discount Percentage */}
              {discountPercentage > 0 && (
                <div className="text-red-600 text-sm font-medium">
                  Save {discountPercentage}%
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

// Memoize the component to prevent unnecessary re-renders
export { ProductCard };
export default memo(ProductCard);