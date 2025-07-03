'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, StarOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAllProducts } from '@/lib/data';
import { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { API_ENDPOINTS } from '@/lib/constants';

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
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all products
        const products = await getAllProducts();
        setAllProducts(products);
        
        // Fetch trending products from API
        try {
          const response = await fetch('/api/trending');
          if (response.ok) {
            const trendingData = await response.json();
            setTrendingProducts(trendingData);
          } else {
            // If API doesn't exist yet, create trending products from featured products
            const featuredProducts = products.filter(p => p.featured).slice(0, 5);
            const initialTrending = featuredProducts.map((product, index) => ({
              id: `temp-${index + 1}`,
              productId: product.id,
              product: product,
              trending: true,
              order: index + 1,
              createdAt: new Date().toISOString(),
            }));
            setTrendingProducts(initialTrending);
          }
        } catch (error) {
          console.error("Failed to fetch trending products:", error);
          // Fallback to featured products
          const featuredProducts = products.filter(p => p.featured).slice(0, 5);
          const initialTrending = featuredProducts.map((product, index) => ({
            id: `temp-${index + 1}`,
            productId: product.id,
            product: product,
            trending: true,
            order: index + 1,
            createdAt: new Date().toISOString(),
          }));
          setTrendingProducts(initialTrending);
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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TrendingProduct | null>(null);
  const [formData, setFormData] = useState({
    productId: '',
    trending: true,
    order: 1,
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = allProducts.find(p => p.id === formData.productId);
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
        const updatedItem = {
          ...editingItem,
          ...formData,
          product: selectedProduct,
        };
        
        // Here you would typically make an API call to update the trending product
        // const response = await fetch(`/api/trending/${editingItem.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updatedItem),
        // });
        
        // For now, just update the local state
        setTrendingProducts(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        
        toast({
          title: "Success",
          description: "Trending product updated successfully",
        });
      } else {
        // Create new item
        const newItem: TrendingProduct = {
          id: Date.now().toString(),
          ...formData,
          product: selectedProduct,
          createdAt: new Date().toISOString(),
        };
        
        // Here you would typically make an API call to create a new trending product
        // const response = await fetch('/api/trending', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(newItem),
        // });
        
        // For now, just update the local state
        setTrendingProducts(prev => [...prev, newItem]);
        
        toast({
          title: "Success",
          description: "Trending product added successfully",
        });
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
        order: trendingProducts.length + 1,
      });
      setEditingItem(null);
      setIsDialogOpen(false);
    }
  };

  const handleEdit = (item: TrendingProduct) => {
    setEditingItem(item);
    setFormData({
      productId: item.productId,
      trending: item.trending,
      order: item.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product from trending?")) {
      return;
    }
    
    try {
      // Here you would typically make an API call to delete the trending product
      // await fetch(`/api/trending/${id}`, { method: 'DELETE' });
      
      // For now, just update the local state
      setTrendingProducts(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Product removed from trending",
      });
    } catch (error) {
      console.error("Failed to delete trending product:", error);
      toast({
        title: "Error",
        description: "Failed to remove product from trending",
        variant: "destructive",
      });
    }
  };

  const toggleTrending = async (id: string) => {
    try {
      const itemToToggle = trendingProducts.find(item => item.id === id);
      if (!itemToToggle) return;
      
      // Here you would typically make an API call to update the trending status
      // await fetch(`/api/trending/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ trending: !itemToToggle.trending }),
      // });
      
      // For now, just update the local state
      setTrendingProducts(prev => prev.map(item => 
        item.id === id ? { ...item, trending: !item.trending } : item
      ));
      
      toast({
        title: "Success",
        description: `Product ${itemToToggle.trending ? 'hidden from' : 'shown in'} trending section`,
      });
    } catch (error) {
      console.error("Failed to toggle trending status:", error);
      toast({
        title: "Error",
        description: "Failed to update trending status",
        variant: "destructive",
      });
    }
  };

  const availableProducts = allProducts.filter(product => 
    !trendingProducts.some(tp => tp.productId === product.id) || 
    (editingItem && editingItem.productId === product.id)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Trending Products</h1>
          <p className="text-gray-600">Manage products displayed in the trending section</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingItem(null);
              setFormData({
                productId: '',
                trending: true,
                order: trendingProducts.length + 1,
              });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit Trending Product' : 'Add Trending Product'}
              </DialogTitle>
              <DialogDescription>
                {editingItem ? 'Update trending product details' : 'Add a product to the trending section'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="productId">Product *</Label>
                <Select value={formData.productId} onValueChange={(value) => handleInputChange('productId', value)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {availableProducts.length === 0 ? (
                      <SelectItem value="no-products" disabled>No available products</SelectItem>
                    ) : (
                      availableProducts.map(product => (
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
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                    min="1"
                    className="bg-white"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="trending"
                    checked={formData.trending}
                    onCheckedChange={(checked) => handleInputChange('trending', checked)}
                  />
                  <Label htmlFor="trending">Show as Trending</Label>
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

      {/* Trending Products Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Trending Products ({trendingProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {trendingProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No trending products found. Add your first trending product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead className="hidden sm:table-cell">Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingProducts
                    .sort((a, b) => a.order - b.order)
                    .map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={item.product.images[0] || '/placeholder-product.png'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.product.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        ₹{item.product.price.toLocaleString()}
                        {item.product.comparePrice && (
                          <span className="text-gray-400 line-through ml-2">
                            ₹{item.product.comparePrice.toLocaleString()}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{item.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={item.trending ? "default" : "secondary"}
                            className={item.trending ? "bg-green-100 text-green-800" : ""}
                          >
                            {item.trending ? 'Visible' : 'Hidden'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleTrending(item.id)}
                            className="p-1"
                          >
                            {item.trending ? (
                              <StarOff className="h-4 w-4" />
                            ) : (
                              <Star className="h-4 w-4" />
                            )}
                          </Button>
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
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
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
    </div>
  );
}