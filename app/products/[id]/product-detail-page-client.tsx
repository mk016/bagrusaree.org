'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { Product } from '@/lib/types';
import { getAllProducts } from '@/lib/product-data';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const mockReviews = [
  {
    id: '1',
    userId: '1',
    user: { id: '1', name: 'Priya Sharma', email: 'priya@email.com', role: 'user' as const, createdAt: new Date(), updatedAt: new Date() },
    productId: '1',
    rating: 5,
    title: 'Absolutely beautiful saree!',
    comment: 'The quality is outstanding and the embroidery work is exquisite. Perfect for weddings and special occasions.',
    verified: true,
    helpful: 12,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    userId: '2',
    user: { id: '2', name: 'Anjali Patel', email: 'anjali@email.com', role: 'user' as const, createdAt: new Date(), updatedAt: new Date() },
    productId: '1',
    rating: 4,
    title: 'Great quality, fast delivery',
    comment: 'Loved the fabric quality and the color is exactly as shown in the pictures. Will definitely buy again.',
    verified: true,
    helpful: 8,
    createdAt: new Date('2024-01-10'),
  },
];

interface ProductDetailPageClientProps {
  product: Product;
}

function Label({ className, children, ...props }: { className?: string; children: React.ReactNode; [key: string]: any }) {
  return (
    <label className={cn("text-sm font-medium", className)} {...props}>
      {children}
    </label>
  );
}

export default function ProductDetailPageClient({ product }: ProductDetailPageClientProps) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const { addItem: addToCart, items: cartItems } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  
  // Fetch related products asynchronously
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        const related = allProducts
          .filter(p => p.id !== product.id && p.category === product.category)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    
    fetchRelatedProducts();
  }, [product.id, product.category]);

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
      sku: product.sku,
    });
    
    toast({
      title: "Added to Cart!",
      description: `${product.name} has been added to your cart.`,
      variant: "default",
    });
  };

  const handleBuyNow = () => {
    // Add to cart first
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
      color: selectedColor,
      sku: product.sku,
    });
    
    // Then redirect to checkout
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        sku: product.sku,
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={() => router.push('/')} className="hover:text-indigo-600">
              Home
            </button>
            <span>/</span>
            <button onClick={() => router.push('/products')} className="hover:text-indigo-600">
              Products
            </button>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-md"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-md"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors",
                      selectedImage === index ? "border-indigo-600" : "border-gray-200"
                    )}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlistToggle}
                    className="bg-white"
                  >
                    <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-500 text-red-500")} />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.comparePrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                    <Badge variant="destructive">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              {/* Size Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Size</Label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Color Selection */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Color</Label>
                <div className="flex space-x-2">
                  {['Red', 'Blue', 'Green', 'Pink'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-colors",
                        selectedColor === color ? "border-gray-900" : "border-gray-300",
                        color === 'Red' && "bg-red-500",
                        color === 'Blue' && "bg-blue-500",
                        color === 'Green' && "bg-green-500",
                        color === 'Pink' && "bg-pink-500"
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quantity</Label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-16 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button
                className="w-full"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full bg-white" 
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
              
              {product.stock > 0 && product.stock < 10 && (
                <p className="text-sm text-orange-600">
                  Only {product.stock} left in stock!
                </p>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <Truck className="h-5 w-5 text-indigo-600" />
                <span>Free shipping on orders over ₹999</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <RotateCcw className="h-5 w-5 text-indigo-600" />
                <span>7-day easy returns</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-5 w-5 text-indigo-600" />
                <span>100% authentic products</span>
              </div>
            </div>

            {/* Product Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-white">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (24)</TabsTrigger>
            <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Product Details</h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">SKU:</dt>
                        <dd>{product.sku}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Category:</dt>
                        <dd className="capitalize">{product.category.replace('-', ' ')}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Stock:</dt>
                        <dd>{product.stock} available</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Material:</dt>
                        <dd>Premium Cotton Blend</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Care Instructions</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Machine wash cold with similar colors</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low</li>
                      <li>• Iron on low heat if needed</li>
                      <li>• Dry clean for best results</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {review.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{review.user.name}</h4>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-500">
                                {review.createdAt.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                      <button className="text-xs text-gray-500 hover:text-gray-700">
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-6">
            <Card className="bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Shipping Information</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Free shipping on orders over ₹999</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• Cash on delivery available</li>
                      <li>• Order tracking available</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Returns & Exchanges</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• 7-day easy returns</li>
                      <li>• Free return pickup</li>
                      <li>• Refund within 5-7 business days</li>
                      <li>• Items must be unused and in original packaging</li>
                      <li>• Exchange for different size/color available</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}