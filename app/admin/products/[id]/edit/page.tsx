'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { ProductForm } from '@/components/admin/product-management/product-form';
import { getProducts } from '@/lib/product-data'; // To fetch a single product from all products
import { Product } from '@/lib/types';

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Fetch all products and find the one matching the ID
        const allProducts = await getProducts();
        const foundProduct = allProducts.find(p => p.id === id);

        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found.');
        }
      } catch (err: any) {
        console.error('Failed to fetch product for editing:', err);
        setError('Failed to load product for editing: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleProductSave = (updatedProduct: Product) => {
    // After saving, navigate back to the product list
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-8 text-center">
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-8 text-center text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 lg:ml-64 p-8 text-center text-gray-600">
          Product details could not be loaded.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <ProductForm product={product} isEditing={true} onProductSave={handleProductSave} />
      </div>
    </div>
  );
}