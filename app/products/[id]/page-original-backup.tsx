'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Plus, Minus, ChevronDown, Globe, AlertCircle, Copy, Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { BuyNowButton } from '@/components/products/buy-now-button';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { getAllProducts, getProductById } from '@/lib/product-data';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(id as string);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          // Also fetch all products for related products
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        } else {
          setError("Product not found.");
        }
      } catch (err: any) {
        console.error("Failed to fetch product details:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  const isWishlisted = product ? isInWishlist(product.id) : false;
  
  const relatedProducts = products
    .filter((p: Product) => p.id !== id && p.category === product?.category)
    .slice(0, 4);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success(`Code ${code} copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity: quantity,
        sku: product.sku || product.id,
      });
      
      toast.success(`${product.name} added to cart!`, {
        description: `Quantity: ${quantity}`,
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    
    try {
      if (isWishlisted) {
        removeFromWishlist(product.id);
        toast.success('Removed from wishlist');
      } else {
        addToWishlist({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          sku: product.sku || product.id,
        });
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          Loading product details...
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center text-red-600">
          Error: {error}
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
            <Button onClick={() => router.back()}>Go Back</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercentage = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;



  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />
      <FloatingWhatsApp />

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
                className="h-full w-full object-contain"
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
                {product.images.map((image: string, index: number) => (
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
            {/* Product Title and Code */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
                <span className="text-gray-500 font-normal text-lg ml-2">( {product.sku} )</span>
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < 4 ? "fill-green-500 text-green-500" : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">4 reviews</span>
              </div>

              {/* Pricing */}
              <div className="flex items-center space-x-3 mb-4">
                {product.comparePrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{Math.round(product.comparePrice).toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(product.price).toLocaleString()}
                </span>
                {product.comparePrice && (
                  <Badge variant="destructive" className="bg-red-600">
                    Save {discountPercentage}%
                  </Badge>
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Maximum Retail Price (incl. of all taxes). <span className="font-medium">Shipping Free</span>
              </p>
            </div>

            {/* Offers Section */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">OFFERS FOR YOU</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">★</span>
                    <span className="text-sm">Buy any 2 and get Flat 10% off</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('BS10')}
                    className="flex items-center space-x-1 bg-orange-100 text-orange-700 border border-orange-300 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors"
                  >
                    <span>BS10</span>
                    {copiedCode === 'BS10' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600">★</span>
                    <span className="text-sm">Buy any 3 or More Get Flat 15% off</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('BS15')}
                    className="flex items-center space-x-1 bg-orange-100 text-orange-700 border border-orange-300 px-2 py-1 rounded text-xs hover:bg-orange-200 transition-colors"
                  >
                    <span>BS15</span>
                    {copiedCode === 'BS15' ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Shipping and Stock Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Globe className="h-4 w-4 text-gray-600" />
                <span>Free Shipping | Delivery With in 3-5 Days</span>
              </div>
              
              {product.stock > 0 && product.stock < 10 && (
                <div className="flex items-center space-x-2 text-sm text-orange-600">
                  <AlertCircle className="h-4 w-4" />
                  <span>Low stock - {product.stock} item left</span>
                </div>
              )}
            </div>

            {/* Debug Info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs">
                <strong>Debug Info:</strong>
                <br />Product ID: {product.id}
                <br />Product Name: {product.name}
                <br />Price: {product.price}
                <br />Stock: {product.stock}
                <br />SKU: {product.sku}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 py-4">
              <span className="font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="h-10 w-12 flex items-center justify-center border-x border-gray-300 font-medium">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  disabled={quantity >= (product.stock || 10)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-white border-2 border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  ADD TO CART
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToWishlist}
                  className={cn(
                    "px-4 border-2 transition-colors",
                    isWishlisted
                      ? "bg-red-50 border-red-300 text-red-600 hover:bg-red-100"
                      : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white transition-colors"
                  size="lg"
                  onClick={() => {
                    try {
                      console.log('BUY IT NOW clicked for product:', product);
                      
                      const message = `Hi! I'm interested in ordering this product:

🛍️ *${product.name || 'Product'}*
📦 Product Code: ${product.sku || product.id}
💰 Price: Rs. ${Math.round(product.price).toLocaleString()}.00
📏 Quantity: ${quantity}

Product Details:
• Saree Length: 5.5 Mtr
• Saree Width: 44 Inch
• Saree Fabric: Chanderi Silk
• With Blouse: Yes (Length: 0.8 Mtr)
• Blouse Fabric: Chanderi Silk
• Print: Handblock
• Wash Care: Hand wash separately

Please confirm availability and proceed with the order. Thank you!`;
                    
                      console.log('WhatsApp message:', message);
                      
                      const whatsappUrl = `https://wa.me/917665629448?text=${encodeURIComponent(message)}`;
                      console.log('WhatsApp URL:', whatsappUrl);
                      
                      // Try multiple methods to open WhatsApp
                      if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
                        // Mobile device
                        window.location.href = whatsappUrl;
                      } else {
                        // Desktop
                        const newWindow = window.open(whatsappUrl, '_blank');
                        if (!newWindow) {
                          // Fallback if popup blocked
                          toast.error('Please allow popups to open WhatsApp, or copy this link: ' + whatsappUrl);
                        }
                      }
                      
                      toast.success('Opening WhatsApp...');
                    } catch (error) {
                      console.error('Error opening WhatsApp:', error);
                      toast.error('Error opening WhatsApp. Please try again.');
                    }
                  }}
                  disabled={product.stock === 0}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  size="lg"
                  onClick={() => {
                    try {
                      // Add to cart first
                      handleAddToCart();
                      
                      // Small delay then redirect to checkout
                      setTimeout(() => {
                        router.push('/checkout');
                      }, 500);
                      
                      toast.success('Redirecting to checkout...');
                    } catch (error) {
                      console.error('Error proceeding to checkout:', error);
                      toast.error('Error proceeding to checkout. Please try again.');
                    }
                  }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  BUY NOW
                </Button>
              </div>
              

            </div>

            {/* Product Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Saree</div>
                  <div className="text-gray-600">Length : 5.5 Mtr</div>
                  <div className="text-gray-600">Width : 44 Inch</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">Wash Care</div>
                  <div className="text-gray-600">Hand wash</div>
                  <div className="text-gray-600">separately</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Saree Fabric</div>
                  <div className="text-gray-600">Chanderi Silk</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">With Blouse</div>
                  <div className="text-gray-600">Yes</div>
                  <div className="text-gray-600">Lenght: 0.8 Mtr</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Print</div>
                  <div className="text-gray-600">Handblock</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">Shipping</div>
                  <div className="text-gray-600">Free Worldwide</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Blouse Fabric</div>
                  <div className="text-gray-600">Chanderi Silk</div>
                </div>
                
                <div>
                  <div className="font-medium text-gray-900 mb-1">COD</div>
                  <div className="text-gray-600">Available in India</div>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-4 border-t pt-6">
              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  ABOUT BAGRUART
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p>The renowned chain of ethnic wear in Rajasthan, Bagru Art brings you timeless tradition through beautifully traditional printed collections. With over 200,000 happy customers and 10 years of excellence, we are proud to be a trusted name in authentic handcrafted fashion. Explore a world where heritage meets style.</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  BAGRU SAREES JAIPUR STORE
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p><strong>Visit Us:</strong> Open on all Days 11 AM to 5 PM</p>
                  <p><strong>Address:</strong></p>
                  <p><strong>Store Manager No:</strong> +91 76656 29448</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  SHIPPING DETAILS
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p>• Free shipping within India 5-7 working days.</p>
                  <p>• Cancellation requests will be accepted strictly within 24 hours of placing the Order.</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  CARE INSTRUCTION
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p>• These products may have a 5–10% color variation due to lighting during photography.</p>
                  <p>• Colors may appear brighter in images because of lighting effects.</p>
                  <p>• Traditional print suits are naturally dull and may have slight inconsistencies in design.</p>
                  <p>• <strong>Wash Care:</strong> Dry clean or Hand wash separately recommended.</p>
                  <p>• <strong>Ready Stock:</strong> Product will be dispatch within 24 Hours.</p>
                  <p>• <strong>Fabric length:</strong> Approximately as mentioned in product description.</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  NEED HELP ?
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p><strong>Email:</strong> support@bagrusarees</p>
                  <p><strong>Call / WhatsApp No.:</strong> +91 76656 29448</p>
                </CollapsibleContent>
              </Collapsible>

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-left font-medium">
                  MANUFACTURING INFO
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-2 text-sm text-gray-600 space-y-2">
                  <p><strong>Manufactured & Marketed By:</strong> Bagru Jaipur, PINCODE 303007- Support@bagrusarees.org</p>
                  <p><strong>Country Of Origin:</strong> India</p>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (4)</TabsTrigger>
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
                        <dd>Chanderi Silk</dd>
                      </div>
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Care Instructions</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Hand wash separately in cold water</li>
                      <li>• Do not bleach</li>
                      <li>• Dry in shade</li>
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
                      <li>• Free shipping worldwide</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                      <li>• Cash on delivery available in India</li>
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

        {/* Related Products - Desktop Grid */}
        {relatedProducts.length > 0 && (
          <div className="hidden lg:block">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct: Product) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}

        {/* Related Products - Mobile Scrollable */}
        {relatedProducts.length > 0 && (
          <div className="lg:hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Related Products</h2>
            <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
              {relatedProducts.map((relatedProduct: Product) => (
                <div key={relatedProduct.id} className="flex-shrink-0 w-64">
                  <ProductCard 
                    product={relatedProduct}
                  />
                </div>
              ))}
            </div>
          </div>
        )}


      </div>

      <Footer />
    </div>
  );
}