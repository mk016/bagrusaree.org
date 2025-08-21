'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Truck, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface ShippingMethod {
  id: string;
  name: string;
  cost: number;
  estimatedDelivery: string;
  active: boolean;
  description?: string;
  maxWeight?: number;
  zones?: string[];
}

export default function ShippingPage() {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState<Partial<ShippingMethod>>({
    name: '',
    cost: 0,
    estimatedDelivery: '',
    active: true,
    description: '',
    maxWeight: 10,
    zones: ['All India'],
  });

  // Load shipping methods on component mount
  useEffect(() => {
    loadShippingMethods();
  }, []);

  const loadShippingMethods = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would be an actual API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load from localStorage or use default methods
      const savedMethods = localStorage.getItem('shippingMethods');
      if (savedMethods) {
        setShippingMethods(JSON.parse(savedMethods));
      } else {
        // Default shipping methods
        const defaultMethods: ShippingMethod[] = [
          {
            id: '1',
            name: 'Standard Shipping',
            cost: 50,
            estimatedDelivery: '5-7 business days',
            active: true,
            description: 'Regular delivery service',
            maxWeight: 5,
            zones: ['All India'],
          },
          {
            id: '2',
            name: 'Express Shipping',
            cost: 150,
            estimatedDelivery: '2-3 business days',
            active: true,
            description: 'Fast delivery service',
            maxWeight: 3,
            zones: ['Metro Cities'],
          },
          {
            id: '3',
            name: 'Free Shipping',
            cost: 0,
            estimatedDelivery: '7-10 business days',
            active: true,
            description: 'Free delivery for orders above ₹999',
            maxWeight: 10,
            zones: ['All India'],
          },
        ];
        setShippingMethods(defaultMethods);
        localStorage.setItem('shippingMethods', JSON.stringify(defaultMethods));
      }
    } catch (error) {
      console.error('Error loading shipping methods:', error);
      toast.error('Failed to load shipping methods');
    } finally {
      setIsLoading(false);
    }
  };

  const saveShippingMethod = async () => {
    if (!formData.name || formData.cost === undefined || !formData.estimatedDelivery) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      let updatedMethods;
      
      if (editingMethod) {
        // Update existing method
        updatedMethods = shippingMethods.map(method =>
          method.id === editingMethod.id
            ? { ...method, ...formData }
            : method
        );
        toast.success('Shipping method updated successfully');
      } else {
        // Add new method
        const newMethod: ShippingMethod = {
          id: Date.now().toString(),
          name: formData.name!,
          cost: formData.cost!,
          estimatedDelivery: formData.estimatedDelivery!,
          active: formData.active ?? true,
          description: formData.description,
          maxWeight: formData.maxWeight,
          zones: formData.zones,
        };
        updatedMethods = [...shippingMethods, newMethod];
        toast.success('Shipping method added successfully');
      }

      setShippingMethods(updatedMethods);
      localStorage.setItem('shippingMethods', JSON.stringify(updatedMethods));
      
      // Reset form
      setEditingMethod(null);
      setIsAddingNew(false);
      setFormData({
        name: '',
        cost: 0,
        estimatedDelivery: '',
        active: true,
        description: '',
        maxWeight: 10,
        zones: ['All India'],
      });
    } catch (error) {
      console.error('Error saving shipping method:', error);
      toast.error('Failed to save shipping method');
    }
  };

  const deleteShippingMethod = async (id: string) => {
    try {
      const updatedMethods = shippingMethods.filter(method => method.id !== id);
      setShippingMethods(updatedMethods);
      localStorage.setItem('shippingMethods', JSON.stringify(updatedMethods));
      toast.success('Shipping method deleted successfully');
    } catch (error) {
      console.error('Error deleting shipping method:', error);
      toast.error('Failed to delete shipping method');
    }
  };

  const toggleMethodStatus = async (id: string) => {
    try {
      const updatedMethods = shippingMethods.map(method =>
        method.id === id ? { ...method, active: !method.active } : method
      );
      setShippingMethods(updatedMethods);
      localStorage.setItem('shippingMethods', JSON.stringify(updatedMethods));
      toast.success('Shipping method status updated');
    } catch (error) {
      console.error('Error updating method status:', error);
      toast.error('Failed to update method status');
    }
  };

  const startEdit = (method: ShippingMethod) => {
    setEditingMethod(method);
    setFormData({ ...method });
    setIsAddingNew(true);
  };

  const cancelEdit = () => {
    setEditingMethod(null);
    setIsAddingNew(false);
    setFormData({
      name: '',
      cost: 0,
      estimatedDelivery: '',
      active: true,
      description: '',
      maxWeight: 10,
      zones: ['All India'],
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shipping Management</h1>
          <p className="text-gray-600">Manage shipping methods and delivery options</p>
        </div>
        <Button onClick={() => setIsAddingNew(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Shipping Method</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Methods</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shippingMethods.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Methods</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shippingMethods.filter(m => m.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.round(shippingMethods.reduce((sum, m) => sum + m.cost, 0) / shippingMethods.length) || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipping Methods Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Methods</CardTitle>
          <CardDescription>
            Configure and manage your shipping options
          </CardDescription>
        </CardHeader>
        <CardContent>
      <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Method Name</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Delivery Time</TableHead>
                  <TableHead>Max Weight</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {shippingMethods.map((method) => (
                  <TableRow key={method.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        {method.description && (
                          <div className="text-sm text-gray-500">{method.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(method.cost, '₹')}</TableCell>
                    <TableCell>{method.estimatedDelivery}</TableCell>
                    <TableCell>{method.maxWeight}kg</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={method.active}
                          onCheckedChange={() => toggleMethodStatus(method.id)}
                        />
                        <Badge variant={method.active ? 'default' : 'secondary'}>
                          {method.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(method)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteShippingMethod(method.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingMethod ? 'Edit Shipping Method' : 'Add New Shipping Method'}
              </CardTitle>
              <CardDescription>
                Configure the shipping method details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Method Name *</label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Express Shipping"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cost (₹) *</label>
                  <Input
                    type="number"
                    value={formData.cost || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                    placeholder="0"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Estimated Delivery *</label>
                  <Input
                    value={formData.estimatedDelivery || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
                    placeholder="e.g., 2-3 business days"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Max Weight (kg)</label>
                  <Input
                    type="number"
                    value={formData.maxWeight || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxWeight: parseFloat(e.target.value) || 0 }))}
                    placeholder="10"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description for this shipping method"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active ?? true}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button onClick={saveShippingMethod} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {editingMethod ? 'Update Method' : 'Add Method'}
                </Button>
                <Button variant="outline" onClick={cancelEdit} className="flex-1">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
      </div>
      )}
    </div>
  );
} 