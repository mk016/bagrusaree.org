'use client';

import { useParams } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-management/product-form';
import { getAllProducts } from '@/lib/data';

export default function EditProductPage() {
  const { id } = useParams();
  const products = getAllProducts();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
        <p className="text-gray-600">The product you're looking for doesn't exist.</p>
      </div>
    );
  }

  return <ProductForm product={product} isEditing />;
}