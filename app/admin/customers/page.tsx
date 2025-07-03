'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { API_ENDPOINTS } from '@/lib/constants';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers data');
      }
    };

    fetchCustomers();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Customers Management</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Customers Management</h1>
      {customers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-10 rounded text-center">
          <p className="text-lg">No customers found</p>
        </div>
      ) : (
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
                  <td className="py-3 px-4 text-sm text-gray-800">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 