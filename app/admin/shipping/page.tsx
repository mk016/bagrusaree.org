import { generateMockShippingMethods } from '@/lib/data';
import { ShippingMethod } from '@/lib/types';

export default function ShippingPage() {
  const shippingMethods: ShippingMethod[] = generateMockShippingMethods(5);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Shipping Methods Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Delivery</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
            </tr>
          </thead>
          <tbody>
            {shippingMethods.map((method) => (
              <tr key={method.id} className="border-b last:border-b-0">
                <td className="py-3 px-4 text-sm text-gray-800">{method.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{method.name}</td>
                <td className="py-3 px-4 text-sm text-gray-800">${method.cost.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{method.estimatedDelivery}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{method.active ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 