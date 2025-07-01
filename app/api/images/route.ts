import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// Initialize ImageKit only if environment variables are available
const initializeImageKit = () => {
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    return null;
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
};

export async function GET(req: NextRequest) {
  try {
    // Initialize ImageKit
    const imagekit = initializeImageKit();
    
    if (!imagekit) {
      return NextResponse.json(
        { error: "ImageKit not configured" },
        { status: 500 }
      );
    }

    // Handle auth during runtime only (skip during build)
    let userId: string | null = null;
    try {
      const authResult = await auth();
      userId = authResult.userId;
    } catch (error) {
      // During build time, auth might not be available
      // Return empty array or handle gracefully
      console.log("Auth not available during build time");
    }
    
    if (!userId && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url);
    const folder = url.searchParams.get("folder") || "";
    
    // Fetch images from ImageKit
    const images = await imagekit.listFiles({
      path: folder,
      sort: "ASC_CREATED",
    });
    
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { error: "Error fetching images" },
      { status: 500 }
    );
  }
} 