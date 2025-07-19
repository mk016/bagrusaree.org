'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EnhancedImageUpload from '@/components/admin/enhanced-image-upload';
import { useToast } from '@/hooks/use-toast';

interface Banner {
  id: string;
  title: string;
  description: string | null;
  image: string;
  imageId: string;
  imageName: string;
  link: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    imageId: '',
    imageName: '',
    link: '',
    active: true,
    order: 1,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setBanners(data);
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      toast({
        title: 'Error',
        description: 'Failed to load banners',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (imageUrl: string, fileId: string, fileName: string) => {
    handleInputChange('image', imageUrl);
    handleInputChange('imageId', fileId);
    handleInputChange('imageName', fileName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    
    // Prevent double submission
    if (isSubmitting) {
      console.log('Already submitting, ignoring...');
      return;
    }
    
    // Validate form data
    if (!formData.title.trim()) {
      console.log('Title is required');
      toast({
        title: 'Error',
        description: 'Banner title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.image.trim()) {
      console.log('Image is required');
      toast({
        title: 'Error',
        description: 'Banner image is required',
        variant: 'destructive',
      });
      return;
    }

    console.log('Form validation passed, submitting...');
    setIsSubmitting(true);

    try {
      const bannerData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        image: formData.image,
        imageId: formData.imageId,
        imageName: formData.imageName,
        link: formData.link.trim() || null,
        active: formData.active,
        order: formData.order,
      };

      console.log('Submitting banner data:', bannerData);

      if (editingBanner) {
        // Update existing banner
        const response = await fetch(`/api/banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        toast({
          title: 'Success',
          description: 'Banner updated successfully',
        });
      } else {
        // Create new banner
        const response = await fetch('/api/banners', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        toast({
          title: 'Success',
          description: 'Banner created successfully',
        });
      }
      
      // Refresh banners list
      await fetchBanners();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        image: '',
        imageId: '',
        imageName: '',
        link: '',
        active: true,
        order: 1,
      });
      setEditingBanner(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Error',
        description: `Failed to save banner: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      image: banner.image,
      imageId: banner.imageId,
      imageName: banner.imageName,
      link: banner.link || '',
      active: banner.isActive,
      order: banner.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      toast({
        title: 'Success',
        description: 'Banner deleted successfully',
      });

      await fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete banner',
        variant: 'destructive',
      });
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: !currentStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      await fetchBanners();
      toast({
        title: 'Success',
        description: `Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling banner status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update banner status',
        variant: 'destructive',
      });
    }
  };

  const openAddDialog = () => {
    console.log('Opening add dialog...');
    setEditingBanner(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      imageId: '',
      imageName: '',
      link: '',
      active: true,
      order: 1,
    });
    setIsDialogOpen(true);
    console.log('Dialog should be open now');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Banner Management</h1>
          <p className="text-gray-600">Manage homepage banners and promotional content</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a href="/admin/banners/gallery">
              <Upload className="h-4 w-4 mr-2" />
              Banner Gallery
            </a>
          </Button>
          
          {/* Add Banner Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </DialogTitle>
                <DialogDescription>
                  {editingBanner ? 'Update banner details' : 'Create a new banner for the homepage'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="content" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="image">Image</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="link">Link URL</Label>
                      <Input
                        id="link"
                        value={formData.link}
                        onChange={(e) => handleInputChange('link', e.target.value)}
                        placeholder="/category/sarees"
                        className="bg-white"
                      />
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
                          id="active"
                          checked={formData.active}
                          onCheckedChange={(checked) => handleInputChange('active', checked)}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="image" className="space-y-4">
                    <div>
                      <Label>Banner Image</Label>
                      <div className="mt-2">
                        {formData.image ? (
                          <div className="relative">
                            <img
                              src={formData.image}
                              alt="Banner"
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                handleInputChange('image', '');
                                handleInputChange('imageId', '');
                                handleInputChange('imageName', '');
                              }}
                            >
                              Change
                            </Button>
                          </div>
                        ) : (
                          <EnhancedImageUpload
                            onUploadSuccess={handleImageUpload}
                            folder="/banners"
                            buttonText="Upload Banner Image"
                            maxSizeMB={10}
                          />
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Banners Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {banners.length === 0 ? (
            <div className="text-center py-8">
              <p>No banners found. Create your first banner!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">Description</TableHead>
                    <TableHead className="hidden md:table-cell">Link</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {banners.map((banner) => (
                    <TableRow key={banner.id}>
                      <TableCell>
                        <div className="w-16 h-10 bg-gray-100 rounded overflow-hidden">
                          <img
                            src={banner.image}
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{banner.title}</TableCell>
                      <TableCell className="hidden sm:table-cell max-w-xs truncate">
                        {banner.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {banner.link || '—'}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={banner.isActive ? "default" : "secondary"}
                            className={banner.isActive ? "bg-green-100 text-green-800" : ""}
                          >
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(banner.id, banner.isActive)}
                            className="p-1"
                          >
                            {banner.isActive ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{banner.order}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
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