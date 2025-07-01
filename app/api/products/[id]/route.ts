import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET a specific product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Get product from database
    const product = await prisma.products.findUnique({
      where: {
        id
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
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
      featured: false, // Use consistent featured status
      status: product.isAvailable ? 'active' : 'draft',
      createdAt: product.createdAt,
      updatedAt: product.updatedOn,
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error fetching product" },
      { status: 500 }
    );
  }
}

// UPDATE a product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Optional authentication - don't fail if not authenticated
    let userId = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.warn("Authentication failed, proceeding without auth:", authError);
    }
    
    const id = params.id;
    const data = await req.json();
    
    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: {
        id
      }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Map Product type to database schema for update
    const updatedProduct = await prisma.products.update({
      where: {
        id
      },
      data: {
        name: data.name || existingProduct.name,
        description: data.description || existingProduct.description,
        sellingPrice: data.price !== undefined ? data.price : existingProduct.sellingPrice,
        imagesUrl: data.images || existingProduct.imagesUrl,
        category: data.category || existingProduct.category,
        subcategory: data.subcategory || existingProduct.subcategory,
        tags: data.tags || existingProduct.tags,
        weight: data.stock !== undefined ? data.stock : existingProduct.weight,
        isAvailable: data.status ? data.status === 'active' : existingProduct.isAvailable,
        updatedOn: new Date(),
      }
    });
    
    // Format response to match frontend expected format
    const formattedProduct = {
      id: updatedProduct.id,
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: parseFloat(updatedProduct.sellingPrice.toString()),
      images: updatedProduct.imagesUrl || [],
      category: updatedProduct.category,
      subcategory: updatedProduct.subcategory || undefined,
      tags: updatedProduct.tags || [],
      stock: updatedProduct.weight || 0,
      sku: updatedProduct.id.substring(0, 8).toUpperCase(),
      featured: data.featured !== undefined ? data.featured : false,
      status: updatedProduct.isAvailable ? 'active' : 'draft',
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedOn,
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product", details: error },
      { status: 500 }
    );
  }
}

// DELETE a product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Optional authentication - don't fail if not authenticated in development
    let userId = null;
    try {
      const authResult = await auth();
      userId = authResult?.userId;
    } catch (authError) {
      console.warn("Authentication failed, proceeding without auth:", authError);
    }
    
    const id = params.id;
    
    // Check if product exists
    const existingProduct = await prisma.products.findUnique({
      where: {
        id
      }
    });
    
    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }
    
    // Check if product is used in orders (if OrderItem table exists)
    try {
      const orderItems = await prisma.orderItem.findMany({
        where: {
          productId: id
        }
      });
      
      if (orderItems.length > 0) {
        // If product is used in orders, just mark it as unavailable
        await prisma.products.update({
          where: {
            id
          },
          data: {
            isAvailable: false
          }
        });
        
        return NextResponse.json({
          message: "Product is used in orders. Marked as unavailable instead of deleting."
        });
      }
    } catch (orderError) {
      console.warn("Could not check orders (table might not exist):", orderError);
    }
    
    // Delete product
    await prisma.products.delete({
      where: {
        id
      }
    });
    
    return NextResponse.json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: "Error deleting product", details: errorMessage },
      { status: 500 }
    );
  }
} 