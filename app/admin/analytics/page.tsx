import { generateMockAnalytics } from '@/lib/data';
import { Analytics } from '@/lib/types';

export default function AnalyticsPage() {
  const analyticsData: Analytics = generateMockAnalytics();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Sales</h2>
          <p className="text-3xl font-bold text-indigo-600">${analyticsData.totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-indigo-600">{analyticsData.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Customers</h2>
          <p className="text-3xl font-bold text-indigo-600">{analyticsData.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Conversion Rate</h2>
          <p className="text-3xl font-bold text-indigo-600">{(analyticsData.conversionRate * 100).toFixed(2)}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Avg. Order Value</h2>
          <p className="text-3xl font-bold text-indigo-600">${analyticsData.avgOrderValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.recentOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{order.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{order.user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${order.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm text-gray-800 capitalize">{order.status}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Sales by Category</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.salesByCategory.map((data, index) => (
                <tr key={index} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{data.category}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">${data.sales.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 