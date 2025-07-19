import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.products.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            category: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            subcategory: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ],
        isAvailable: true
      },
      take: 10,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
} 