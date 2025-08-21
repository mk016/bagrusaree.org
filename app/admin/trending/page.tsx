'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProducts } from '@/lib/product-data';
import { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TrendingProduct {
  id: string;
  productId: string;
  product: Product;
  trending: boolean;
  order: number;
  createdAt: string;
}

export default function TrendingProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrendingProduct | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    trending: true,
    order: 1
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const products = await getProducts();
        setAllProducts(products);
        
        // Load trending products from localStorage
        const savedTrending = localStorage.getItem('admin-trending-products');
        if (savedTrending) {
          try {
            const trendingIds = JSON.parse(savedTrending);
            const trendingData = trendingIds.map((item: any, index: number) => {
              const product = products.find((p: Product) => p.id === item.productId);
              if (product) {
                return {
                  id: `trending-${product.id}`,
                  productId: product.id,
                  product: product,
                  trending: true,
                  order: item.order || index + 1,
                  createdAt: item.createdAt || new Date().toISOString(),
                };
              }
              return null;
            }).filter(Boolean);
            setTrendingProducts(trendingData);
          } catch (error) {
            console.error('Error parsing saved trending products:', error);
            // Fallback to featured products
            const featuredProducts = products.filter((p: Product) => p.featured).slice(0, 5);
            const initialTrending = featuredProducts.map((product: Product, index: number) => ({
              id: `trending-${product.id}`,
              productId: product.id,
              product: product,
              trending: true,
              order: index + 1,
              createdAt: new Date().toISOString(),
            }));
            setTrendingProducts(initialTrending);
            saveTrendingToStorage(initialTrending);
          }
        } else {
          // Create initial trending products from featured products
          const featuredProducts = products.filter((p: Product) => p.featured).slice(0, 5);
          const initialTrending = featuredProducts.map((product: Product, index: number) => ({
            id: `trending-${product.id}`,
            productId: product.id,
            product: product,
            trending: true,
            order: index + 1,
            createdAt: new Date().toISOString(),
          }));
          setTrendingProducts(initialTrending);
          saveTrendingToStorage(initialTrending);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [toast]);

  // Helper function to save trending products to localStorage
  const saveTrendingToStorage = (trending: TrendingProduct[]) => {
    const trendingData = trending.map((item: TrendingProduct) => ({
      productId: item.productId,
      order: item.order,
      createdAt: item.createdAt
    }));
    localStorage.setItem('admin-trending-products', JSON.stringify(trendingData));
  };

  // Add new trending product
  const handleAddTrending = () => {
    if (!formData.productId) {
      toast({
        title: "Error",
        description: "Please select a product.",
        variant: "destructive",
      });
      return;
    }

    const product = allProducts.find((p: Product) => p.id === formData.productId);
    if (!product) {
      toast({
        title: "Error",
        description: "Selected product not found.",
        variant: "destructive",
      });
      return;
    }

    const newTrending: TrendingProduct = {
      id: `trending-${product.id}`,
      productId: product.id,
      product: product,
      trending: formData.trending,
      order: formData.order,
      createdAt: new Date().toISOString(),
    };

    const updatedTrending = [...trendingProducts, newTrending]
      .sort((a: TrendingProduct, b: TrendingProduct) => a.order - b.order);
    
    setTrendingProducts(updatedTrending);
    saveTrendingToStorage(updatedTrending);
    
    // Reset form
    setFormData({ productId: '', trending: true, order: 1 });
    setIsDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Product added to trending section.",
    });
  };

  // Remove trending product
  const handleRemoveTrending = (id: string) => {
    const updatedTrending = trendingProducts.filter((item: TrendingProduct) => item.id !== id);
    setTrendingProducts(updatedTrending);
    saveTrendingToStorage(updatedTrending);
    
    toast({
      title: "Success",
      description: "Product removed from trending section.",
    });
  };

  // Toggle trending status
  const handleToggleTrending = (id: string) => {
    const updatedTrending = trendingProducts.map((item: TrendingProduct) =>
      item.id === id ? { ...item, trending: !item.trending } : item
    );
    setTrendingProducts(updatedTrending);
    saveTrendingToStorage(updatedTrending);
    
    toast({
      title: "Success",
      description: "Trending status updated.",
    });
  };

  // Update order
  const handleUpdateOrder = (id: string, newOrder: number) => {
    const updatedTrending = trendingProducts.map((item: TrendingProduct) =>
      item.id === id ? { ...item, order: newOrder } : item
    ).sort((a: TrendingProduct, b: TrendingProduct) => a.order - b.order);
    
    setTrendingProducts(updatedTrending);
    saveTrendingToStorage(updatedTrending);
    
    toast({
      title: "Success",
      description: "Order updated.",
    });
  };

  // Handle editing a trending product
  const handleEdit = (item: TrendingProduct) => {
    setEditingItem(item);
    setFormData({
      productId: item.productId,
      trending: item.trending,
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  // Helper function to handle input changes
  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle form submission for add/edit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productId) {
      toast({
        title: "Error",
        description: "Please select a product.",
        variant: "destructive",
      });
      return;
    }

    const selectedProduct = allProducts.find((p: Product) => p.id === formData.productId);
    if (!selectedProduct) {
      toast({
        title: "Error",
        description: "Selected product not found",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingItem) {
        // Update existing item
        const updatedTrending = trendingProducts.map((item: TrendingProduct) =>
          item.id === editingItem.id ? { ...item, ...formData, product: selectedProduct } : item
        ).sort((a: TrendingProduct, b: TrendingProduct) => a.order - b.order);
        
        setTrendingProducts(updatedTrending);
        saveTrendingToStorage(updatedTrending);
        
        toast({
          title: "Success",
          description: "Trending product updated successfully",
        });
      } else {
        // Use handleAddTrending for new items
        handleAddTrending();
        return;
      }
    } catch (error) {
      console.error("Failed to save trending product:", error);
      toast({
        title: "Error",
        description: "Failed to save trending product",
        variant: "destructive",
      });
    } finally {
      // Reset form
      setFormData({
        productId: '',
        trending: true,
        order: 1,
      });
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  // Get available products (not already in trending, except when editing)
  const availableProducts = allProducts.filter((product: Product) => 
    !trendingProducts.some((tp: TrendingProduct) => tp.productId === product.id) || 
    (editingItem && editingItem.productId === product.id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trending Products</h1>
          <p className="text-gray-600">Manage trending products that appear on the home page</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2" onClick={() => {
              setEditingItem(null);
              setFormData({
                productId: '',
                trending: true,
                order: trendingProducts.length + 1,
              });
            }}>
              <Plus className="h-4 w-4" />
              <span>Add Trending Product</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Trending Product' : 'Add Trending Product'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update trending product details' : 'Select a product to add to the trending section on the home page'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productId">Product *</Label>
                <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts.length === 0 ? (
                      <SelectItem value="no-products" disabled>No available products</SelectItem>
                    ) : (
                      availableProducts.map((product: Product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trending"
                    checked={formData.trending}
                    onCheckedChange={(checked) => handleInputChange('trending', checked)}
                  />
                  <Label htmlFor="trending">Active</Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.productId}>
                  {editingItem ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Trending Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Trending Products ({trendingProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {trendingProducts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No trending products selected yet.</p>
              <p className="text-sm">Add products to showcase them on the home page trending section.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingProducts
                    .sort((a: TrendingProduct, b: TrendingProduct) => a.order - b.order)
                    .map((item: TrendingProduct) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.order}
                            onChange={(e) => handleUpdateOrder(item.id, parseInt(e.target.value) || 1)}
                            className="w-16"
                            min="1"
                            max="10"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            {item.product.images && item.product.images[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <div className="font-medium">{item.product.name}</div>
                              <div className="text-sm text-gray-500">ID: {item.product.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{item.product.category}</TableCell>
                        <TableCell>₹{item.product.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={item.trending}
                              onCheckedChange={() => handleToggleTrending(item.id)}
                            />
                            <Badge variant={item.trending ? 'default' : 'secondary'}>
                              {item.trending ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveTrending(item.id)}
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
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>How it works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• Products selected here will appear in the "Trending Products" section on the home page</p>
            <p>• Use the order field to control the sequence in which products appear</p>
            <p>• Toggle the status to activate/deactivate products without removing them</p>
            <p>• Only the first 4 trending products will be displayed on the home page</p>
            <p>• Changes are saved automatically and will reflect immediately on the website</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}