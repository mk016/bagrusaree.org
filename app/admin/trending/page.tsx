'use client';

import { useState } from 'react';
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

interface TrendingProduct {
  id: string;
  productId: string;
  product: any;
  trending: boolean;
  order: number;
  createdAt: Date;
}

export default function TrendingProductsPage() {
  const allProducts = getAllProducts();
  const [trendingProducts, setTrendingProducts] = useState<TrendingProduct[]>([
    {
      id: '1',
      productId: '1',
      product: allProducts[0],
      trending: true,
      order: 1,
      createdAt: new Date(),
    },
    {
      id: '2',
      productId: '2',
      product: allProducts[1],
      trending: true,
      order: 2,
      createdAt: new Date(),
    },
    {
      id: '3',
      productId: '5',
      product: allProducts[4],
      trending: true,
      order: 3,
      createdAt: new Date(),
    },
  ]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedProduct = allProducts.find(p => p.id === formData.productId);
    if (!selectedProduct) return;

    if (editingItem) {
      // Update existing item
      setTrendingProducts(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData, product: selectedProduct }
          : item
      ));
    } else {
      // Create new item
      const newItem: TrendingProduct = {
        id: Date.now().toString(),
        ...formData,
        product: selectedProduct,
        createdAt: new Date(),
      };
      setTrendingProducts(prev => [...prev, newItem]);
    }
    
    // Reset form
    setFormData({
      productId: '',
      trending: true,
      order: trendingProducts.length + 1,
    });
    setEditingItem(null);
    setIsDialogOpen(false);
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

  const handleDelete = (id: string) => {
    setTrendingProducts(prev => prev.filter(item => item.id !== id));
  };

  const toggleTrending = (id: string) => {
    setTrendingProducts(prev => prev.map(item => 
      item.id === id 
        ? { ...item, trending: !item.trending }
        : item
    ));
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
                    {availableProducts.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
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
                <Button type="submit">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden sm:table-cell">Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Order</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trendingProducts
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-gray-500">SKU: {item.product.sku}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell capitalize">
                      {item.product.category.replace('-', ' ')}
                    </TableCell>
                    <TableCell>
                      <div>₹{item.product.price.toLocaleString()}</div>
                      {item.product.comparePrice && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{item.product.comparePrice.toLocaleString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={item.trending ? "default" : "secondary"}
                          className={item.trending ? "bg-yellow-100 text-yellow-800" : ""}
                        >
                          {item.trending ? 'Trending' : 'Hidden'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleTrending(item.id)}
                          className="p-1"
                        >
                          {item.trending ? (
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{item.order}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
}