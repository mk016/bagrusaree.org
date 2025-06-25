import { generateMockOrders, generateMockUsers, getAllProducts } from '@/lib/data';
import { Order } from '@/lib/types';

export default function OrdersPage() {
  const users = generateMockUsers(10);
  const products = getAllProducts();
  const orders: Order[] = generateMockOrders(20, users, products);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
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
            {orders.map((order) => (
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
  );
} 