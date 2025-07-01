import { Category, Subcategory } from './types';

export function generateMockCategories(count: number): Category[] {
  const categories: Category[] = [];
  
  const categoryNames = [
    'Sarees', 'Suit Sets', 'Dress Material', 'Dupattas', 
    'Bedsheets', 'Men\'s Collection', 'Home Decor', 'Accessories'
  ];
  
  for (let i = 0; i < Math.min(count, categoryNames.length); i++) {
    const name = categoryNames[i];
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
    
    const subcategories: Subcategory[] = [];
    
    // Add 2-3 subcategories for each category
    for (let j = 0; j < 2 + Math.floor(Math.random() * 2); j++) {
      const subPrefix = ['Cotton', 'Silk', 'Designer', 'Printed', 'Embroidered'][j % 5];
      subcategories.push({
        id: `sub-${i}-${j}`,
        name: `${subPrefix} ${name}`,
        slug: `${subPrefix.toLowerCase()}-${slug}`,
        categoryId: `cat-${i}`,
        order: j,
      });
    }
    
    categories.push({
      id: `cat-${i}`,
      name,
      slug,
      description: `Collection of beautiful ${name.toLowerCase()}`,
      image: undefined,
      subcategories,
      featured: Math.random() > 0.7,
      order: i,
    });
  }
  
  return categories;
} 