"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { ShoppingBag, Package, Truck, CheckCircle, User, Mail, Calendar } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <CartSidebar />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{user?.name || 'User'}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Link href="/orders" className="w-full">
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Order History
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user?.name || 'User'}!</CardTitle>
                <CardDescription>Here's an overview of your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">Member since</h3>
                        <p className="text-gray-600">January 2024</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-green-800">Account Status</div>
                      <div className="text-green-600">Active & Verified</div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Loyalty Points</div>
                      <div className="text-blue-600">1,250 points</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Your Orders</span>
                </CardTitle>
                <CardDescription>View and track your order history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Processing</div>
                    <div className="text-xs text-gray-500">Orders being prepared</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Shipped</div>
                    <div className="text-xs text-gray-500">On the way</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">Delivered</div>
                    <div className="text-xs text-gray-500">Successfully delivered</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <ShoppingBag className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm font-medium">All Orders</div>
                    <div className="text-xs text-gray-500">Complete history</div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Link href="/orders">
                    <Button className="w-full sm:w-auto">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      View All Orders
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}