import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

// Simple in-memory cache for better performance
const cache = new Map();
const CACHE_TTL = 60000; // 1 minute cache

// GET all products
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const featured = url.searchParams.get("featured") === "true";
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    
    // Create cache key
    const cacheKey = `products_${category || 'all'}_${featured}_${limit}_${offset}`;
    
    // Check cache first
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }
    
    // Build query based on parameters
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    // Get products from database with filters and pagination
    const products = await prisma.products.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      },
      take: Math.min(limit, 100), // Maximum 100 products per request
      skip: offset
    });
    
    // Map database fields to frontend expected fields
    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.sellingPrice.toString()),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : undefined,
      images: product.imagesUrl || [],
      category: product.category,
      subcategory: product.subcategory || undefined,
      tags: product.tags || [],
      stock: product.weight || 0,
      sku: product.id.substring(0, 8).toUpperCase(),
      featured: featured ? product.isAvailable : false, // Simple featured logic
      status: product.isAvailable ? 'active' : 'draft',
      createdAt: product.createdAt,
      updatedAt: product.updatedOn,
    }));
    
    // Cache the result
    cache.set(cacheKey, {
      data: formattedProducts,
      timestamp: Date.now()
    });
    
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
        comparePrice: data.comparePrice || null, // Map comparePrice field
        imagesUrl: data.images || [], // Map images to imagesUrl
        category: categoryValue,
        subcategory: data.subcategory || null,
        tags: data.tags || [],
        weight: data.stock || null, // Map stock to weight
        isAvailable: data.status === 'active', // Map status to isAvailable
        createdBy: "admin",
      }
    });

    // Clear cache when new product is added
    cache.clear();

    // Format response to match frontend expected format
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.sellingPrice.toString()),
      comparePrice: product.comparePrice ? parseFloat(product.comparePrice.toString()) : undefined,
      images: product.imagesUrl || [],
      category: product.category,
      subcategory: product.subcategory || undefined,
      tags: product.tags || [],
      stock: product.weight || 0,
      sku: product.id.substring(0, 8).toUpperCase(),
      featured: data.featured || false,
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