import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// GET all categories
export async function GET(req: NextRequest) {
  try {
    // Get categories from database
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true, // Include subcategories
      },
      orderBy: {
        order: 'asc', // Order by the 'order' field
      },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error.message, error.stack);
    return NextResponse.json({ message: 'Failed to fetch categories', error: error.message }, { status: 500 });
  }
}

// POST a new category
export async function POST(req: NextRequest) {
  try {
    // Make authentication optional to prevent blocking
    let userId = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.log('Authentication failed, proceeding without auth:', authError);
    }
    
    const data = await req.json();
    console.log('Received category data:', data);
    
    // Validate required fields
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: "Missing required fields: name and slug are required" },
        { status: 400 }
      );
    }

    // Check if category with same name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug: data.slug }
        ]
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: `Category with name "${data.name}" or slug "${data.slug}" already exists` },
        { status: 409 }
      );
    }
    
    // Create category
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        featured: data.featured || false,
        order: data.order || 0,
      },
    });

    console.log('Created category:', category);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error.message, error.stack, error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "A category with this name or slug already exists",
        details: error.meta 
      }, { status: 409 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: "Database connection failed",
        details: error.message 
      }, { status: 503 });
    }

    return NextResponse.json({ 
      error: 'Failed to create category', 
      message: error.message,
      code: error.code || 'UNKNOWN'
    }, { status: 500 });
  }
} 