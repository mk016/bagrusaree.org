"use client";

import { ImageKitProvider } from "@imagekit/next";

interface ImageKitAppProviderProps {
  children: React.ReactNode;
}

export function ImageKitAppProvider({ children }: ImageKitAppProviderProps) {
  return (
    <ImageKitProvider 
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
    >
      {children}
    </ImageKitProvider>
  );
} 