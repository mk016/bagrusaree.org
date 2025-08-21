'use client';

import { useState } from 'react';
import { Settings, Store, Palette, Bell, Shield, Database, Mail, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'BagruSarees',
    siteDescription: 'Authentic Indian Fashion Store',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    language: 'en',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderNotifications: true,
    lowStockAlerts: true,
    customerSignups: false,
    marketingEmails: false,
    systemUpdates: true,
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    codEnabled: true,
    freeShippingThreshold: 999,
    taxRate: 18,
  });

  const handleSaveSettings = async (settingsType: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${settingsType} settings saved successfully!`);
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your store settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-96">
          <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">Notifications</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">Payments</TabsTrigger>
          <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Store className="h-5 w-5" />
                  <span>Store Information</span>
                </CardTitle>
                <CardDescription>
                  Basic information about your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Store Name</label>
                  <Input
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Store Description</label>
                  <Input
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Currency</label>
                    <Input
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timezone</label>
                    <Input
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handleSaveSettings('General')}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Saving...' : 'Save General Settings'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Theme</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="light" name="theme" defaultChecked />
                      <label htmlFor="light" className="text-sm">Light Theme</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="dark" name="theme" />
                      <label htmlFor="dark" className="text-sm">Dark Theme</label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-gray-700">Primary Color</label>
                  <div className="mt-2 flex space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded border-2 border-indigo-600"></div>
                    <div className="w-8 h-8 bg-blue-600 rounded border-2 border-gray-300"></div>
                    <div className="w-8 h-8 bg-green-600 rounded border-2 border-gray-300"></div>
                    <div className="w-8 h-8 bg-purple-600 rounded border-2 border-gray-300"></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Preview Changes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Order Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified about new orders</p>
                  </div>
                  <Switch
                    checked={notificationSettings.orderNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-gray-500">Alert when products are running low</p>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, lowStockAlerts: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Customer Signups</h4>
                    <p className="text-sm text-gray-500">Notify about new customer registrations</p>
                  </div>
                  <Switch
                    checked={notificationSettings.customerSignups}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, customerSignups: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">System Updates</h4>
                    <p className="text-sm text-gray-500">Important system and security updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings(prev => ({ ...prev, systemUpdates: checked }))
                    }
                  />
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSettings('Notification')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Notification Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Payment Methods</span>
                </CardTitle>
                <CardDescription>
                  Configure available payment options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Razorpay</h4>
                    <p className="text-sm text-gray-500">Online payment gateway</p>
                  </div>
                  <Switch
                    checked={paymentSettings.razorpayEnabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({ ...prev, razorpayEnabled: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Cash on Delivery</h4>
                    <p className="text-sm text-gray-500">Pay on delivery option</p>
                  </div>
                  <Switch
                    checked={paymentSettings.codEnabled}
                    onCheckedChange={(checked) => 
                      setPaymentSettings(prev => ({ ...prev, codEnabled: checked }))
                    }
                  />
                </div>

                <Separator />

                <div>
                  <label className="text-sm font-medium text-gray-700">Free Shipping Threshold (₹)</label>
                  <Input
                    type="number"
                    value={paymentSettings.freeShippingThreshold}
                    onChange={(e) => setPaymentSettings(prev => ({ 
                      ...prev, 
                      freeShippingThreshold: parseInt(e.target.value) || 0 
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={paymentSettings.taxRate}
                    onChange={(e) => setPaymentSettings(prev => ({ 
                      ...prev, 
                      taxRate: parseInt(e.target.value) || 0 
                    }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Configuration</CardTitle>
                <CardDescription>
                  API keys and payment gateway settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Razorpay Key ID</label>
                  <Input
                    type="password"
                    placeholder="rzp_test_xxxxx"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Razorpay Secret</label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    className="mt-1"
                  />
                </div>
                <Button variant="outline" className="w-full">
                  Test Connection
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={() => handleSaveSettings('Payment')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage security and access control settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Session Timeout</h4>
                    <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Login Notifications</h4>
                    <p className="text-sm text-gray-500">Get notified of new logins</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Backup & Recovery</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Export Settings
                  </Button>
                </div>
              </div>

              <Button 
                onClick={() => handleSaveSettings('Security')}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Saving...' : 'Save Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}