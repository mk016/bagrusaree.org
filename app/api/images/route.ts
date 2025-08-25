import { NextRequest, NextResponse } from "next/server";
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

    // TODO: Fix authentication setup - currently bypassing for functionality
    let userId: string = "temp-user-debug-" + Date.now();
    
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