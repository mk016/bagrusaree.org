import { generateMockUsers } from '@/lib/data';
import { User } from '@/lib/types';

export default function CustomersPage() {
  const customers: User[] = generateMockUsers(20);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Customers Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b last:border-b-0">
                <td className="py-3 px-4 text-sm text-gray-800">{customer.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{customer.name}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{customer.email}</td>
                <td className="py-3 px-4 text-sm text-gray-800 capitalize">{customer.role}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{new Date(customer.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 