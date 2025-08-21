'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { ProductForm } from '@/components/admin/product-management/product-form';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/lib/product-data';
import { getCategories } from '@/lib/data';
import { Product, Category } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function AdminProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products: " + err.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    } catch (err: any) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all-categories' ? '' : value);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value === 'all-status' ? '' : value);
  };

  const handleAddProductSuccess = async (newProduct: Product) => {
    setIsAddProductDialogOpen(false);
    await fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/admin/products/${product.id}/edit`);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm(`Are you sure you want to delete product with ID: ${id}?`)) {
      try {
        await deleteProduct(id);
        await fetchProducts();
      } catch (err: any) {
        console.error("Failed to delete product:", err);
        setError("Failed to delete product: " + err.message);
      }
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;
  }

  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesStatus = !selectedStatus || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'bg-red-100 text-red-800';
    if (stock < 10) return 'bg-orange-100 text-orange-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="w-full">
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:py-0 sm:h-16 gap-4 sm:gap-0">
                <div className="pt-12 sm:pt-0">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Products</h1>
                  <p className="text-sm text-gray-600">
                    Manage your product catalog
                  </p>
                </div>
                <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new product.
                      </DialogDescription>
                    </DialogHeader>
                    <ProductForm onProductSave={handleAddProductSuccess} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Select value={selectedCategory || 'all-categories'} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-categories">All Categories</SelectItem>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus || 'all-status'} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-full sm:w-32">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle>Products ({filteredProducts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-20">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                            {products.length === 0 ? 'No products available' : 'No products match your filters'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {product.images && product.images.length > 0 ? (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <ImageIcon className="h-6 w-6 text-gray-400" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                              <span className="capitalize">
                                {product.category}
                                {product.subcategory && (
                                  <span className="text-gray-500"> / {product.subcategory}</span>
                                )}
                              </span>
                            </TableCell>
                            <TableCell>{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStockColor(product.stock)}>
                                {product.stock}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditProduct(product)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
    </div>
  );
}