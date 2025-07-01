"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import BannerGalleryUploader from "@/components/admin/banner-management/banner-gallery-uploader";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BannerGalleryPage() {
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    fileId: string;
    fileName: string;
  } | null>(null);

  const handleImageSelect = (url: string, fileId: string, fileName: string) => {
    setSelectedImage({ url, fileId, fileName });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/banners" className="flex items-center text-sm text-muted-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Banners
          </Link>
          <h1 className="text-2xl font-bold">Banner Gallery</h1>
          <p className="text-muted-foreground">
            Upload and manage banner images for your website
          </p>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <BannerGalleryUploader 
            onImageSelect={handleImageSelect}
            title="Upload Banner Images"
            maxImages={20}
          />
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-lg font-medium mb-4">Selected Image</h2>
              {selectedImage ? (
                <div className="space-y-4">
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.fileName}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">File Name</p>
                    <p className="text-sm text-muted-foreground break-all">{selectedImage.fileName}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">File ID</p>
                    <p className="text-sm text-muted-foreground break-all">{selectedImage.fileId}</p>
                  </div>
                  <div className="pt-2">
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedImage.url);
                      }}
                    >
                      Copy Image URL
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No image selected</p>
                  <p className="text-sm">Select an image from the gallery to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 