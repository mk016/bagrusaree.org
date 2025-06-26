'use client';

import { useRouter } from 'next/navigation';
import { BannerEditor } from '@/components/admin/banner-management/banner-editor';

export default function AddBannerPage() {
  const router = useRouter();

  const handleSave = (data: any) => {
    console.log('Saving banner:', data);
    router.push('/admin/banners');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <BannerEditor 
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}