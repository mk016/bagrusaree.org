'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Lock, Shield, CheckCircle } from 'lucide-react';
import { PaymentFormData, RazorpayCheckoutOptions, RazorpayPaymentVerification } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface RazorpayPaymentProps {
  orderData: {
    customer: PaymentFormData;
    items: any[];
    pricing: {
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
    };
  };
  onSuccess: (paymentId: string, orderId: string) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  onProcessingChange: (processing: boolean) => void;
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export function RazorpayPayment({ 
  orderData, 
  onSuccess, 
  onError, 
  isProcessing, 
  onProcessingChange 
}: RazorpayPaymentProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          console.error('Failed to load Razorpay script');
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    if (!window.Razorpay) {
      loadRazorpayScript();
    } else {
      setIsScriptLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!isScriptLoaded) {
      onError('Payment system is loading. Please try again.');
      return;
    }

    onProcessingChange(true);

    try {
      // Create order with backend
      const orderResponse = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: orderData.pricing.total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customer_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
            customer_email: orderData.customer.email,
            customer_phone: orderData.customer.phone,
          },
        }),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const { order } = await orderResponse.json();

      // Razorpay checkout options
      const options: RazorpayCheckoutOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'BagruSarees',
        description: 'Premium Sarees and Fashion Collection',
        order_id: order.id,
        handler: async (response: RazorpayPaymentVerification) => {
          try {
            // Verify payment with backend
            const verifyResponse = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...response,
                orderData,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyResult = await verifyResponse.json();
            
            if (verifyResult.success) {
              toast({
                title: "Payment Successful!",
                description: "Your order has been placed successfully.",
                variant: "default",
              });
              onSuccess(verifyResult.paymentId, verifyResult.order.id);
            } else {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            onError(verifyError instanceof Error ? verifyError.message : 'Payment verification failed');
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support with your payment details.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
          email: orderData.customer.email,
          contact: orderData.customer.phone,
        },
        notes: {
          address: `${orderData.customer.address1}, ${orderData.customer.city}`,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: () => {
            onProcessingChange(false);
            toast({
              title: "Payment Cancelled",
              description: "You can retry the payment anytime.",
              variant: "default",
            });
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      onError(error instanceof Error ? error.message : 'Failed to initiate payment');
      onProcessingChange(false);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Secure Payment
        </CardTitle>
        <CardDescription>
          Complete your order with our secure payment gateway
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Payment Security Features */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Secure Payment</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              256-bit SSL encryption
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              PCI DSS compliant
            </li>
            <li className="flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Multiple payment options
            </li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 border rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Cards</div>
            <div className="text-sm font-medium">Visa, MasterCard</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-xs text-gray-600 mb-1">UPI</div>
            <div className="text-sm font-medium">GPay, PhonePe, Paytm</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Net Banking</div>
            <div className="text-sm font-medium">All Major Banks</div>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Wallets</div>
            <div className="text-sm font-medium">PayPal, Amazon Pay</div>
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">₹{orderData.pricing.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Pay Now Button */}
        <Button 
          onClick={handlePayment}
          disabled={isProcessing || !isScriptLoaded}
          className="w-full"
          size="lg"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing Payment...
            </div>
          ) : !isScriptLoaded ? (
            <div className="flex items-center">
              <div className="animate-pulse h-4 w-4 bg-white rounded mr-2"></div>
              Loading Payment System...
            </div>
          ) : (
            <>
              <Lock className="h-5 w-5 mr-2" />
              Pay Securely - ₹{orderData.pricing.total.toLocaleString()}
            </>
          )}
        </Button>

        {/* Security Notice */}
        <p className="text-xs text-gray-500 text-center">
          Your payment information is encrypted and secure. We don't store your card details.
        </p>
      </CardContent>
    </Card>
  );
}
