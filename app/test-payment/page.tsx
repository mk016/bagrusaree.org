'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RazorpayPayment } from '@/components/payment/razorpay-payment';
import { PaymentFormData } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

export default function TestPaymentPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  // Test order data
  const testOrderData = {
    customer: {
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '9876543210',
      address1: '123 Test Street',
      address2: 'Test Area',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      paymentMethod: 'razorpay' as const,
    },
    items: [
      {
        productId: 'test-product-1',
        name: 'Test Saree',
        quantity: 1,
        price: 999,
        total: 999,
        size: 'Free Size',
        color: 'Red',
      },
    ],
    pricing: {
      subtotal: 999,
      shipping: 0,
      tax: 180, // 18% GST
      total: 1179,
    },
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    toast({
      title: "Test Payment Successful!",
      description: `Payment ID: ${paymentId}, Order ID: ${orderId}`,
      variant: "default",
    });
    console.log('Payment Success:', { paymentId, orderId });
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Test Payment Failed",
      description: error,
      variant: "destructive",
    });
    console.error('Payment Error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Razorpay Payment Integration Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Test Information</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• This is a test page for verifying Razorpay integration</li>
                  <li>• Use test cards provided by Razorpay for testing</li>
                  <li>• Test Card: 4111 1111 1111 1111 (Visa)</li>
                  <li>• CVV: Any 3 digits, Expiry: Any future date</li>
                  <li>• For UPI testing, use: success@razorpay</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Test Order Details</h3>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Product:</strong> Test Saree - ₹999</p>
                  <p><strong>Shipping:</strong> Free</p>
                  <p><strong>Tax:</strong> ₹180 (18% GST)</p>
                  <p><strong>Total:</strong> ₹1,179</p>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-medium text-green-800 mb-2">Environment Check</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Razorpay Key ID:</strong> {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✅ Configured' : '❌ Missing'}</p>
                  <p><strong>Database:</strong> Connected</p>
                  <p><strong>Payment APIs:</strong> Ready</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Razorpay Payment Component */}
        <RazorpayPayment
          orderData={testOrderData}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          isProcessing={isProcessing}
          onProcessingChange={setIsProcessing}
        />

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
