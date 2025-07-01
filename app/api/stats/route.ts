import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route is not statically analyzed
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Count customers
    const customerCount = await prisma.customer.count();
    
    // Count orders
    const orderCount = await prisma.order.count();
    
    // Count products
    const productCount = await prisma.products.count();
    
    // Get average rating (mock data for now)
    const averageRating = 4.9;
    
    // Calculate years since founding (mock data)
    const foundingYear = 2014;
    const currentYear = new Date().getFullYear();
    const yearsOfTrust = currentYear - foundingYear;
    
    const stats = [
      { 
        id: "customers", 
        label: "Happy Customers", 
        value: customerCount > 1000 ? `${Math.floor(customerCount / 1000)}k+` : `${customerCount}+` 
      },
      { 
        id: "products", 
        label: "Products Sold", 
        value: orderCount > 1000 ? `${Math.floor(orderCount / 1000)}k+` : `${orderCount}+` 
      },
      { 
        id: "rating", 
        label: "Customer Rating", 
        value: `${averageRating}/5` 
      },
      { 
        id: "years", 
        label: "Years of Trust", 
        value: `${yearsOfTrust}+` 
      },
    ];
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
} 