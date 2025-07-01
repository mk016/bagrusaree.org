"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { X, Upload, ImageIcon } from "lucide-react";

interface EnhancedImageUploadProps {
  onUploadSuccess: (imageUrl: string, fileId: string, fileName: string) => void;
  folder?: string;
  buttonText?: string;
  className?: string;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

export default function EnhancedImageUpload({
  onUploadSuccess,
  folder = "/banners",
  buttonText = "Upload Image",
  className = "",
  acceptedFileTypes = "image/*",
  maxSizeMB = 5,
}: EnhancedImageUploadProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef(new AbortController());
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const authenticator = async () => {
    try {
      const response = await fetch("/api/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return false;
    }

    // Check file type if specific types are required
    if (acceptedFileTypes !== "image/*") {
      const fileType = file.type;
      const acceptedTypes = acceptedFileTypes.split(",").map(type => type.trim());
      if (!acceptedTypes.some(type => fileType.match(type))) {
        setError(`File type not supported. Please upload ${acceptedFileTypes}`);
        return false;
      }
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setError(null);
    setProgress(0);
    setIsUploading(true);
    
    // Create new abort controller for this upload
    abortController.current = new AbortController();

    // Retrieve authentication parameters for the upload
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      setError("Failed to authenticate for upload");
      setIsUploading(false);
      return;
    }
    
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,
        folder: folder || "",
        // Progress callback to update upload progress state
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        // Abort signal to allow cancellation of the upload if needed
        abortSignal: abortController.current.signal,
      });
      
      // Call the callback with the upload response
      onUploadSuccess(
        uploadResponse.url || "",
        uploadResponse.fileId || "",
        uploadResponse.name || ""
      );
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK
      if (error instanceof ImageKitAbortError) {
        setError(`Upload aborted: ${error.reason}`);
      } else if (error instanceof ImageKitInvalidRequestError) {
        setError(`Invalid request: ${error.message}`);
      } else if (error instanceof ImageKitUploadNetworkError) {
        setError(`Network error: ${error.message}`);
      } else if (error instanceof ImageKitServerError) {
        setError(`Server error: ${error.message}`);
      } else {
        // Handle any other errors that may occur
        setError(`Upload error: ${(error as Error).message || "Unknown error"}`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const cancelUpload = () => {
    abortController.current.abort();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div
        ref={dropZoneRef}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging 
            ? "border-primary bg-primary/10" 
            : "border-gray-300 hover:border-primary hover:bg-gray-50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <>
              <Upload className="h-10 w-10 text-gray-400 animate-pulse" />
              <div className="space-y-2 w-full max-w-xs">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Uploading: {Math.round(progress)}%
                </p>
                <Button 
                  variant="outline" 
                  onClick={cancelUpload} 
                  type="button"
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel Upload
                </Button>
              </div>
            </>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  Drag and drop your image here, or
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: {acceptedFileTypes} (Max: {maxSizeMB}MB)
                </p>
              </div>
              <Button onClick={handleUploadClick} type="button">
                {buttonText}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                accept={acceptedFileTypes}
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
} 