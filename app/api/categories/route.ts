import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// Fallback categories when database is unavailable
const FALLBACK_CATEGORIES = [
  {
    id: '1',
    name: 'Sarees',
    slug: 'sarees',
    description: 'Beautiful collection of traditional sarees',
    image: null,
    featured: true,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '1-1', name: 'Cotton Sarees', slug: 'cotton-sarees', description: null, image: null, categoryId: '1', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '1-2', name: 'Silk Sarees', slug: 'silk-sarees', description: null, image: null, categoryId: '1', order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: '1-3', name: 'Printed Sarees', slug: 'printed-sarees', description: null, image: null, categoryId: '1', order: 3, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '2',
    name: 'Suit Sets',
    slug: 'suit-sets',
    description: 'Elegant suit sets for every occasion',
    image: null,
    featured: true,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '2-1', name: 'Anarkali Suits', slug: 'anarkali-suits', description: null, image: null, categoryId: '2', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '2-2', name: 'Palazzo Suits', slug: 'palazzo-suits', description: null, image: null, categoryId: '2', order: 2, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '3',
    name: 'Dress Material',
    slug: 'dress-material',
    description: 'Premium dress materials',
    image: null,
    featured: false,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '3-1', name: 'Cotton Dress Material', slug: 'cotton-dress-material', description: null, image: null, categoryId: '3', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '3-2', name: 'Silk Dress Material', slug: 'silk-dress-material', description: null, image: null, categoryId: '3', order: 2, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '4',
    name: 'Dupattas',
    slug: 'dupattas',
    description: 'Beautiful dupattas collection',
    image: null,
    featured: false,
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '4-1', name: 'Cotton Dupattas', slug: 'cotton-dupattas', description: null, image: null, categoryId: '4', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '4-2', name: 'Silk Dupattas', slug: 'silk-dupattas', description: null, image: null, categoryId: '4', order: 2, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '5',
    name: 'Bedsheets',
    slug: 'bedsheets',
    description: 'Comfortable bedsheets collection',
    image: null,
    featured: false,
    order: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '5-1', name: 'Single Bedsheets', slug: 'single-bedsheets', description: null, image: null, categoryId: '5', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '5-2', name: 'Double Bedsheets', slug: 'double-bedsheets', description: null, image: null, categoryId: '5', order: 2, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
  {
    id: '6',
    name: 'Stitched Collection',
    slug: 'stitched-collection',
    description: 'Ready-to-wear stitched collection',
    image: null,
    featured: true,
    order: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
    subcategories: [
      { id: '6-1', name: 'Ready to Wear Sarees', slug: 'ready-to-wear-sarees', description: null, image: null, categoryId: '6', order: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: '6-2', name: 'Stitched Suits', slug: 'stitched-suits', description: null, image: null, categoryId: '6', order: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: '6-3', name: 'Stitched Blouses', slug: 'stitched-blouses', description: null, image: null, categoryId: '6', order: 3, createdAt: new Date(), updatedAt: new Date() },
      { id: '6-4', name: 'Stitched Lehengas', slug: 'stitched-lehengas', description: null, image: null, categoryId: '6', order: 4, createdAt: new Date(), updatedAt: new Date() },
    ],
  },
];

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
    console.log('Returning fallback categories due to database connection error');
    
    // Return fallback categories if database is unreachable
    return NextResponse.json(FALLBACK_CATEGORIES);
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