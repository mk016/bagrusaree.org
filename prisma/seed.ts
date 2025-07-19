import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = [
    {
      name: 'Sarees',
      slug: 'sarees',
      description: 'Beautiful collection of traditional sarees',
      image: '/assets/sarees/saree1.jpeg',
      featured: true,
      order: 1,
      subcategories: [
        { name: 'Cotton Sarees', slug: 'cotton-sarees', description: 'Comfortable cotton sarees', order: 1 },
        { name: 'Silk Sarees', slug: 'silk-sarees', description: 'Luxurious silk sarees', order: 2 },
        { name: 'Printed Sarees', slug: 'printed-sarees', description: 'Beautiful printed sarees', order: 3 },
        { name: 'Designer Sarees', slug: 'designer-sarees', description: 'Exclusive designer sarees', order: 4 },
      ]
    },
    {
      name: 'Suit Sets',
      slug: 'suit-sets',
      description: 'Elegant suit sets for every occasion',
      image: '/assets/suit/suit2.webp',
      featured: true,
      order: 2,
      subcategories: [
        { name: 'Anarkali Suits', slug: 'anarkali-suits', description: 'Elegant Anarkali suits', order: 1 },
        { name: 'Palazzo Suits', slug: 'palazzo-suits', description: 'Comfortable palazzo suits', order: 2 },
        { name: 'Straight Cut Suits', slug: 'straight-cut-suits', description: 'Classic straight cut suits', order: 3 },
      ]
    },
    {
      name: 'Dress Material',
      slug: 'dress-material',
      description: 'Premium dress materials',
      image: '/assets/chiffon_dupatta/dupatta1.webp',
      featured: false,
      order: 3,
      subcategories: [
        { name: 'Cotton Dress Material', slug: 'cotton-dress-material', description: 'Cotton fabric for dresses', order: 1 },
        { name: 'Silk Dress Material', slug: 'silk-dress-material', description: 'Silk fabric for dresses', order: 2 },
        { name: 'Chiffon Dress Material', slug: 'chiffon-dress-material', description: 'Light chiffon fabric', order: 3 },
      ]
    },
    {
      name: 'Dupattas',
      slug: 'dupattas',
      description: 'Beautiful dupattas collection',
      image: '/assets/chiffon_dupatta/dupatta2.webp',
      featured: false,
      order: 4,
      subcategories: [
        { name: 'Cotton Dupattas', slug: 'cotton-dupattas', description: 'Cotton dupattas', order: 1 },
        { name: 'Silk Dupattas', slug: 'silk-dupattas', description: 'Silk dupattas', order: 2 },
        { name: 'Chiffon Dupattas', slug: 'chiffon-dupattas', description: 'Light chiffon dupattas', order: 3 },
      ]
    },
    {
      name: 'Bedsheets',
      slug: 'bedsheets',
      description: 'Comfortable bedsheets collection',
      image: '/assets/Banner/Banner1.webp',
      featured: false,
      order: 5,
      subcategories: [
        { name: 'Single Bedsheets', slug: 'single-bedsheets', description: 'Single bed sheets', order: 1 },
        { name: 'Double Bedsheets', slug: 'double-bedsheets', description: 'Double bed sheets', order: 2 },
        { name: 'King Size Bedsheets', slug: 'king-size-bedsheets', description: 'King size bed sheets', order: 3 },
      ]
    },
    {
      name: 'Stitched Collection',
      slug: 'stitched-collection',
      description: 'Ready-to-wear stitched collection',
      image: '/assets/suit/suit3.webp',
      featured: true,
      order: 6,
      subcategories: [
        { name: 'Ready to Wear Sarees', slug: 'ready-to-wear-sarees', description: 'Pre-stitched sarees', order: 1 },
        { name: 'Stitched Suits', slug: 'stitched-suits', description: 'Ready-to-wear suits', order: 2 },
        { name: 'Stitched Blouses', slug: 'stitched-blouses', description: 'Ready-to-wear blouses', order: 3 },
        { name: 'Stitched Lehengas', slug: 'stitched-lehengas', description: 'Ready-to-wear lehengas', order: 4 },
      ]
    },
  ];

  for (const categoryData of categories) {
    const { subcategories, ...categoryInfo } = categoryData;
    
    console.log(`Creating category: ${categoryInfo.name}`);
    
    const category = await prisma.category.create({
      data: categoryInfo,
    });

    console.log(`Created category with ID: ${category.id}`);

    // Create subcategories for this category
    for (const subcategoryData of subcategories) {
      console.log(`Creating subcategory: ${subcategoryData.name}`);
      
      await prisma.subcategory.create({
        data: {
          ...subcategoryData,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 