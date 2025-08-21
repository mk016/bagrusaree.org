import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  try {
    // Read the data file
    const dataPath = path.join(process.cwd(), 'data', 'data.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const productsData = JSON.parse(rawData);

    console.log(`📦 Found ${productsData.length} products to seed`);

    // Create categories and subcategories first
    const categories = [
      {
        id: 'sarees',
        name: 'Sarees',
        slug: 'sarees',
        description: 'Traditional Indian sarees collection',
        image: '/assets/sarees/saree1.jpeg',
        featured: true,
        order: 1,
        subcategories: [
          { id: 'sarees-cotton', name: 'Cotton Sarees', slug: 'sarees-cotton', categoryId: 'sarees', order: 1 },
          { id: 'sarees-silk', name: 'Silk Sarees', slug: 'sarees-silk', categoryId: 'sarees', order: 2 },
          { id: 'sarees-chiffon', name: 'Chiffon Sarees', slug: 'sarees-chiffon', categoryId: 'sarees', order: 3 }
        ],
      },
      {
        id: 'suit',
        name: 'Suit Sets',
        slug: 'suit',
        description: 'Complete suit sets for every occasion',
        image: '/assets/suit/suit2.webp',
        featured: true,
        order: 2,
        subcategories: [
          { id: 'suit-cotton', name: 'Cotton Suits', slug: 'suit-cotton', categoryId: 'suit', order: 1 },
          { id: 'suit-silk', name: 'Silk Suits', slug: 'suit-silk', categoryId: 'suit', order: 2 },
          { id: 'suit-chiffon', name: 'Chiffon Suits', slug: 'suit-chiffon', categoryId: 'suit', order: 3 }
        ],
      },
      {
        id: 'dupattas',
        name: 'Dupattas',
        slug: 'dupattas',
        description: 'Beautiful dupattas and scarves',
        image: '/assets/chiffon_dupatta/dupatta1.webp',
        featured: false,
        order: 3,
        subcategories: [
          { id: 'dupattas-cotton', name: 'Cotton Dupattas', slug: 'dupattas-cotton', categoryId: 'dupattas', order: 1 },
          { id: 'dupattas-silk', name: 'Silk Dupattas', slug: 'dupattas-silk', categoryId: 'dupattas', order: 2 },
          { id: 'dupattas-chiffon', name: 'Chiffon Dupattas', slug: 'dupattas-chiffon', categoryId: 'dupattas', order: 3 }
        ],
      }
    ];

    // Create categories
    for (const category of categories) {
      const { subcategories, ...categoryData } = category;
      
      await prisma.category.upsert({
        where: { id: category.id },
        update: categoryData,
        create: categoryData,
      });

      console.log(`✅ Created/Updated category: ${category.name}`);

      // Create subcategories for this category
      for (const subcategory of subcategories) {
        await prisma.subcategory.upsert({
          where: { id: subcategory.id },
          update: subcategory,
          create: subcategory,
        });
        console.log(`  ✅ Created/Updated subcategory: ${subcategory.name}`);
      }
    }

    // Create products
    let createdCount = 0;
    let updatedCount = 0;

    for (const productData of productsData) {
      try {
        // Convert the data to match our schema
        const product = {
          name: productData.name,
          handle: productData.handle,
          description: productData.description || '',
          sellingPrice: Math.round(productData.price), // Round to integer
          comparePrice: productData.comparePrice ? Math.round(productData.comparePrice) : null, // Round to integer
          imagesUrl: productData.images || [],
          category: productData.category || 'sarees',
          subcategory: productData.subcategory || null,
          tags: productData.tags || [],
          stock: 10, // Default stock
          featured: false, // Default featured status
          status: 'active', // Default status
          sku: productData.handle, // Use handle as SKU
          isAvailable: true,
          createdBy: 'system', // Default created by
        };

        // Try to create the product, if it exists, update it
        const existingProduct = await prisma.products.findUnique({
          where: { handle: product.handle }
        });

        if (existingProduct) {
          await prisma.products.update({
            where: { handle: product.handle },
            data: product,
          });
          updatedCount++;
        } else {
          await prisma.products.create({
            data: product,
          });
          createdCount++;
        }

        if ((createdCount + updatedCount) % 50 === 0) {
          console.log(`📊 Progress: ${createdCount + updatedCount}/${productsData.length} products processed`);
        }

      } catch (error) {
        console.error(`❌ Error processing product ${productData.handle}:`, error);
      }
    }

    console.log(`🎉 Seeding completed!`);
    console.log(`✅ Created: ${createdCount} products`);
    console.log(`🔄 Updated: ${updatedCount} products`);
    console.log(`📊 Total processed: ${createdCount + updatedCount} products`);

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 