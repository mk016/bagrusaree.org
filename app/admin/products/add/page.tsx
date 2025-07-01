'use client';

import { useRouter } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-management/product-form';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function AddProductPage() {
  const router = useRouter();

  const handleProductSave = (product: Product) => {
    toast.success('Product added successfully!');
    router.push('/admin/products');
  };

  return <ProductForm onProductSave={handleProductSave} />;
}