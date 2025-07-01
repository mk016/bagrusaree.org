import { Product, RawProductData, Category, ProductCategoryType } from './types';

// Assuming Category is defined in lib/types.ts similar to:
// export type Category = 'sarees' | 'suit-sets' | 'dress-material' | 'dupattas' | 'bedsheets' | 'bags' | 'men\'s-collection' | 'home' | 'uncategorized';

const APPS_SCRIPT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyzfcQHrntS1JUaox-UnX-X1FSNxJogHDvnfarOWRH0IG0WlN8DQXzthYl54mWC1nmR/exec';

// Adjusted to return RawProductData[] directly
async function fetchRawGoogleSheetData(): Promise<RawProductData[]> {
  try {
    const response = await fetch(APPS_SCRIPT_WEB_APP_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result: RawProductData[] = await response.json(); // Expect array of objects directly
    return result;
  } catch (e: any) {
    console.error("Error fetching data from Google Sheet:", e);
    throw e;
  }
}

// Helper to map RawProductData (from sheet) to Product (for app)
function mapRawProductDataToProduct(rawProduct: RawProductData, index: number): Product {
  // Generate a unique ID if not available from the sheet data directly
  // Consider adding a unique ID column in your Google Sheet for more robust ID management.
  const id = rawProduct.instore_id ? rawProduct.instore_id.toString() : (index + 1).toString();

  const name = rawProduct.name;
  let description = rawProduct.description;

  // Apply transformations as before
  if (description) {
    description = description.replace(/Bagru Art/g, 'BagruSarees');
    description = description.replace(/<br>\s*Free Delivery \| COD Available\s*<\/p>\s*<p><br><\/p>|<br>\s*Free Delivery \| COD Available\s*|Free Delivery \| COD Available/g, '');
    description = description.replace(/WhatsApp : \+91-8005879984/g, 'WhatsApp : +91-76656 29448');
    description = description.replace(/Write to us : support@bagruart.com/g, 'Write to us : support@bagrusarees.org');
  }

  // Safely access price and SKU from variants array, providing defaults if variants or variant[0] is missing
  const price = (rawProduct.variants && rawProduct.variants.length > 0 && rawProduct.variants[0]?.price) ? rawProduct.variants[0].price : 0;
  const comparePrice = rawProduct.max_price !== rawProduct.min_price ? rawProduct.max_price : undefined;
  const images = (Array.isArray(rawProduct.images) ? rawProduct.images : []).map(img => img.src).filter(Boolean); // Ensure images is an array before mapping
  let category: ProductCategoryType = 'uncategorized';

  // Categorization logic, using name and instore_product_type
  const productNameLower = name ? name.toLowerCase() : '';
  const productTypeLower = rawProduct.instore_product_type ? rawProduct.instore_product_type.toLowerCase() : '';

  if (productNameLower.includes('saree')) {
    category = 'sarees';
  } else if (productNameLower.includes('suit')) {
    category = 'suit-sets';
  } else if (productNameLower.includes('dress material')) {
    category = 'dress-material';
  } else if (productNameLower.includes('dupatta')) {
    category = 'dupattas';
  } else if (productNameLower.includes('bedsheet')) {
    category = 'bedsheets';
  } else if (productNameLower.includes('bag')) {
    category = 'bags';
  } else if (productNameLower.includes('men') || productNameLower.includes('kurta')) {
    category = 'men\'s-collection';
  } else if (productTypeLower.includes('home') || productNameLower.includes('home')) {
      category = 'home';
  }

  const subcategory = rawProduct.instore_product_type || undefined;
  const tags: string[] = []; // Default to empty array as tags property is not in raw data
  const stock = 100; // Default stock, as it\'s not in raw data
  const sku = (rawProduct.variants && rawProduct.variants.length > 0 && rawProduct.variants[0]?.sku) ? rawProduct.variants[0].sku : 'N/A';
  const featured = rawProduct.bestseller || false;
  const status = 'active' as const;
  const createdAt = rawProduct.created_at_site ? new Date(rawProduct.created_at_site) : new Date();
  const updatedAt = rawProduct.updated_at_site ? new Date(rawProduct.updated_at_site) : new Date();

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
}

// Renamed and made async: This will now be the primary function to get products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products: Product[] = await response.json();
    console.log("Fetched products from API:", products);
    return products;
  } catch (e: any) {
    console.error("Error fetching products:", e);
    throw e;
  }
};

// Add new product
export const addProduct = async (product: Product): Promise<Product> => {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newProduct: Product = await response.json();
    console.log('Product added successfully:', newProduct);
    return newProduct;
  } catch (e: any) {
    console.error('Error adding product:', e);
    throw e;
  }
};

// Update existing product
export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    if (!product.id) {
      throw new Error('Product ID is required for updating.');
    }
    const response = await fetch(`/api/products/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedProduct: Product = await response.json();
    console.log('Product updated successfully:', updatedProduct);
    return updatedProduct;
  } catch (e: any) {
    console.error('Error updating product:', e);
    throw e;
  }
};

// Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // No content expected for successful delete
    console.log('Product deleted successfully');
  } catch (e: any) {
    console.error('Error deleting product:', e);
    throw e;
  }
}; 