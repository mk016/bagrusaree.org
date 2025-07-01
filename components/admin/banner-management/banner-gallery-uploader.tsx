"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImagePlus, Upload, Trash2, X, Check } from "lucide-react";
import EnhancedImageUpload from "@/components/admin/enhanced-image-upload";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Image } from "@imagekit/next";

interface UploadedImage {
  url: string;
  fileId: string;
  fileName: string;
  selected: boolean;
}

interface BannerGalleryUploaderProps {
  onImageSelect: (imageUrl: string, fileId: string, fileName: string) => void;
  folder?: string;
  title?: string;
  maxImages?: number;
}

export default function BannerGalleryUploader({
  onImageSelect,
  folder = "/banners/gallery",
  title = "Banner Gallery",
  maxImages = 10,
}: BannerGalleryUploaderProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleImageUploadSuccess = (url: string, fileId: string, fileName: string) => {
    if (uploadedImages.length >= maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }
    
    setUploadedImages(prev => [
      ...prev,
      { url, fileId, fileName, selected: false }
    ]);
    setError(null);
  };

  const handleImageSelect = (index: number) => {
    const selectedImage = uploadedImages[index];
    onImageSelect(selectedImage.url, selectedImage.fileId, selectedImage.fileName);
    
    // Mark this image as selected and deselect others
    setUploadedImages(prev => 
      prev.map((img, i) => ({
        ...img,
        selected: i === index
      }))
    );
  };

  const handleImageRemove = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImagePlus className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EnhancedImageUpload
          onUploadSuccess={handleImageUploadSuccess}
          folder={folder}
          buttonText="Add to Gallery"
          maxSizeMB={5}
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {uploadedImages.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Uploaded Images ({uploadedImages.length})</h3>
            <ScrollArea className="h-64 w-full rounded-md border">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
                {uploadedImages.map((image, index) => (
                  <div 
                    key={image.fileId} 
                    className={`relative rounded-md overflow-hidden border-2 ${
                      image.selected ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <div className="aspect-square relative">
                      <Image
                        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
                        src={image.url.replace(process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "", "")}
                        alt={image.fileName}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleImageSelect(index)}
                          >
                            {image.selected ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleImageRemove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {image.selected && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                    <p className="text-xs truncate p-1">{image.fileName}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 