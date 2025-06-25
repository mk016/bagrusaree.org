'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, MessageCircle, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function CheckoutSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  const openWhatsApp = () => {
    const whatsappNumber = '919024306866';
    const message = 'Hi! I just placed an order through your website. Can you please confirm the status?';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-6">
              <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 mb-4">
                Order Submitted Successfully!
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-blue-900">
                    Your order has been sent via WhatsApp
                  </h3>
                </div>
                <p className="text-blue-700 text-sm">
                  We've sent your order details to our WhatsApp number. Our team will contact you shortly to confirm your order and provide payment instructions.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">What happens next?</h4>
                <div className="text-left space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-600">Our team will review your order details</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-600">We'll contact you via WhatsApp to confirm the order</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-600">Payment instructions will be provided</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 rounded-full p-1 mt-1">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-600">Your order will be processed and shipped</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t">
                <Button onClick={openWhatsApp} className="w-full" size="lg">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Contact us on WhatsApp
                </Button>
                
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/products')} className="flex-1">
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                You will be redirected to the homepage in 10 seconds...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}