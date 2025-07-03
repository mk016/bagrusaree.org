'use client';

import { useEffect, useState } from 'react';
import { getOrders } from '@/lib/data';
import { Order } from '@/lib/types';
import AdminLayout from '@/app/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load orders:", err);
        setError("Failed to load orders: " + err.message);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
  
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
        <Card>
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Customer Email</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </tr>
                </thead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-3 px-4 text-sm text-gray-800 text-center">No orders found.</TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="py-3 px-4 text-sm text-gray-800">{order.id}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-800">{order.customer?.fullName || 'N/A'}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-800">{order.customer?.email || 'N/A'}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-800">₹{order.total.toFixed(2)}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-800 capitalize">{order.status}</TableCell>
                        <TableCell className="py-3 px-4 text-sm text-gray-800">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

  );
} 