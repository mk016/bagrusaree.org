'use client';

import { useEffect, useState } from 'react';
import { getAllProducts } from '@/lib/data';
import { Review, Product, User } from '@/lib/types';

// Mock review generator function
function generateMockReviews(count: number, products: Product[]): Review[] {
  const reviews: Review[] = [];
  const names = ['John Doe', 'Jane Smith', 'Alex Johnson', 'Emily Davis', 'Michael Brown'];
  
  for (let i = 0; i < count; i++) {
    const product = products[Math.floor(Math.random() * products.length)];
    reviews.push({
      id: `review-${i + 1}`,
      userId: `user-${i % 5 + 1}`,
      user: {
        id: `user-${i % 5 + 1}`,
        name: names[i % 5],
        email: `user${i % 5 + 1}@example.com`,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      productId: product?.id || `product-${i + 1}`,
      product: product || {
        id: `product-${i + 1}`,
        name: 'Sample Product',
        description: 'Sample description',
        price: 999,
        images: [],
        category: 'sarees',
        tags: [],
        stock: 10,
        featured: false,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      rating: Math.floor(Math.random() * 5) + 1,
      title: ['Great product!', 'Excellent quality', 'Not what I expected', 'Love it!', 'Could be better'][Math.floor(Math.random() * 5)],
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      verified: Math.random() > 0.3,
      helpful: Math.floor(Math.random() * 10),
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return reviews;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getAllProducts();
        const generatedReviews: Review[] = generateMockReviews(20, products);
        setReviews(generatedReviews);
      } catch (err: any) {
        console.error("Failed to load reviews:", err);
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="container mx-auto py-8 text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Reviews Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length === 0 ? (
              <tr className="border-b last:border-b-0">
                <td colSpan={7} className="py-3 px-4 text-sm text-gray-800 text-center">No reviews found.</td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="border-b last:border-b-0">
                  <td className="py-3 px-4 text-sm text-gray-800">{review.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{review.product.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{review.user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{review.rating} / 5</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{review.title}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{review.verified ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4 text-sm text-gray-800">{new Date(review.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 