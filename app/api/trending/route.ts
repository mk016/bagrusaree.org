import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Mock trending products table since it doesn't exist in schema yet
const TRENDING_TABLE_NAME = "trending_products";

export async function GET(req: NextRequest) {
  try {
    // Since we don't have a trending_products table yet,
    // we'll fetch products and mock the trending status
    const products = await prisma.products.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 10 // Limit to 10 products
    });
    
    // Map to trending products format
    const trendingProducts = products.slice(0, 5).map((product, index) => {
      return {
        id: `trending-${product.id}`,
        productId: product.id,
        product: {
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
          featured: true,
          status: product.isAvailable ? 'active' : 'draft',
        },
        trending: true,
        order: index + 1,
        createdAt: new Date().toISOString()
      };
    });
    
    return NextResponse.json(trendingProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    return NextResponse.json(
      { error: "Error fetching trending products" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Fetch the product to ensure it exists
    const product = await prisma.products.findUnique({
      where: {
        id: data.productId
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Since we don't have a trending_products table yet,
    // we'll just return a mock response
    const trendingProduct = {
      id: `trending-${Date.now()}`,
      productId: data.productId,
      product: {
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
        featured: true,
        status: product.isAvailable ? 'active' : 'draft',
      },
      trending: data.trending !== false,
      order: data.order || 1,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(trendingProduct);
  } catch (error) {
    console.error("Error creating trending product:", error);
    return NextResponse.json(
      { error: "Error creating trending product" },
      { status: 500 }
    );
  }
} 