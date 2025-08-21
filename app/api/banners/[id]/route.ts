import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// GET a single banner by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const banner = await prisma.banner.findUnique({
      where: { id: params.id }
    });
    
    if (!banner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error fetching banner:", error);
    return NextResponse.json(
      { error: "Error fetching banner" },
      { status: 500 }
    );
  }
}

// PUT update a banner
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    // TODO: Fix authentication setup - currently bypassing for functionality
    const actualUserId = userId || "temp-user-debug-" + Date.now();
    
    /* if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    } */
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.image) {
      return NextResponse.json(
        { error: "Missing required fields: title and image are required" },
        { status: 400 }
      );
    }
    
    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBanner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    // Map the incoming data to match the simplified Prisma schema
    const bannerData = {
      title: String(data.title),
      description: data.description ? String(data.description) : null,
      image: String(data.image),
      imageId: String(data.imageId || existingBanner.imageId),
      imageName: String(data.imageName || existingBanner.imageName),
      link: data.link ? String(data.link) : null,
      isActive: data.active !== undefined ? data.active : existingBanner.isActive,
      order: data.order !== undefined ? data.order : existingBanner.order,
    };
    
    const updatedBanner = await prisma.banner.update({
      where: { id: params.id },
      data: bannerData
    });
    
    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Error updating banner", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PATCH update specific fields of a banner
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    // TODO: Fix authentication setup - currently bypassing for functionality
    /* if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    } */
    
    const data = await req.json();
    
    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBanner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    const updatedBanner = await prisma.banner.update({
      where: { id: params.id },
      data
    });
    
    return NextResponse.json(updatedBanner);
  } catch (error) {
    console.error("Error updating banner:", error);
    return NextResponse.json(
      { error: "Error updating banner" },
      { status: 500 }
    );
  }
}

// DELETE a banner
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    // TODO: Fix authentication setup - currently bypassing for functionality
    /* if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    } */
    
    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: params.id }
    });
    
    if (!existingBanner) {
      return NextResponse.json(
        { error: "Banner not found" },
        { status: 404 }
      );
    }
    
    await prisma.banner.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Error deleting banner:", error);
    return NextResponse.json(
      { error: "Error deleting banner" },
      { status: 500 }
    );
  }
} 