import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "",
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
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