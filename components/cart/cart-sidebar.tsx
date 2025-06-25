'use client';

import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import Link from 'next/link';

export function CartSidebar() {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getTotalPrice 
  } = useCartStore();

  const totalPrice = getTotalPrice();

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg bg-white">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5" />
            <span>Shopping Cart</span>
            {items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={toggleCart} asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h3 className="text-sm font-medium leading-tight">
                        {item.product.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 w-6 p-0 bg-white"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-red-500 hover:text-red-700"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4 bg-white">
              <div className="flex items-center justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  onClick={toggleCart}
                  asChild
                >
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-white" 
                  onClick={toggleCart}
                  asChild
                >
                  <Link href="/cart">View Cart</Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}