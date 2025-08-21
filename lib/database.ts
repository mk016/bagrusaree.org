import { PrismaClient } from '@prisma/client';
import { Product, Category, Subcategory } from './types';

const prisma = new PrismaClient();

// Convert database product to Product interface
function convertDbProductToProduct(dbProduct: any): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    price: Number(dbProduct.sellingPrice),
    comparePrice: dbProduct.comparePrice ? Number(dbProduct.comparePrice) : undefined,
    images: dbProduct.imagesUrl,
    category: dbProduct.category as any,
    subcategory: dbProduct.subcategory,
    tags: dbProduct.tags,
    stock: dbProduct.stock,
    sku: dbProduct.sku,
    featured: dbProduct.featured,
    status: dbProduct.status as 'active' | 'draft' | 'archived',
    createdAt: dbProduct.createdAt,
    updatedAt: dbProduct.updatedOn,
  };
}

// Convert database category to Category interface
function convertDbCategoryToCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    image: dbCategory.image,
    subcategories: dbCategory.subcategories?.map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      description: sub.description,
      image: sub.image,
      categoryId: sub.categoryId,
      order: sub.order,
    })) || [],
    featured: dbCategory.featured,
    order: dbCategory.order,
  };
}

// Get all products from database
export async function getAllProducts(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        isAvailable: true,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error fetching products from database:', error);
    return [];
  }
}

// Get product by ID from database
export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const dbProduct = await prisma.products.findFirst({
      where: {
        OR: [
          { id },
          { handle: id },
        ],
        isAvailable: true,
        status: 'active',
      },
    });

    return dbProduct ? convertDbProductToProduct(dbProduct) : undefined;
  } catch (error) {
    console.error('Error fetching product by ID from database:', error);
    return undefined;
  }
}

// Get products by category from database
export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        category,
        isAvailable: true,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error fetching products by category from database:', error);
    return [];
  }
}

// Get products by subcategory from database
export async function getProductsBySubcategory(category: string, subcategory: string): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        category,
        subcategory,
        isAvailable: true,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error fetching products by subcategory from database:', error);
    return [];
  }
}

// Get all categories from database
export async function getCategories(): Promise<Category[]> {
  try {
    const dbCategories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return dbCategories.map(convertDbCategoryToCategory);
  } catch (error) {
    console.error('Error fetching categories from database:', error);
    return [];
  }
}

// Get category by slug from database
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  try {
    const dbCategory = await prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return dbCategory ? convertDbCategoryToCategory(dbCategory) : undefined;
  } catch (error) {
    console.error('Error fetching category by slug from database:', error);
    return undefined;
  }
}

// Get subcategory by slug from database
export async function getSubcategoryBySlug(slug: string): Promise<Subcategory | undefined> {
  try {
    const dbSubcategory = await prisma.subcategory.findUnique({
      where: { slug },
    });

    return dbSubcategory ? {
      id: dbSubcategory.id,
      name: dbSubcategory.name,
      slug: dbSubcategory.slug,
      description: dbSubcategory.description || undefined,
      image: dbSubcategory.image || undefined,
      categoryId: dbSubcategory.categoryId,
      order: dbSubcategory.order,
    } : undefined;
  } catch (error) {
    console.error('Error fetching subcategory by slug from database:', error);
    return undefined;
  }
}

// Search products from database
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
        isAvailable: true,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error searching products from database:', error);
    return [];
  }
}

// Get featured products from database
export async function getFeaturedProducts(limit: number = 8): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        featured: true,
        isAvailable: true,
        status: 'active',
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error fetching featured products from database:', error);
    return [];
  }
}

// Get products with low stock from database
export async function getLowStockProducts(threshold: number = 10): Promise<Product[]> {
  try {
    const dbProducts = await prisma.products.findMany({
      where: {
        AND: [
          {
            stock: {
              lte: threshold,
            },
          },
          {
            stock: {
              gt: 0,
            },
          },
        ],
        isAvailable: true,
        status: 'active',
      },
      orderBy: {
        stock: 'asc',
      },
    });

    return dbProducts.map(convertDbProductToProduct);
  } catch (error) {
    console.error('Error fetching low stock products from database:', error);
    return [];
  }
}

export default prisma; 