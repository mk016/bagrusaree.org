"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { X } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string, fileId: string, fileName: string) => void;
  folder?: string;
  buttonText?: string;
  className?: string;
}

export default function ImageUpload({
  onUploadSuccess,
  folder = "/banners",
  buttonText = "Upload Image",
  className = "",
}: ImageUploadProps) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortController = useRef(new AbortController());

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

  const handleUpload = async () => {
    // Reset states
    setError(null);
    setProgress(0);
    
    // Access the file input element using the ref
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setError("Please select a file to upload");
      return;
    }

    // Extract the first file from the file input
    const file = fileInput.files[0];
    
    // Create new abort controller for this upload
    abortController.current = new AbortController();

    // Retrieve authentication parameters for the upload
    let authParams;
    try {
      setIsUploading(true);
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
      if (fileInput) {
        fileInput.value = "";
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
      
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="max-w-xs"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <Button variant="outline" onClick={cancelUpload} type="button">
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
        ) : (
          <Button onClick={handleUpload} type="button">
            {buttonText}
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-muted-foreground">
            Uploading: {Math.round(progress)}%
          </p>
        </div>
      )}
    </div>
  );
} 