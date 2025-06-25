"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useAuthStore } from '@/lib/store';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        address: '',
      });
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser({
      name: formData.name,
      email: formData.email,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: '',
      address: '',
    });
    setIsEditing(false);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Summary */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant={isEditing ? "destructive" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full"
                  >
                    {isEditing ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Account Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              disabled={!isEditing}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              disabled={!isEditing}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              disabled={!isEditing}
                              className="pl-10"
                              placeholder="Enter phone number"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              disabled={!isEditing}
                              className="pl-10"
                              placeholder="Enter address"
                            />
                          </div>
                        </div>
                      </div>

                      {isEditing && (
                        <div className="flex space-x-4 pt-4">
                          <Button onClick={handleSave} className="flex-1">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button variant="outline" onClick={handleCancel} className="flex-1">
                            Cancel
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>
                        View your past orders and track current ones
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-4">
                          <User className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">
                          When you place your first order, it will appear here.
                        </p>
                        <Button onClick={() => router.push('/products')}>
                          Start Shopping
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>
                        Manage your account preferences and security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email notifications</p>
                              <p className="text-sm text-gray-600">Receive order updates via email</p>
                            </div>
                            <input
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Marketing emails</p>
                              <p className="text-sm text-gray-600">Receive promotional offers and updates</p>
                            </div>
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Security</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            Change Password
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            Two-Factor Authentication
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Actions</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            Download Account Data
                          </Button>
                          <Button variant="destructive" className="w-full justify-start">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}