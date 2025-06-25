import { generateMockReviews, generateMockUsers, getAllProducts } from '@/lib/data';
import { Review } from '@/lib/types';

export default function ReviewsPage() {
  const users = generateMockUsers(10);
  const products = getAllProducts();
  const reviews: Review[] = generateMockReviews(20, users, products);

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
            {reviews.map((review) => (
              <tr key={review.id} className="border-b last:border-b-0">
                <td className="py-3 px-4 text-sm text-gray-800">{review.id}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{review.product.name}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{review.user.name}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{review.rating} / 5</td>
                <td className="py-3 px-4 text-sm text-gray-800">{review.title}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{review.verified ? 'Yes' : 'No'}</td>
                <td className="py-3 px-4 text-sm text-gray-800">{new Date(review.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 