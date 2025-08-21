import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET a specific trending product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Since we don't have a trending_products table yet,
    // we'll just return a mock response
    const productId = id.startsWith('trending-') ? id.substring(9) : id;
    
    // Fetch the product to ensure it exists
    const product = await prisma.products.findUnique({
      where: {
        id: productId
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Trending product not found" },
        { status: 404 }
      );
    }
    
    const trendingProduct = {
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
      order: 1,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(trendingProduct);
  } catch (error) {
    console.error("Error fetching trending product:", error);
    return NextResponse.json(
      { error: "Error fetching trending product" },
      { status: 500 }
    );
  }
}

// UPDATE a trending product
export async function PUT(
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
    
    const id = params.id;
    const data = await req.json();
    
    // Since we don't have a trending_products table yet,
    // we'll just return a mock response with the updated data
    const productId = data.productId || id;
    
    // Fetch the product to ensure it exists
    const product = await prisma.products.findUnique({
      where: {
        id: productId
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    const updatedTrendingProduct = {
      id: id,
      productId: productId,
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
      trending: data.trending !== undefined ? data.trending : true,
      order: data.order || 1,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(updatedTrendingProduct);
  } catch (error) {
    console.error("Error updating trending product:", error);
    return NextResponse.json(
      { error: "Error updating trending product" },
      { status: 500 }
    );
  }
}

// PATCH a trending product (partial update)
export async function PATCH(
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
    
    const id = params.id;
    const data = await req.json();
    
    // Since we don't have a trending_products table yet,
    // we'll just return a mock response with the updated data
    const productId = id.startsWith('trending-') ? id.substring(9) : id;
    
    // Fetch the product to ensure it exists
    const product = await prisma.products.findUnique({
      where: {
        id: productId
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    const updatedTrendingProduct = {
      id: id,
      productId: productId,
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
      trending: data.trending !== undefined ? data.trending : true,
      order: data.order !== undefined ? data.order : 1,
      createdAt: new Date().toISOString()
    };
    
    return NextResponse.json(updatedTrendingProduct);
  } catch (error) {
    console.error("Error updating trending product:", error);
    return NextResponse.json(
      { error: "Error updating trending product" },
      { status: 500 }
    );
  }
}

// DELETE a trending product
export async function DELETE(
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
    
    // Since we don't have a trending_products table yet,
    // we'll just return a success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trending product:", error);
    return NextResponse.json(
      { error: "Error deleting trending product" },
      { status: 500 }
    );
  }
} 