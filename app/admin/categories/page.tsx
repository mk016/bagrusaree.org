import { generateMockCategories } from '@/lib/data';
import { Category } from '@/lib/types';

export default function CategoriesPage() {
  const categories: Category[] = generateMockCategories(10);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b last:border-b-0">
                <td className="py-3 px-4 text-sm text-gray-800">{category.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{category.name}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{category.slug}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{category.featured ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 