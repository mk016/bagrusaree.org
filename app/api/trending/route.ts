import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Mock trending products table since it doesn't exist in schema yet
const TRENDING_TABLE_NAME = "trending_products";

export async function GET(req: NextRequest) {
  try {
    // Get trending product IDs from URL params (for server-side storage simulation)
    const url = new URL(req.url);
    const trendingIds = url.searchParams.get('ids')?.split(',') || [];
    
    // If no specific trending IDs provided, return default trending products
    if (trendingIds.length === 0 || trendingIds[0] === '') {
      const products = await prisma.products.findMany({
        where: {
          isAvailable: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      });
      
      const trendingProducts = products.map((product, index) => ({
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
      }));
      
      return NextResponse.json(trendingProducts);
    }
    
    // Fetch specific products based on trending IDs
    const products = await prisma.products.findMany({
      where: {
        id: {
          in: trendingIds
        },
        isAvailable: true
      }
    });
    
    // Map products to trending format in the order specified
    const trendingProducts = trendingIds.map((id, index) => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      
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
    }).filter(Boolean);
    
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