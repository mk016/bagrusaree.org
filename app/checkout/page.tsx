"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CheckoutForm } from '@/components/checkout/checkout-form';
import { useCartStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

// Define available coupons
const AVAILABLE_COUPONS = {
  'FIRST10': { discount: 10, type: 'percentage', description: '10% off for first-time buyers' },
  'SAVE50': { discount: 50, type: 'fixed', description: '₹50 off on orders above ₹500' },
  'WELCOME20': { discount: 20, type: 'percentage', description: '20% off welcome offer' },
  'FLAT100': { discount: 100, type: 'fixed', description: '₹100 off on orders above ₹1000' },
  'FESTIVE15': { discount: 15, type: 'percentage', description: '15% festive discount' },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax - couponDiscount;

  // Coupon functions
  const applyCoupon = () => {
    const coupon = AVAILABLE_COUPONS[couponCode.toUpperCase() as keyof typeof AVAILABLE_COUPONS];
    
    if (!coupon) {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is not valid.",
        variant: "destructive",
      });
      return;
    }

    // Check minimum order requirements
    if (couponCode.toUpperCase() === 'SAVE50' && subtotal < 500) {
      toast({
        title: "Minimum Order Required",
        description: "This coupon requires a minimum order of ₹500.",
        variant: "destructive",
      });
      return;
    }

    if (couponCode.toUpperCase() === 'FLAT100' && subtotal < 1000) {
      toast({
        title: "Minimum Order Required",
        description: "This coupon requires a minimum order of ₹1000.",
        variant: "destructive",
      });
      return;
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.round((subtotal * coupon.discount) / 100);
    } else {
      discount = coupon.discount;
    }

    setCouponDiscount(discount);
    setAppliedCoupon(couponCode.toUpperCase());
    setCouponCode('');

    toast({
      title: "Coupon Applied!",
      description: `You saved ₹${discount} with ${couponCode.toUpperCase()}`,
      variant: "default",
    });
  };

  const removeCoupon = () => {
    setCouponDiscount(0);
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
      description: "The coupon has been removed from your order.",
      variant: "default",
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <Button onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <CheckoutForm onBack={() => router.back()} />
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex space-x-4 pb-4 border-b last:border-b-0">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">{item.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </div>
                        <div className="font-medium text-sm mt-1">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Coupon Code Section */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Have a coupon code?</span>
                  </div>
                  
                  {!appliedCoupon ? (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="bg-white text-sm"
                      />
                      <Button 
                        onClick={applyCoupon}
                        variant="outline"
                        size="sm"
                        disabled={!couponCode.trim()}
                        className="bg-white whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          {appliedCoupon} applied
                        </span>
                      </div>
                      <Button
                        onClick={removeCoupon}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {/* Show available coupons */}
                  {!appliedCoupon && (
                    <div className="text-xs text-gray-500">
                      <p className="font-medium mb-1">Available coupons:</p>
                      <div className="space-y-1">
                        <p>• FIRST10 - 10% off for first-time buyers</p>
                        <p>• SAVE50 - ₹50 off on orders above ₹500</p>
                        <p>• WELCOME20 - 20% off welcome offer</p>
                        <p>• FLAT100 - ₹100 off on orders above ₹1000</p>
                        <p>• FESTIVE15 - 15% festive discount</p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount ({appliedCoupon})</span>
                      <span>-₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ₹{(999 - subtotal).toLocaleString()} more to get free shipping!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}