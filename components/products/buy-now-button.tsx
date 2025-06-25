'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { Product } from '@/lib/types';

interface BuyNowButtonProps {
  product: Product;
  quantity?: number;
  size?: string;
  color?: string;
  className?: string;
  disabled?: boolean;
}

export function BuyNowButton({ 
  product, 
  quantity = 1, 
  size, 
  color, 
  className,
  disabled = false 
}: BuyNowButtonProps) {
  const router = useRouter();
  const { addItem } = useCartStore();

  const handleBuyNow = () => {
    if (disabled) return;
    
    // Add to cart
    addItem({
      productId: product.id,
      product,
      quantity,
      size,
      color,
    });
    
    // Redirect to checkout
    router.push('/checkout');
  };

  return (
    <Button 
      onClick={handleBuyNow}
      disabled={disabled}
      className={className}
      size="lg"
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      Buy Now
    </Button>
  );
}