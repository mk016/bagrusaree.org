"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, Shield, ArrowLeft, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useCartStore, useAuthStore } from '@/lib/store';

const indianStates = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar',
  'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli', 'Daman and Diu', 'Delhi',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand',
  'Karnataka', 'Kerala', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'card',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: '',
    sameAsShipping: true
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotalPrice();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.nameOnCard) newErrors.nameOnCard = 'Name on card is required';
      if (!formData.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!formData.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
    }, 3000);
  };

  if (items.length === 0 && !orderComplete) {
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

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed and will be shipped soon.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-gray-600">Order ID: <span className="font-mono">ORD-{Date.now()}</span></p>
            </div>
            <div className="space-y-4">
              <Button onClick={() => router.push('/orders')} className="w-full">
                View Order Details
              </Button>
              <Button variant="outline" onClick={() => router.push('/products')} className="w-full">
                Continue Shopping
              </Button>
            </div>
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
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
              <p className="text-gray-600">Complete your order below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
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
                  <CardDescription>Your payment information is secure and encrypted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => handleInputChange('paymentMethod', value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi">UPI Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod">Cash on Delivery</Label>
                    </div>
                  </RadioGroup>

                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <Label htmlFor="cardNumber">Card number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          required
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                          className={`bg-white ${errors.cardNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                      </div>
                      <div>
                        <Label htmlFor="nameOnCard">Name on card *</Label>
                        <Input
                          id="nameOnCard"
                          required
                          value={formData.nameOnCard}
                          onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                          className={`bg-white ${errors.nameOnCard ? 'border-red-500' : ''}`}
                        />
                        {errors.nameOnCard && <p className="text-red-500 text-sm mt-1">{errors.nameOnCard}</p>}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryMonth">Month *</Label>
                          <Select value={formData.expiryMonth} onValueChange={(value) => handleInputChange('expiryMonth', value)}>
                            <SelectTrigger className={`bg-white ${errors.expiryMonth ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <SelectItem key={month} value={month.toString().padStart(2, '0')}>
                                  {month.toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryMonth && <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>}
                        </div>
                        <div>
                          <Label htmlFor="expiryYear">Year *</Label>
                          <Select value={formData.expiryYear} onValueChange={(value) => handleInputChange('expiryYear', value)}>
                            <SelectTrigger className={`bg-white ${errors.expiryYear ? 'border-red-500' : ''}`}>
                              <SelectValue placeholder="YYYY" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.expiryYear && <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>}
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={4}
                            required
                            value={formData.cvv}
                            onChange={(e) => handleInputChange('cvv', e.target.value)}
                            className={`bg-white ${errors.cvv ? 'border-red-500' : ''}`}
                          />
                          {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'upi' && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        You will be redirected to your UPI app to complete the payment.
                      </p>
                    </div>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        Pay with cash when your order is delivered. Additional charges may apply.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Complete Order - ₹${total.toLocaleString()}`
                )}
              </Button>
            </form>
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
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm leading-tight">{item.product.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity}
                          {item.size && ` • Size: ${item.size}`}
                          {item.color && ` • Color: ${item.color}`}
                        </div>
                        <div className="font-medium text-sm mt-1">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
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

            {/* Trust Indicators */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Secure checkout with SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                    <span className="text-sm">Free shipping on orders over ₹999</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <span className="text-sm">Multiple payment options available</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}