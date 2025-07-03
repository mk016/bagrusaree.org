'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/data';
import { generateMockCategories } from '@/lib/mock-data';
import { Category, Subcategory } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
  order: number;
}

interface SubcategoryFormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  categoryId: string;
  order: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState<string>('');
  
  // Form states
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image: '',
    featured: false,
    order: 0
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState<SubcategoryFormData>({
    name: '',
    slug: '',
    description: '',
    image: '',
    categoryId: '',
    order: 0
  });

  const fetchCategories = async () => {
    try {
      // Try to fetch from API first
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
          return;
        }
      } catch (apiErr) {
        console.warn("API fetch failed, using mock data:", apiErr);
      }
      
      // Fall back to mock data if API fails or returns empty
      const mockData = generateMockCategories(8);
      setCategories(mockData);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError("Failed to load categories: " + err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  // Category CRUD functions
  const handleCreateCategory = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      toast.success('Category created successfully');
      setCategoryDialogOpen(false);
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryForm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      toast.success('Category updated successfully');
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Subcategory CRUD functions
  const handleCreateSubcategory = async () => {
    try {
      const response = await fetch(`/api/categories/${subcategoryForm.categoryId}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategoryForm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create subcategory');
      }

      toast.success('Subcategory created successfully');
      setSubcategoryDialogOpen(false);
      resetSubcategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleUpdateSubcategory = async () => {
    if (!editingSubcategory) return;

    try {
      const response = await fetch(`/api/subcategories/${editingSubcategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subcategoryForm)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update subcategory');
      }

      toast.success('Subcategory updated successfully');
      setSubcategoryDialogOpen(false);
      setEditingSubcategory(null);
      resetSubcategoryForm();
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    try {
      const response = await fetch(`/api/subcategories/${subcategoryId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete subcategory');
      }

      toast.success('Subcategory deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Form helpers
  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      featured: false,
      order: 0
    });
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      categoryId: '',
      order: 0
    });
  };

  const openEditCategoryDialog = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '',
      featured: category.featured,
      order: category.order
    });
    setCategoryDialogOpen(true);
  };

  const openEditSubcategoryDialog = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      slug: subcategory.slug,
      description: subcategory.description || '',
      image: subcategory.image || '',
      categoryId: subcategory.categoryId,
      order: subcategory.order
    });
    setSubcategoryDialogOpen(true);
  };

  const openAddCategoryDialog = () => {
    setEditingCategory(null);
    resetCategoryForm();
    setCategoryDialogOpen(true);
  };

  const openAddSubcategoryDialog = (categoryId?: string) => {
    setEditingSubcategory(null);
    resetSubcategoryForm();
    if (categoryId) {
      setSubcategoryForm(prev => ({ ...prev, categoryId }));
    }
    setSubcategoryDialogOpen(true);
  };

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <div className="flex gap-2">
          <Button onClick={openAddCategoryDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button variant="outline" onClick={() => openAddSubcategoryDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Subcategory
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No categories found</div>
        ) : (
          categories.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg shadow-sm bg-white">
              <Collapsible 
                open={expandedCategories.has(category.id)}
                onOpenChange={() => toggleCategoryExpansion(category.id)}
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                        {expandedCategories.has(category.id) ? 
                          <ChevronDown className="h-4 w-4" /> : 
                          <ChevronRight className="h-4 w-4" />
                        }
                      </Button>
                    </CollapsibleTrigger>
                    <div>
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                      {category.featured && (
                        <Badge variant="secondary" className="mt-1">Featured</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openAddSubcategoryDialog(category.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subcategory
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openEditCategoryDialog(category)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? This will also delete all subcategories. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <CollapsibleContent>
                  <div className="px-4 pb-4">
                    {category.description && (
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                    )}
                    
                    {category.subcategories && category.subcategories.length > 0 ? (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700">Subcategories:</h4>
                        <div className="grid gap-2">
                          {category.subcategories.map((subcategory) => (
                            <div key={subcategory.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div>
                                <span className="font-medium">{subcategory.name}</span>
                                <span className="text-sm text-gray-500 ml-2">({subcategory.slug})</span>
                                {subcategory.description && (
                                  <p className="text-sm text-gray-600 mt-1">{subcategory.description}</p>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => openEditSubcategoryDialog(subcategory)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Subcategory</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{subcategory.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No subcategories</p>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCategoryForm(prev => ({ 
                    ...prev, 
                    name,
                    slug: generateSlug(name)
                  }));
                }}
                placeholder="Category name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="category-slug"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Category description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-image">Image URL</Label>
              <Input
                id="category-image"
                value={categoryForm.image}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category-order">Order</Label>
              <Input
                id="category-order"
                type="number"
                value={categoryForm.order}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="category-featured"
                checked={categoryForm.featured}
                onCheckedChange={(checked) => setCategoryForm(prev => ({ ...prev, featured: !!checked }))}
              />
              <Label htmlFor="category-featured">Featured category</Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={setSubcategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="subcategory-category">Category</Label>
              <Select
                value={subcategoryForm.categoryId}
                onValueChange={(value) => setSubcategoryForm(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory-name">Name</Label>
              <Input
                id="subcategory-name"
                value={subcategoryForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setSubcategoryForm(prev => ({ 
                    ...prev, 
                    name,
                    slug: generateSlug(name)
                  }));
                }}
                placeholder="Subcategory name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory-slug">Slug</Label>
              <Input
                id="subcategory-slug"
                value={subcategoryForm.slug}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                placeholder="subcategory-slug"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory-description">Description</Label>
              <Textarea
                id="subcategory-description"
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Subcategory description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory-image">Image URL</Label>
              <Input
                id="subcategory-image"
                value={subcategoryForm.image}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, image: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subcategory-order">Order</Label>
              <Input
                id="subcategory-order"
                type="number"
                value={subcategoryForm.order}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSubcategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={editingSubcategory ? handleUpdateSubcategory : handleCreateSubcategory}>
              {editingSubcategory ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 