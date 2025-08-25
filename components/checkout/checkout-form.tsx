'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Shield, ArrowLeft, Check, Lock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCartStore } from '@/lib/store';
// import { RazorpayPayment } from '@/components/payment/razorpay-payment';
import { PaymentFormData } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const indianStates = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

interface CheckoutFormProps {
  onBack: () => void;
}

export function CheckoutForm({ onBack }: CheckoutFormProps) {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState<PaymentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'cod',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    // No additional validation needed for Razorpay

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update form validation status whenever form data changes
  useEffect(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  const generateOrderSummary = () => {
    const orderDetails = {
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        address: `${formData.address1}${formData.address2 ? ', ' + formData.address2 : ''}, ${formData.city}, ${formData.state} - ${formData.zipCode}`
      },
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        size: item.size,
        color: item.color
      })),
      pricing: {
        subtotal,
        shipping,
        tax,
        total
      },
      paymentMethod: formData.paymentMethod
    };

    return orderDetails;
  };

  const sendToWhatsApp = (orderDetails: any) => {
    const whatsappNumber = '919024306866';
    
    let message = `🛍️ *NEW ORDER FROM BAGRUSAREES*\n\n`;
    message += `👤 *Customer Details:*\n`;
    message += `Name: ${orderDetails.customer.name}\n`;
    message += `Email: ${orderDetails.customer.email}\n`;
    message += `Phone: ${orderDetails.customer.phone}\n`;
    message += `Address: ${orderDetails.customer.address}\n\n`;
    
    message += `📦 *Order Items:*\n`;
    orderDetails.items.forEach((item: any, index: number) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ₹${item.price.toLocaleString()}\n`;
      if (item.size) message += `   Size: ${item.size}\n`;
      if (item.color) message += `   Color: ${item.color}\n`;
      message += `   Total: ₹${item.total.toLocaleString()}\n\n`;
    });
    
    message += `💰 *Order Summary:*\n`;
    message += `Subtotal: ₹${orderDetails.pricing.subtotal.toLocaleString()}\n`;
    message += `Shipping: ${orderDetails.pricing.shipping === 0 ? 'Free' : '₹' + orderDetails.pricing.shipping.toLocaleString()}\n`;
    message += `Tax (GST 18%): ₹${orderDetails.pricing.tax.toLocaleString()}\n`;
    message += `*Total: ₹${orderDetails.pricing.total.toLocaleString()}*\n\n`;
    
    message += `💳 *Payment Method:* ${orderDetails.paymentMethod.toUpperCase()}\n`;
    
    message += `\nPlease confirm this order and provide payment instructions.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handlePaymentSuccess = (paymentId: string, orderId: string) => {
    // Send WhatsApp notification for successful orders
    const orderDetails = generateOrderSummary();
    sendToWhatsApp(orderDetails);
    
    // Clear cart after successful payment
    clearCart();
    
    // Redirect to success page
    router.push(`/checkout/success?paymentId=${paymentId}&orderId=${orderId}`);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  const handleCODSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form Incomplete",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Generate order summary and send to WhatsApp
    const orderDetails = generateOrderSummary();
    sendToWhatsApp(orderDetails);
    
    // Clear cart after sending to WhatsApp
    clearCart();
    
    toast({
      title: "Order Sent to WhatsApp",
      description: "Please complete your order on WhatsApp.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
      </div>

      <form onSubmit={handleCODSubmit} className="space-y-6">
        {/* Contact Information */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`bg-white ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last name *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`bg-white ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email address *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`bg-white ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <Label htmlFor="phone">Phone number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`bg-white ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address1">Address line 1 *</Label>
              <Input
                id="address1"
                required
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                className={`bg-white ${errors.address1 ? 'border-red-500' : ''}`}
              />
              {errors.address1 && <p className="text-red-500 text-sm mt-1">{errors.address1}</p>}
            </div>

            <div>
              <Label htmlFor="address2">Address line 2 (optional)</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={`bg-white ${errors.city ? 'border-red-500' : ''}`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <div>
                <Label htmlFor="zipCode">ZIP code *</Label>
                <Input
                  id="zipCode"
                  required
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className={`bg-white ${errors.zipCode ? 'border-red-500' : ''}`}
                />
                {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger className={`bg-white ${errors.state ? 'border-red-500' : ''}`}>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {indianStates.map(state => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Payment Method
            </CardTitle>
            <CardDescription>Choose your preferred payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
                        <RadioGroup
              value={formData.paymentMethod} 
              onValueChange={(value) => handleInputChange('paymentMethod', value as 'razorpay' | 'cod')}
            >
              {/* <div className="flex items-center space-x-2">
                <RadioGroupItem value="razorpay" id="razorpay" />
                <Label htmlFor="razorpay" className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Online Payment (Cards, UPI, Net Banking)
                </Label>
              </div> */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Cash on Delivery</Label>
              </div>
            </RadioGroup>

            {/* {formData.paymentMethod === 'razorpay' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">
                  Pay securely with Credit/Debit Cards, UPI, Net Banking, or Digital Wallets.
                </p>
                <div className="text-xs text-green-600 flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure payment powered by Razorpay
                </div>
              </div>
            )} */}

            {formData.paymentMethod === 'cod' && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Pay with cash when your order is delivered. Additional charges may apply.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button for COD - Now redirects to WhatsApp */}
        {formData.paymentMethod === 'cod' && (
          <Button 
            type="button" 
            className="w-full" 
            size="lg"
            disabled={isProcessing || !isFormValid}
            onClick={() => {
              if (!validateForm()) {
                toast({
                  title: "Form Incomplete",
                  description: "Please fill in all required fields.",
                  variant: "destructive",
                });
                return;
              }
              
              const orderDetails = generateOrderSummary();
              sendToWhatsApp(orderDetails);
              
              // Clear cart after sending to WhatsApp
              clearCart();
              
              toast({
                title: "Order Sent to WhatsApp",
                description: "Please complete your order on WhatsApp.",
                variant: "default",
              });
            }}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              <>
                <MessageCircle className="h-5 w-5 mr-2" />
                Complete Order on WhatsApp - ₹{total.toLocaleString()}
              </>
            )}
          </Button>
        )}
      </form>

      {/* Razorpay Payment Component - Commented out for WhatsApp redirect */}
      {/* {formData.paymentMethod === 'razorpay' && isFormValid && (
        <RazorpayPayment
          orderData={{
            customer: formData,
            items: items.map(item => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
              size: item.size,
              color: item.color
            })),
            pricing: {
              subtotal,
              shipping,
              tax,
              total
            }
          }}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          isProcessing={isProcessing}
          onProcessingChange={setIsProcessing}
        />
      )}

      Form validation message for Razorpay
      {formData.paymentMethod === 'razorpay' && !isFormValid && (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            Please fill in all required fields above to continue with payment.
          </p>
        </div>
      )} */}
    </div>
  );
}