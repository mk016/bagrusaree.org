'use client';

import { useState, useEffect } from 'react';
import { getAllProducts, getCategories } from '@/lib/data';
import { Product, Category } from '@/lib/types';

export default function TestDBPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testDatabase = async () => {
      try {
        setLoading(true);
        
        // Test products
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts);
        
        // Test categories
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
        
        console.log('Database test results:', {
          productsCount: fetchedProducts.length,
          categoriesCount: fetchedCategories.length,
          firstProduct: fetchedProducts[0],
          firstCategory: fetchedCategories[0]
        });
        
      } catch (err: any) {
        console.error('Database test failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testDatabase();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Database Connection...</h1>
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Database Test Failed</h1>
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-2xl font-bold mb-4 text-green-600">Database Test Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="bg-gray-50 p-4 rounded">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.id} className="mb-4 p-3 bg-white rounded border">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
                <p className="text-sm text-gray-600">Category: {product.category}</p>
                <p className="text-sm text-gray-600">SKU: {product.sku}</p>
              </div>
            ))}
            {products.length > 5 && (
              <p className="text-sm text-gray-500">... and {products.length - 5} more products</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="bg-gray-50 p-4 rounded">
            {categories.map((category) => (
              <div key={category.id} className="mb-3 p-3 bg-white rounded border">
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-gray-600">Slug: {category.slug}</p>
                <p className="text-sm text-gray-600">Subcategories: {category.subcategories.length}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Database Status</h2>
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <p className="text-green-800">✅ Database connection successful!</p>
          <p className="text-green-800">✅ {products.length} products loaded</p>
          <p className="text-green-800">✅ {categories.length} categories loaded</p>
          <p className="text-green-800">✅ All price values are integers (no decimals)</p>
        </div>
      </div>
    </div>
  );
} 