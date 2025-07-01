import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET a single product by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const product = await prisma.products.findUnique({
      where: { id: id },
    });
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }
    // Map imagesUrl to images for frontend compatibility
    const formattedProduct = {
      ...product,
      images: product.imagesUrl || [], // Ensure images is always an array
      price: product.sellingPrice, // Map sellingPrice to price
      category: product.category, // Use the correct field name (category)
      status: product.isAvailable ? 'active' : 'draft', // Map isAvailable to status
      // sku: product.sku, // If SKU is still in Prisma, uncomment and map it
    };
    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error(`Error fetching product with ID ${params.id}:`, error.message, error.stack, error);
    return NextResponse.json({ message: 'Failed to fetch product', error: error.message }, { status: 500 });
  }
}

// PUT (update) a product by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await request.json();
    console.log(`Received data for updating product ${id}:`, data); // Log incoming data

    const updatedProduct = await prisma.products.update({
      where: { id: id },
      data: {
        name: data.name,
        description: data.description,
        sellingPrice: data.price, // Map price from frontend to sellingPrice for database
        imagesUrl: data.images || [], // Map images from frontend to imagesUrl for database, ensure array
        category: data.category, // Use the correct field name (category)
        tags: data.tags || [],
        weight: data.weight || null,
        isAvailable: data.status === 'active',
        updatedOn: new Date(), // Set updatedOn explicitly for update
      },
    });
    // Format the returned product to match the frontend Product interface
    const formattedProduct = {
      ...updatedProduct,
      images: updatedProduct.imagesUrl,
      price: updatedProduct.sellingPrice,
      category: updatedProduct.category, // Use the correct field name (category)
      status: updatedProduct.isAvailable ? 'active' : 'draft',
      // sku: updatedProduct.sku,
    };
    return NextResponse.json(formattedProduct);
  } catch (error: any) {
    console.error(`Error updating product with ID ${params.id}:`, error.message, error.stack, error);
    return NextResponse.json({ message: 'Failed to update product', error: error.message }, { status: 500 });
  }
}

// DELETE a product by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.products.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    console.error(`Error deleting product with ID ${params.id}:`, error.message, error.stack, error);
    return NextResponse.json({ message: 'Failed to delete product', error: error.message }, { status: 500 });
  }
} 