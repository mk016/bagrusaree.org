import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all categories
export async function GET() {
  try {
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
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        featured: data.featured || false,
        order: data.order || 0,
        // subcategories are created separately or nested based on your UI/data structure
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error.message, error.stack, error);
    return NextResponse.json({ message: 'Failed to create category', error: error.message }, { status: 500 });
  }
} 