'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Upload, X, Plus, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { API_ENDPOINTS } from '@/lib/constants';
import { addProduct, updateProduct } from '@/lib/product-data';
import { Product, ProductCategoryType, Category, Subcategory } from '@/lib/types';
import { toast } from 'sonner';

interface ProductFormProps {
  product?: Product;
  isEditing?: boolean;
  onProductSave: (product: Product) => void;
}

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
}

interface SubcategoryFormData {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  order: number;
}

export function ProductForm({ product, isEditing = false, onProductSave }: ProductFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Product>({
    id: product?.id || '',
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    comparePrice: product?.comparePrice || undefined,
    category: product?.category || 'uncategorized',
    subcategory: product?.subcategory || undefined,
    stock: product?.stock || 0,
    featured: product?.featured || false,
    status: product?.status || 'active',
    tags: product?.tags || [],
    seoTitle: product?.seoTitle || '',
    seoDescription: product?.seoDescription || '',
    createdAt: product?.createdAt || new Date(),
    updatedAt: product?.updatedAt || new Date(),
    images: product?.images || [],
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Default categories to ensure the form always has categories available
  const DEFAULT_CATEGORIES_FOR_FORM = [
    {
      id: '1',
      name: 'Sarees',
      slug: 'sarees',
      description: 'Traditional Indian sarees collection',
      image: '/assets/sarees/saree1.jpeg',
      featured: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '1-1', name: 'Cotton Sarees', slug: 'cotton-sarees', description: 'Comfortable cotton sarees', image: '', categoryId: '1', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '1-2', name: 'Silk Sarees', slug: 'silk-sarees', description: 'Luxurious silk sarees', image: '', categoryId: '1', order: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: '1-3', name: 'Printed Sarees', slug: 'printed-sarees', description: 'Beautiful printed sarees', image: '', categoryId: '1', order: 3, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: '2',
      name: 'Suit Sets',
      slug: 'suit-sets',
      description: 'Complete suit sets for every occasion',
      image: '/assets/suit/suit2.webp',
      featured: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '2-1', name: 'Anarkali Suits', slug: 'anarkali-suits', description: 'Elegant Anarkali suits', image: '', categoryId: '2', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '2-2', name: 'Palazzo Suits', slug: 'palazzo-suits', description: 'Comfortable palazzo suits', image: '', categoryId: '2', order: 2, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: '3',
      name: 'Dress Material',
      slug: 'dress-material',
      description: 'Unstitched dress materials',
      image: '/assets/chiffon_dupatta/dupatta1.webp',
      featured: false,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '3-1', name: 'Cotton Dress Material', slug: 'cotton-dress-material', description: 'Cotton fabric for dresses', image: '', categoryId: '3', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '3-2', name: 'Silk Dress Material', slug: 'silk-dress-material', description: 'Silk fabric for dresses', image: '', categoryId: '3', order: 2, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: '4',
      name: 'Dupattas',
      slug: 'dupattas',
      description: 'Beautiful dupattas and scarves',
      image: '/assets/chiffon_dupatta/dupatta2.webp',
      featured: false,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '4-1', name: 'Cotton Dupattas', slug: 'cotton-dupattas', description: 'Cotton dupattas', image: '', categoryId: '4', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '4-2', name: 'Silk Dupattas', slug: 'silk-dupattas', description: 'Silk dupattas', image: '', categoryId: '4', order: 2, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: '5',
      name: 'Bedsheets',
      slug: 'bedsheets',
      description: 'Comfortable bedsheets and home textiles',
      image: '/assets/Banner/Banner1.webp',
      featured: false,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '5-1', name: 'Single Bedsheets', slug: 'single-bedsheets', description: 'Single bed sheets', image: '', categoryId: '5', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '5-2', name: 'Double Bedsheets', slug: 'double-bedsheets', description: 'Double bed sheets', image: '', categoryId: '5', order: 2, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
    {
      id: '6',
      name: 'Stitched Collection',
      slug: 'stitched-collection',
      description: 'Ready-to-wear stitched garments',
      image: '/assets/suit/suit3.webp',
      featured: true,
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      subcategories: [
        { id: '6-1', name: 'Ready to Wear Sarees', slug: 'ready-to-wear-sarees', description: 'Pre-stitched sarees', image: '', categoryId: '6', order: 1, createdAt: new Date(), updatedAt: new Date() },
        { id: '6-2', name: 'Stitched Suits', slug: 'stitched-suits', description: 'Ready-to-wear suits', image: '', categoryId: '6', order: 2, createdAt: new Date(), updatedAt: new Date() },
        { id: '6-3', name: 'Stitched Blouses', slug: 'stitched-blouses', description: 'Ready-to-wear blouses', image: '', categoryId: '6', order: 3, createdAt: new Date(), updatedAt: new Date() },
        { id: '6-4', name: 'Stitched Lehengas', slug: 'stitched-lehengas', description: 'Ready-to-wear lehengas', image: '', categoryId: '6', order: 4, createdAt: new Date(), updatedAt: new Date() },
      ],
    },
  ];
  
  // New category dialog state
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
  });
  
  // New subcategory dialog state
  const [isNewSubcategoryDialogOpen, setIsNewSubcategoryDialogOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState<SubcategoryFormData>({
    name: '',
    slug: '',
    description: '',
    categoryId: '',
    order: 0,
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Start with default categories immediately
        setCategories(DEFAULT_CATEGORIES_FOR_FORM);
        
        // Try to fetch from API and update if successful
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            console.log('Loaded categories from API for product form:', data.length);
            setCategories(data);
          } else {
            console.log('API returned empty, using default categories for product form');
          }
        } else {
          console.log('API failed, using default categories for product form');
        }
      } catch (err) {
        console.log('Error fetching categories, using defaults:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (product && isEditing) {
      setFormData({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        category: product.category,
        subcategory: product.subcategory,
        stock: product.stock,
        featured: product.featured,
        status: product.status,
        tags: product.tags,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        images: product.images,
      });
      setImages(product.images);
    }
  }, [product, isEditing]);

  const handleInputChange = (field: keyof Product, value: any) => {
    if (field === 'price' || field === 'comparePrice' || field === 'stock') {
      setFormData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    } else if (field === 'featured') {
      setFormData(prev => ({ ...prev, [field]: !!value }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  };

  // Handle new category name change
  const handleNewCategoryNameChange = (value: string) => {
    setNewCategory({
      ...newCategory,
      name: value,
      slug: generateSlug(value),
    });
  };

  // Handle new subcategory name change
  const handleNewSubcategoryNameChange = (value: string) => {
    setNewSubcategory({
      ...newSubcategory,
      name: value,
      slug: generateSlug(value),
    });
  };

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.slug) {
      setError('Category name is required');
      return;
    }

    try {
      console.log('Sending category data:', newCategory);
      
      const response = await fetch(API_ENDPOINTS.CATEGORIES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      const result = await response.json();
      console.log('API response:', result);

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 409) {
          setError(`Category already exists: ${result.error}`);
          toast.error(`Category already exists: ${result.error}`);
        } else if (response.status === 400) {
          setError(`Invalid data: ${result.error}`);
          toast.error(`Invalid data: ${result.error}`);
        } else if (response.status === 503) {
          setError('Database connection failed. Please try again.');
          toast.error('Database connection failed. Please try again.');
        } else {
          setError(`Failed to add category: ${result.error || result.message}`);
          toast.error(`Failed to add category: ${result.error || result.message}`);
        }
        return;
      }

      const savedCategory = result;
      
      // Update categories list
      setCategories(prev => [...prev, savedCategory]);
      
      // Set the new category as selected
      handleInputChange('category', savedCategory.slug);
      
      // Close dialog and reset form
      setIsNewCategoryDialogOpen(false);
      setNewCategory({ name: '', slug: '', description: '' });
      
      toast.success('Category added successfully');
    } catch (error: any) {
      console.error('Category creation error:', error);
      setError(`Network error: ${error.message}`);
      toast.error(`Network error: ${error.message}`);
    }
  };

  // Add new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategory.name || !newSubcategory.slug || !newSubcategory.categoryId) {
      setError('Subcategory name and category are required');
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.CATEGORIES}/${newSubcategory.categoryId}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newSubcategory.name,
          slug: newSubcategory.slug,
          description: newSubcategory.description,
          order: newSubcategory.order,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add subcategory');
      }

      const savedSubcategory = await response.json();
      
      // Refresh categories to get updated subcategories
      await refreshCategories();
      
      // Set the new subcategory as selected
      handleInputChange('subcategory', savedSubcategory.slug);
      
      // Close dialog and reset form
      setIsNewSubcategoryDialogOpen(false);
      setNewSubcategory({ name: '', slug: '', description: '', categoryId: '', order: 0 });
      
      toast.success('Subcategory added successfully');
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to add subcategory: ' + error.message);
    }
  };

  // Refresh categories
  const refreshCategories = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.CATEGORIES);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          // Fallback to default categories if API returns empty
          setCategories(DEFAULT_CATEGORIES_FOR_FORM);
        }
      } else {
        // Fallback to default categories if API fails
        setCategories(DEFAULT_CATEGORIES_FOR_FORM);
      }
    } catch (err) {
      console.error('Error refreshing categories, using defaults:', err);
      setCategories(DEFAULT_CATEGORIES_FOR_FORM);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }

    if (formData.price <= 0) {
      setError('Price must be greater than 0');
      return;
    }

    try {
      const productData = { ...formData, images };

      let savedProduct: Product;
      if (isEditing && product?.id) {
        savedProduct = await updateProduct(productData);
        toast.success('Product updated successfully');
      } else {
        savedProduct = await addProduct(productData);
        toast.success('Product created successfully');
      }

      onProductSave(savedProduct);
    } catch (error: any) {
      setError(error.message);
      toast.error('Failed to save product: ' + error.message);
    }
  };

  const selectedCategory = categories.find(cat => cat.slug === formData.category);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-sm mb-4">Error: {error}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onProductSave(formData)}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Save className="h-4 w-4 mr-2" />
            Save Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Inventory</TabsTrigger>
          <TabsTrigger value="seo">SEO & Meta</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Basic details about your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product"
                    rows={4}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="category">Category *</Label>
                    <div className="flex space-x-2">
                      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add New
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-category-name">Category Name *</Label>
                              <Input
                                id="new-category-name"
                                value={newCategory.name}
                                onChange={(e) => handleNewCategoryNameChange(e.target.value)}
                                placeholder="e.g., Sarees, Suits"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-category-slug">Slug *</Label>
                              <Input
                                id="new-category-slug"
                                value={newCategory.slug}
                                onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                                placeholder="e.g., sarees, suits"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-category-description">Description</Label>
                              <Textarea
                                id="new-category-description"
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                placeholder="Brief description of this category"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsNewCategoryDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleAddCategory}>
                              Add Category
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleInputChange('category', value as ProductCategoryType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    {selectedCategory && (
                      <Dialog open={isNewSubcategoryDialogOpen} onOpenChange={setIsNewSubcategoryDialogOpen}>
                        <DialogTrigger asChild>
                          <Button type="button" variant="outline" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Add New
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Subcategory</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="subcategory-parent">Parent Category *</Label>
                              <Select 
                                value={newSubcategory.categoryId} 
                                onValueChange={(value) => setNewSubcategory({...newSubcategory, categoryId: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id}>
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-subcategory-name">Subcategory Name *</Label>
                              <Input
                                id="new-subcategory-name"
                                value={newSubcategory.name}
                                onChange={(e) => handleNewSubcategoryNameChange(e.target.value)}
                                placeholder="e.g., Cotton Sarees, Silk Sarees"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-subcategory-slug">Slug *</Label>
                              <Input
                                id="new-subcategory-slug"
                                value={newSubcategory.slug}
                                onChange={(e) => setNewSubcategory({...newSubcategory, slug: e.target.value})}
                                placeholder="e.g., cotton-sarees, silk-sarees"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-subcategory-description">Description</Label>
                              <Textarea
                                id="new-subcategory-description"
                                value={newSubcategory.description}
                                onChange={(e) => setNewSubcategory({...newSubcategory, description: e.target.value})}
                                placeholder="Brief description of this subcategory"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsNewSubcategoryDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="button" onClick={handleAddSubcategory}>
                              Add Subcategory
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <Select 
                    value={formData.subcategory || ''} 
                    onValueChange={(value) => handleInputChange('subcategory', value)}
                    disabled={!selectedCategory || !selectedCategory.subcategories?.length}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCategory?.subcategories?.map(subcategory => (
                        <SelectItem key={subcategory.id} value={subcategory.slug}>
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value as 'active' | 'draft' | 'archived')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Media</CardTitle>
              <CardDescription>
                Add images for your product
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="image-upload">Upload Images</Label>
                <Input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border">
                    <img src={image} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
              <CardDescription>
                Set price and manage stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="comparePrice">Compare at Price</Label>
                  <Input
                    id="comparePrice"
                    type="number"
                    value={formData.comparePrice ?? ''}
                    onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                    placeholder="Optional compare price"
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="Enter stock quantity"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO & Meta</CardTitle>
              <CardDescription>
                Optimize for search engines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  placeholder="Meta title for search engines"
                />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  value={formData.seoDescription}
                  onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                  placeholder="Meta description for search engines"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}