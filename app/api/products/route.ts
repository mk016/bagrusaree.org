import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// GET all products
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured") === "true";
    
    // Build query based on parameters
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    // Get products from database with filters
    const products = await prisma.products.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Map database fields to frontend expected fields
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.sellingPrice.toString()),
      images: product.imagesUrl || [],
      category: product.category,
      subcategory: product.subcategory || undefined,
      tags: product.tags || [],
      stock: product.weight || 0,
      sku: product.id.substring(0, 8).toUpperCase(),
      featured: featured ? true : Math.random() > 0.7, // Mock featured status if not specified
      status: product.isAvailable ? 'active' : 'draft',
      createdAt: product.createdAt,
      updatedAt: product.updatedOn,
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products" },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || data.price === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name and price are required" },
        { status: 400 }
      );
    }

    // Ensure category is a string
    const categoryValue = data.category && typeof data.category === 'string' ? data.category : "uncategorized";

    // Map Product type to database schema
    const product = await prisma.products.create({
      data: {
        name: data.name,
        description: data.description || "",
        sellingPrice: data.price, // Map price to sellingPrice
        imagesUrl: data.images || [], // Map images to imagesUrl
        category: categoryValue,
        subcategory: data.subcategory || null,
        tags: data.tags || [],
        weight: data.stock || null, // Map stock to weight
        isAvailable: data.status === 'active', // Map status to isAvailable
        createdBy: "admin",
      }
    });

    // Format response to match frontend expected format
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.sellingPrice.toString()),
      images: product.imagesUrl || [],
      category: product.category,
      subcategory: product.subcategory || undefined,
      tags: product.tags || [],
      stock: product.weight || 0,
      sku: product.id.substring(0, 8).toUpperCase(),
      featured: false,
      status: product.isAvailable ? 'active' : 'draft',
      createdAt: product.createdAt,
      updatedAt: product.updatedOn,
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error creating product", details: error },
      { status: 500 }
    );
  }
} 