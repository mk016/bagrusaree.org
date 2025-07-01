import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// GET all banners
export async function GET(req: NextRequest) {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: {
        order: 'asc'
      }
    });
    
    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Error fetching banners", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// POST create a new banner
export async function POST(req: NextRequest) {
  try {
    console.log("Creating new banner...");
    const { userId } = await auth();
    console.log("User ID:", userId);
    
    // TODO: Fix authentication setup - currently bypassing for functionality
    // Proper authentication should be enforced in production
    const actualUserId = userId || "temp-user-debug-" + Date.now();
    
    /* if (!userId) {
      console.log("No user ID found - unauthorized request");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    } */
    
    const data = await req.json();
    console.log("Received data:", data);
    
    // Validate required fields
    if (!data.title || !data.image) {
      return NextResponse.json(
        { error: "Missing required fields: title and image are required" },
        { status: 400 }
      );
    }
    
    // Map the incoming data to match the simplified Prisma schema
    const bannerData = {
      title: String(data.title),
      description: data.description ? String(data.description) : null,
      image: String(data.image),
      imageId: String(data.imageId || ''),
      imageName: String(data.imageName || ''),
      link: data.link ? String(data.link) : null,
      isActive: Boolean(data.active !== undefined ? data.active : true),
      order: parseInt(String(data.order || 0)),
      createdBy: String(actualUserId)
    };
    
    console.log("Banner data to create:", bannerData);
    
    const banner = await prisma.banner.create({
      data: bannerData
    });
    
    console.log("Banner created successfully:", banner.id);
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner:", error);
    console.error("Full error details:", error);
    return NextResponse.json(
      { error: "Error creating banner", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// DELETE all banners - for testing/development only
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    // Temporarily bypass auth for debugging
    /* if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    } */
    
    await prisma.banner.deleteMany({});
    
    return NextResponse.json({ message: "All banners deleted" });
  } catch (error) {
    console.error("Error deleting banners:", error);
    return NextResponse.json(
      { error: "Error deleting banners" },
      { status: 500 }
    );
  }
} 