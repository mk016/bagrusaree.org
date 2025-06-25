'use client';

import { useState } from 'react';
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

interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
  createdAt: Date;
}

const mockBanners: Banner[] = [
  {
    id: '1',
    title: 'Summer Collection',
    description: 'Discover our latest summer collection with amazing discounts',
    image: '/assets/Banner/Banner1.webp',
    link: '/category/sarees',
    active: true,
    order: 1,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Wedding Special',
    description: 'Elegant wedding wear for your special day',
    image: '/assets/Banner/Banner2.webp',
    link: '/category/suit-sets',
    active: true,
    order: 2,
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Festive Offers',
    description: 'Celebrate festivals with our exclusive collection',
    image: '/assets/Banner/Banner3.webp',
    link: '/products',
    active: false,
    order: 3,
    createdAt: new Date('2024-01-05'),
  },
];

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    active: true,
    order: 1,
  });

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBanner) {
      // Update existing banner
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...formData }
          : banner
      ));
    } else {
      // Create new banner
      const newBanner: Banner = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
      };
      setBanners(prev => [...prev, newBanner]);
    }
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      active: true,
      order: 1,
    });
    setEditingBanner(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      image: banner.image,
      link: banner.link,
      active: banner.active,
      order: banner.order,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setBanners(prev => prev.filter(banner => banner.id !== id));
  };

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, active: !banner.active }
        : banner
    ));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Banner Management</h1>
          <p className="text-gray-600">Manage homepage banners and promotional content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingBanner(null);
              setFormData({
                title: '',
                description: '',
                image: '',
                link: '',
                active: true,
                order: banners.length + 1,
              });
            }}>
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
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="/assets/Banner/banner.webp"
                  required
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
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Banners Table */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>All Banners ({banners.length})</CardTitle>
        </CardHeader>
        <CardContent>
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
                        {banner.link}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={banner.active ? "default" : "secondary"}
                          className={banner.active ? "bg-green-100 text-green-800" : ""}
                        >
                          {banner.active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleActive(banner.id)}
                          className="p-1"
                        >
                          {banner.active ? (
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
        </CardContent>
      </Card>
    </div>
  );
}