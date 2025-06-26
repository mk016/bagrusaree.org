'use client';

import { useState } from 'react';
import { Save, Upload, Eye, Calendar, Link as LinkIcon, Type, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BannerEditorProps {
  banner?: any;
  isEditing?: boolean;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export function BannerEditor({ banner, isEditing = false, onSave, onCancel }: BannerEditorProps) {
  const [formData, setFormData] = useState({
    title: banner?.title || '',
    description: banner?.description || '',
    link: banner?.link || '',
    active: banner?.active ?? true,
    order: banner?.order || 1,
    startDate: banner?.startDate || '',
    endDate: banner?.endDate || '',
    textPosition: banner?.textPosition || 'center',
    textColor: banner?.textColor || '#ffffff',
    overlayOpacity: banner?.overlayOpacity || 0.3,
  });

  const [desktopImage, setDesktopImage] = useState(banner?.desktopImage || '');
  const [mobileImage, setMobileImage] = useState(banner?.mobileImage || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (type: 'desktop' | 'mobile') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          if (type === 'desktop') {
            setDesktopImage(e.target.result as string);
          } else {
            setMobileImage(e.target.result as string);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bannerData = {
        ...formData,
        desktopImage,
        mobileImage,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave?.(bannerData);
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Banner' : 'Create New Banner'}
          </h1>
          <p className="text-gray-600">
            Design and configure your banner for the homepage
          </p>
        </div>
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Banner'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="space-y-6">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="h-5 w-5 mr-2" />
                    Banner Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Banner title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Banner description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="link">Link URL</Label>
                    <Input
                      id="link"
                      value={formData.link}
                      onChange={(e) => handleInputChange('link', e.target.value)}
                      placeholder="/category/sarees"
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Desktop Image</Label>
                    <div className="mt-2">
                      {desktopImage ? (
                        <div className="relative">
                          <img
                            src={desktopImage}
                            alt="Desktop banner"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setDesktopImage('')}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">Upload Desktop Image</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload('desktop')}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Mobile Image</Label>
                    <div className="mt-2">
                      {mobileImage ? (
                        <div className="relative">
                          <img
                            src={mobileImage}
                            alt="Mobile banner"
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setMobileImage('')}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <Upload className="w-8 h-8 mb-2 text-gray-500" />
                          <p className="text-sm text-gray-500">Upload Mobile Image</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload('mobile')}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="textPosition">Text Position</Label>
                      <Select value={formData.textPosition} onValueChange={(value) => handleInputChange('textPosition', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="textColor">Text Color</Label>
                      <Input
                        id="textColor"
                        type="color"
                        value={formData.textColor}
                        onChange={(e) => handleInputChange('textColor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="overlayOpacity">Overlay Opacity: {Math.round(formData.overlayOpacity * 100)}%</Label>
                    <input
                      type="range"
                      id="overlayOpacity"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.overlayOpacity}
                      onChange={(e) => handleInputChange('overlayOpacity', parseFloat(e.target.value))}
                      className="w-full mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Preview */}
                <div>
                  <Label className="text-sm font-medium">Desktop</Label>
                  <div className="relative mt-2 bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {desktopImage && (
                      <img
                        src={desktopImage}
                        alt="Desktop preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div 
                      className="absolute inset-0 bg-black"
                      style={{ opacity: formData.overlayOpacity }}
                    />
                    <div className={`absolute inset-0 flex items-center ${
                      formData.textPosition === 'left' ? 'justify-start pl-8' :
                      formData.textPosition === 'right' ? 'justify-end pr-8' :
                      'justify-center'
                    }`}>
                      <div className="text-center">
                        {formData.title && (
                          <h2 
                            className="text-2xl font-bold mb-2"
                            style={{ color: formData.textColor }}
                          >
                            {formData.title}
                          </h2>
                        )}
                        {formData.description && (
                          <p 
                            className="text-lg"
                            style={{ color: formData.textColor }}
                          >
                            {formData.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <Label className="text-sm font-medium">Mobile</Label>
                  <div className="relative mt-2 bg-gray-100 rounded-lg overflow-hidden mx-auto" style={{ width: '200px', aspectRatio: '9/16' }}>
                    {mobileImage && (
                      <img
                        src={mobileImage}
                        alt="Mobile preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div 
                      className="absolute inset-0 bg-black"
                      style={{ opacity: formData.overlayOpacity }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <div className="text-center">
                        {formData.title && (
                          <h2 
                            className="text-lg font-bold mb-2"
                            style={{ color: formData.textColor }}
                          >
                            {formData.title}
                          </h2>
                        )}
                        {formData.description && (
                          <p 
                            className="text-sm"
                            style={{ color: formData.textColor }}
                          >
                            {formData.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}