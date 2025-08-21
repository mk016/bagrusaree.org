import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST a new subcategory to a specific category
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const categoryId = params.id;
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if slug is unique
    const existingSubcategory = await prisma.subcategory.findUnique({
      where: { slug: data.slug }
    });
    
    if (existingSubcategory) {
      return NextResponse.json(
        { error: "Subcategory with this slug already exists" },
        { status: 400 }
      );
    }
    
    // Create subcategory
    const subcategory = await prisma.subcategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        categoryId: categoryId,
        order: data.order || 0,
      },
    });
    
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error: any) {
    console.error('Error creating subcategory:', error.message, error.stack);
    return NextResponse.json(
      { message: 'Failed to create subcategory', error: error.message },
      { status: 500 }
    );
  }
} 