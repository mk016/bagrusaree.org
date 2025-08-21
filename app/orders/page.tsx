"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, XCircle, Eye, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { useAuthStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';

// User Order interface
interface UserOrder {
  id: string;
  orderNumber: string;
  date: Date;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  paymentMethod: string;
  trackingNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: Array<{
    id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    images: string[];
    category: string;
  }>;
  shippingAddress: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    phone?: string;
    // Legacy fields
    houseNo?: string;
    streetName?: string;
    societyName?: string;
    area?: string;
    pincode?: number;
    district?: string;
  };
  billingAddress: {
    id: string;
    name: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    address1?: string;
    address2?: string;
    city: string;
    state: string;
    zipCode?: string;
    country: string;
    phone?: string;
    // Legacy fields
    houseNo?: string;
    streetName?: string;
    societyName?: string;
    area?: string;
    pincode?: number;
    district?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Mock orders data for fallback
const mockOrders = [
  {
    id: 'ORD-001',
    date: new Date('2024-01-15'),
    status: 'delivered',
    total: 2499,
    items: [
      {
        id: '1',
        name: 'Elegant Silk Saree',
        price: 2499,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg'
      }
    ],
    trackingNumber: 'TRK123456789',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai, Maharashtra 400001'
    }
  },
  {
    id: 'ORD-002',
    date: new Date('2024-01-10'),
    status: 'shipped',
    total: 3299,
    items: [
      {
        id: '2',
        name: 'Designer Anarkali Suit',
        price: 3299,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg'
      }
    ],
    trackingNumber: 'TRK987654321',
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai, Maharashtra 400001'
    }
  },
  {
    id: 'ORD-003',
    date: new Date('2024-01-05'),
    status: 'processing',
    total: 899,
    items: [
      {
        id: '3',
        name: 'Cotton Dress Material',
        price: 899,
        quantity: 1,
        image: 'https://images.pexels.com/photos/994517/pexels-photo-994517.jpeg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai, Maharashtra 400001'
    }
  },
  {
    id: 'ORD-004',
    date: new Date('2023-12-20'),
    status: 'cancelled',
    total: 1599,
    items: [
      {
        id: '4',
        name: 'Cotton Palazzo Suit',
        price: 1599,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main St, Mumbai, Maharashtra 400001'
    }
  }
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('all');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });

  // Fetch user orders
  const fetchOrders = async (status: string = 'all', offset: number = 0) => {
    if (!user?.email) return;

    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        email: user.email,
        limit: '10',
        offset: offset.toString(),
      });
      
      if (status !== 'all') {
        params.append('status', status);
      }

      const response = await fetch(`/api/orders/user?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Convert date strings to Date objects
      const formattedOrders = data.orders.map((order: any) => ({
        ...order,
        date: new Date(order.date),
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      }));

      setOrders(formattedOrders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      // Fallback to mock data for demo
      setOrders(mockOrders.map((order: any) => ({
        ...order,
        orderNumber: order.id,
        paymentStatus: 'paid',
        subtotal: order.total - 100,
        tax: 50,
        shipping: 50,
        paymentMethod: 'razorpay',
        items: order.items.map((item: any) => ({
          ...item,
          productId: item.id,
          images: [item.image],
          category: 'Sarees',
        })),
        shippingAddress: {
          id: '1',
          name: order.shippingAddress.name,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          address1: order.shippingAddress.address,
        },
        billingAddress: {
          id: '1',
          name: order.shippingAddress.name,
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          address1: order.shippingAddress.address,
        },
        createdAt: order.date,
        updatedAt: order.date,
      })));
      
      toast({
        title: "Error",
        description: "Failed to load orders. Showing demo data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (user?.email) {
      fetchOrders(selectedTab);
    }
  }, [isAuthenticated, router, user?.email, selectedTab]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
              <p className="text-gray-600">
                Track and manage your orders
                {pagination.total > 0 && (
                  <span className="ml-2">({pagination.total} total orders)</span>
                )}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => fetchOrders(selectedTab)}
              disabled={loading}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Order Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="mt-6">
            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <RefreshCw className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Loading your orders...
                  </h3>
                  <p className="text-gray-600">
                    Please wait while we fetch your order history.
                  </p>
                </CardContent>
              </Card>
            ) : error ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error loading orders
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {error}
                  </p>
                  <Button onClick={() => fetchOrders(selectedTab)}>
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : filteredOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {selectedTab === 'all' 
                      ? "You haven't placed any orders yet."
                      : `No ${selectedTab} orders found.`
                    }
                  </p>
                  <Button onClick={() => router.push('/products')}>
                    Start Shopping
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">Order {order.orderNumber || order.id}</CardTitle>
                          <CardDescription>
                            Placed on {order.date.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                            {order.paymentMethod && (
                              <span className="ml-4">Payment: {order.paymentMethod}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(order.status)}
                            <Badge className={getStatusColor(order.status)}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="text-lg font-semibold">
                            {formatCurrency(order.total)}
                          </div>
                          {order.paymentStatus && (
                            <div className="text-sm text-gray-500">
                              Payment: {order.paymentStatus}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              {item.images && item.images.length > 0 ? (
                                <img
                                  src={item.images[0]}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                                {item.size && <span className="ml-2">Size: {item.size}</span>}
                                {item.color && <span className="ml-2">Color: {item.color}</span>}
                              </div>
                              <div className="text-sm text-gray-500">
                                Category: {item.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatCurrency(item.price)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Total: {formatCurrency(item.price * item.quantity)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Details */}
                      <div className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Shipping Address</h5>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.name}<br />
                              {order.shippingAddress.address1 && (
                                <>
                                  {order.shippingAddress.address1}<br />
                                  {order.shippingAddress.address2 && (
                                    <>
                                      {order.shippingAddress.address2}<br />
                                    </>
                                  )}
                                </>
                              )}
                              {order.shippingAddress.houseNo && order.shippingAddress.streetName && (
                                <>
                                  {order.shippingAddress.houseNo}, {order.shippingAddress.streetName}<br />
                                  {order.shippingAddress.societyName && (
                                    <>
                                      {order.shippingAddress.societyName}<br />
                                    </>
                                  )}
                                  {order.shippingAddress.area && (
                                    <>
                                      {order.shippingAddress.area}<br />
                                    </>
                                  )}
                                </>
                              )}
                              {order.shippingAddress.city}, {order.shippingAddress.state}
                              {order.shippingAddress.zipCode && ` - ${order.shippingAddress.zipCode}`}
                              {order.shippingAddress.pincode && ` - ${order.shippingAddress.pincode}`}
                              <br />
                              {order.shippingAddress.country}
                              {order.shippingAddress.phone && (
                                <>
                                  <br />
                                  Phone: {order.shippingAddress.phone}
                                </>
                              )}
                            </p>
                          </div>
                          {(order.trackingNumber || order.razorpayOrderId) && (
                            <div>
                              <h5 className="font-medium mb-2">Order Information</h5>
                              <div className="text-sm text-gray-600 space-y-1">
                                {order.trackingNumber && (
                                  <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                                )}
                                {order.razorpayOrderId && (
                                  <p>Payment Order ID: <span className="font-mono text-xs">{order.razorpayOrderId}</span></p>
                                )}
                                {order.razorpayPaymentId && (
                                  <p>Payment ID: <span className="font-mono text-xs">{order.razorpayPaymentId}</span></p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div className="border-t pt-4 mt-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h5 className="font-medium mb-3">Order Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Subtotal</span>
                              <span>{formatCurrency(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax</span>
                              <span>{formatCurrency(order.tax)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping</span>
                              <span>{formatCurrency(order.shipping)}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                              <span>Total</span>
                              <span>{formatCurrency(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="border-t pt-4 mt-4">
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Invoice
                            </Button>
                          )}
                          {order.trackingNumber && (
                            <Button variant="outline" size="sm">
                              <Truck className="h-4 w-4 mr-2" />
                              Track Order
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <Button variant="outline" size="sm">
                              Write Review
                            </Button>
                          )}
                          {(order.status === 'processing' || order.status === 'shipped') && (
                            <Button variant="outline" size="sm">
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}