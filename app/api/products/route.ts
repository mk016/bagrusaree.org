import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products
export async function GET() {
  try {
    const products = await prisma.products.findMany();
    // Map imagesUrl to images for frontend compatibility
    const formattedProducts = products.map(product => ({
      ...product,
      images: product.imagesUrl || [], // Ensure images is always an array
      price: product.sellingPrice, // Map sellingPrice to price
      category: product.category, // Use the correct field name (category)
      status: product.isAvailable ? 'active' : 'draft', // Map isAvailable to status
      // sku: product.sku, // If SKU is still in Prisma, uncomment and map it
    }));
    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Error fetching products:', error.message, error.stack);
    return NextResponse.json({ message: 'Failed to fetch products', error: error.message }, { status: 500 });
  }
}

// POST a new product
export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Received data for new product:", data); // Log incoming data
    const product = await prisma.products.create({
      data: {
        name: data.name,
        description: data.description,
        sellingPrice: data.price, // Map price from frontend to sellingPrice for database
        imagesUrl: data.images || [], // Map images from frontend to imagesUrl for database, ensure array
        category: data.category, // Use correct field name (category)
        tags: data.tags || [],
        weight: data.weight || null,
        isAvailable: data.status === 'active', // Map status to isAvailable
        createdBy: data.createdBy || 'Admin',
        updatedOn: new Date(), // Set updatedOn explicitly for new creation
      },
    });
    // Format the returned product to match the frontend Product interface
    const formattedProduct = {
      ...product,
      images: product.imagesUrl,
      price: product.sellingPrice,
      category: product.category,
      status: product.isAvailable ? 'active' : 'draft',
      // sku: product.sku,
    };
    return NextResponse.json(formattedProduct, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error.message, error.stack, error); // More detailed logging
    return NextResponse.json({ message: 'Failed to create product', error: error.message }, { status: 500 });
  }
} 