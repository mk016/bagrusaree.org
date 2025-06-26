'use client';

import { useState } from 'react';
import { Calendar, Download, Filter, TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const salesData = [
  { month: 'Jan', sales: 65000, orders: 120, customers: 89 },
  { month: 'Feb', sales: 78000, orders: 145, customers: 102 },
  { month: 'Mar', sales: 92000, orders: 180, customers: 134 },
  { month: 'Apr', sales: 87000, orders: 165, customers: 121 },
  { month: 'May', sales: 105000, orders: 210, customers: 156 },
  { month: 'Jun', sales: 118000, orders: 235, customers: 178 },
];

const categoryData = [
  { name: 'Sarees', value: 35, color: '#3B82F6' },
  { name: 'Suit Sets', value: 28, color: '#10B981' },
  { name: 'Dress Material', value: 20, color: '#F59E0B' },
  { name: 'Fabrics', value: 12, color: '#EF4444' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

const customerBehaviorData = [
  { day: 'Mon', pageViews: 1200, sessions: 800, bounceRate: 45 },
  { day: 'Tue', pageViews: 1400, sessions: 950, bounceRate: 42 },
  { day: 'Wed', pageViews: 1600, sessions: 1100, bounceRate: 38 },
  { day: 'Thu', pageViews: 1800, sessions: 1250, bounceRate: 35 },
  { day: 'Fri', pageViews: 2200, sessions: 1500, bounceRate: 32 },
  { day: 'Sat', pageViews: 2800, sessions: 1800, bounceRate: 28 },
  { day: 'Sun', pageViews: 2400, sessions: 1600, bounceRate: 30 },
];

export function AdvancedAnalytics() {
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}`);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your store performance</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="sarees">Sarees</SelectItem>
              <SelectItem value="suits">Suit Sets</SelectItem>
              <SelectItem value="fabrics">Fabrics</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>

          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹5,45,000</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,055</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15.3%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+0.5%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="sales">Sales Trends</TabsTrigger>
          <TabsTrigger value="customers">Customer Behavior</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="geography">Geographic Data</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Revenue distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Orders vs Customers</CardTitle>
              <CardDescription>Comparison of orders and new customers</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Orders"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="New Customers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Behavior</CardTitle>
              <CardDescription>Weekly customer engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={customerBehaviorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pageViews" fill="#3B82F6" name="Page Views" />
                  <Bar dataKey="sessions" fill="#10B981" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Bounce Rate Trend</CardTitle>
                <CardDescription>Daily bounce rate percentage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={customerBehaviorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="bounceRate" 
                      stroke="#EF4444" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segments</CardTitle>
                <CardDescription>Customer distribution by value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">High Value (₹10k+)</span>
                    <span className="text-sm text-gray-600">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Medium Value (₹5k-10k)</span>
                    <span className="text-sm text-gray-600">35%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Low Value (₹0-5k)</span>
                    <span className="text-sm text-gray-600">50%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Products ranked by revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Elegant Silk Saree', revenue: 125000, orders: 45, trend: '+12%' },
                  { name: 'Designer Anarkali Suit', revenue: 98000, orders: 38, trend: '+8%' },
                  { name: 'Cotton Dress Material', revenue: 76000, orders: 52, trend: '+15%' },
                  { name: 'Georgette Palazzo Suit', revenue: 65000, orders: 29, trend: '+5%' },
                  { name: 'Chiffon Dupatta', revenue: 45000, orders: 67, trend: '+22%' },
                ].map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.orders} orders</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{product.revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>Geographic distribution of sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    { state: 'Maharashtra', sales: 145000, percentage: 28 },
                    { state: 'Gujarat', sales: 120000, percentage: 23 },
                    { state: 'Karnataka', sales: 98000, percentage: 19 },
                    { state: 'Tamil Nadu', sales: 76000, percentage: 15 },
                    { state: 'Delhi', sales: 65000, percentage: 12 },
                    { state: 'Others', sales: 16000, percentage: 3 },
                  ].map((region, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{region.state}</span>
                          <span className="text-sm text-gray-600">₹{region.sales.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${region.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                  <p className="text-gray-600">Interactive map would go here</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}