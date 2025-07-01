'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/lib/data';
import { generateMockCategories } from '@/lib/mock-data';
import { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        try {
          const data = await getCategories();
          if (data && data.length > 0) {
            setCategories(data);
            return;
          }
        } catch (apiErr) {
          console.warn("API fetch failed, using mock data:", apiErr);
        }
        
        // Fall back to mock data if API fails or returns empty
        const mockData = generateMockCategories(8);
        setCategories(mockData);
      } catch (err: any) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">No categories found</td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{category.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{category.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{category.slug}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{category.featured ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 