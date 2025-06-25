"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, XCircle, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { useAuthStore } from '@/lib/store';

// Mock orders data
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
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

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

  const filteredOrders = mockOrders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your orders
          </p>
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
            {filteredOrders.length === 0 ? (
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
                          <CardTitle className="text-lg">Order {order.id}</CardTitle>
                          <CardDescription>
                            Placed on {order.date.toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
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
                            ₹{order.total.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Order Items */}
                      <div className="space-y-4 mb-6">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                ₹{item.price.toLocaleString()}
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
                              {order.shippingAddress.address}
                            </p>
                          </div>
                          {order.trackingNumber && (
                            <div>
                              <h5 className="font-medium mb-2">Tracking Information</h5>
                              <p className="text-sm text-gray-600">
                                Tracking Number: <span className="font-mono">{order.trackingNumber}</span>
                              </p>
                            </div>
                          )}
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