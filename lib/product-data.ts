import { Product, RawProductData, Category } from './types';

const rawData: RawProductData[] = require('../data/data.json');

export const getProductsFromRawData = (): Product[] => {
  return rawData.map((rawProduct, index) => {
    const id = (index + 1).toString(); // Simple ID generation
    const name = rawProduct.name;
    let description = rawProduct.description;
    
    // Replace "Bagru Art" with "BagruSarees"
    description = description.replace(/Bagru Art/g, 'BagruSarees');
    
    // Remove "COD Available"
    description = description.replace(/<br>\s*Free Delivery \| COD Available\s*<\/p>\s*<p><br><\/p>|<br>\s*Free Delivery \| COD Available\s*|Free Delivery \| COD Available/g, '');

    // Replace WhatsApp number
    description = description.replace(/WhatsApp : \+91-8005879984/g, 'WhatsApp : +91-76656 29448');

    // Replace email address
    description = description.replace(/Write to us : support@bagruart.com/g, 'Write to us : support@bagrusarees.org');

    const price = rawProduct.variants[0]?.price || 0;
    const comparePrice = rawProduct.max_price !== rawProduct.min_price ? rawProduct.max_price : undefined;
    const images = rawProduct.images.map(img => img.src);
    // Infer category from a part of the product name or handle if available, otherwise default to a general category.
    // This is a simplified approach. A more robust solution might involve a separate category mapping.
    let category = 'uncategorized';
    if (rawProduct.name.toLowerCase().includes('saree')) {
      category = 'sarees';
    } else if (rawProduct.name.toLowerCase().includes('suit')) {
      category = 'suit-sets';
    } else if (rawProduct.name.toLowerCase().includes('dress material')) {
      category = 'dress-material';
    } else if (rawProduct.name.toLowerCase().includes('dupatta')) {
      category = 'dupattas';
    } else if (rawProduct.name.toLowerCase().includes('bedsheet')) {
      category = 'bedsheets';
    } else if (rawProduct.name.toLowerCase().includes('bag')) {
      category = 'bags';
    } else if (rawProduct.name.toLowerCase().includes('men') || rawProduct.name.toLowerCase().includes('kurta')) {
      category = 'men\'s-collection';
    } else if (rawProduct.instore_product_type.toLowerCase().includes('home') || rawProduct.name.toLowerCase().includes('home')) {
        category = 'home';
    }

    const subcategory = rawProduct.instore_product_type || undefined;
    const tags: string[] = []; // Default to empty array as tags property is not in raw data
    const stock = 100; // Default stock, as it's not in raw data
    const sku = rawProduct.variants[0]?.sku || 'N/A';
    const featured = rawProduct.bestseller || false; // Using bestseller as featured
    const status = 'active' as const;
    const createdAt = new Date(rawProduct.created_at_site);
    const updatedAt = new Date(rawProduct.updated_at_site);

    return {
      id,
      name,
      description,
      price,
      comparePrice,
      images,
      category,
      subcategory,
      tags,
      stock,
      sku,
      featured,
      status,
      createdAt,
      updatedAt,
    };
  });
}; 