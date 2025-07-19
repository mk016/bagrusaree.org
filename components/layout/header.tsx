'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu, Search, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { MegaMenu } from './mega-menu';
import { UserMenu } from './user-menu';
import { Input } from '@/components/ui/input';
import { Heart, User } from 'lucide-react';
import { UserAuthButton } from './user-auth-button';
import Image from 'next/image';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  sellingPrice: number;
  imagesUrl: string[];
}

export function Header() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();

  const totalCartItems = getTotalItems();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItemCount = isHydrated ? totalCartItems : 0;
  const wishlistItemCount = isHydrated ? wishlistItems.length : 0;

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.products || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-indigo-600 text-white py-2 w-full text-xs sm:text-sm">
        <div className="container mx-auto px-2 sm:px-4 text-center">
          Free shipping on orders over ₹999 | Use code: WELCOME10 for 10% off
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4 w-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between w-full lg:hidden">
          {/* Left: Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 xs:w-72 sm:w-80 bg-white p-0">
              {/* Sidebar Content */}
              <div className="flex flex-col h-full">
                {/* Header with Logo */}
                <div className="p-4 border-b border-gray-200">
                  <Link href="/" className="flex items-center space-x-2">
                    <img src="/assets/logo.png" alt="BagruSarees Logo" className="h-10 w-auto" />
                    <span className="text-lg font-bold text-gray-900">BagruSarees</span>
                  </Link>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 p-4">
                  <MegaMenu isMobile />
                </div>
                
                {/* Bottom Section - User Auth & Wishlist */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  {/* Wishlist */}
                  <Link href="/wishlist" className="block">
                    <Button variant="ghost" size="sm" className="relative w-full justify-start">
                      <Heart className="h-5 w-5 mr-2" />
                      Wishlist
                      {wishlistItemCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 w-5 flex items-center justify-center text-xs"
                        >
                          {wishlistItemCount}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                  
                  {/* User Auth Button */}
                  <div>
                    <UserAuthButton />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Center: Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/assets/logo.png"
              alt="BagruSarees"
              width={40}
              height={40}
              className="w-8 h-8"
            />
            <span className="text-lg font-bold text-gray-900">BagruSarees</span>
          </Link>

          {/* Right: Search and Cart */}
          <div className="flex items-center space-x-2">
            {/* Search Icon - First */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </Button>
            
            {/* Cart Icon - After Search */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
          
          {/* Mobile Search Input - Shows when clicked */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border-gray-200"
                  autoFocus
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearSearch();
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Search Results Dropdown */}
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link
                        key={product.id}
                        href={`/products/${product.id}`}
                        className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          clearSearch();
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {product.imagesUrl[0] && (
                            <img
                              src={product.imagesUrl[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            ₹{product.sellingPrice}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop/Tablet: Full Header */}
        <div className="hidden lg:flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 min-w-[120px]">
            <img src="/assets/logo.png" alt="BagruSarees Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold text-gray-900">BagruSarees</span>
          </Link>
          
          {/* Center: Categories with Dropdowns */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium font-bold text-gray-700 hover:text-indigo-600 transition-colors"> 
              Home
            </Link>
            
            {/* Sarees with Dropdown */}
            <div className="relative group">
              <Link href="/category/sarees" className="text-sm font-medium font-bold text-gray-900 hover:text-indigo-600 transition-colors flex items-center space-x-1">
                <span>Sarees</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/category/sarees" className="block py-2 px-3 font-bold text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton mul mul saree
                    </Link>
                    <Link href="/category/sarees" className="block py-2 px-3 font-bold text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton linen saree
                    </Link>
                    <Link href="/category/sarees" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Kota doriya saree
                    </Link>
                    <Link href="/category/sarees" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Chanderi silk saree
                    </Link>
                    <Link href="/category/sarees" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Maheshwari silk saree
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Suit with Dropdown */}
            <div className="relative group">
              <Link href="/category/suit" className="text-sm font-medium font-bold text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1">
                <span>Suit</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton suit with Mul dupatta
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton suit with chiffon dupatta
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton suit with Kota doriya dupatta
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Kota doriya suit
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Chanderi silk suit
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Maheshwari silk suit
                    </Link>
                    <Link href="/category/suit" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Cotton linen suit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <span  className="text-sm font-medium font-bold text-gray-700 hover:text-indigo-600 transition-colors">
              Best Sellers
            </span>
            <span className="text-sm font-medium font-bold text-gray-700 hover:text-indigo-600 transition-colors">
              Hand Bags
            </span>
            
            {/* More with Dropdown */}
            <div className="relative group">
              <Link href="/category/more" className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1">
                <span>More</span>
                <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Link href="/about" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      About
                    </Link>
                    <Link href="/offers" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Offers
                    </Link>
                    <Link href="/benefits" className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors">
                      Benefits
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Search - Icon Only on Desktop */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Desktop Search Input - Shows when clicked */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4 z-50">
                <div className="container mx-auto px-4">
                  <div className="relative max-w-md mx-auto">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 text-sm bg-gray-50 border-gray-200"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearSearch();
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    {/* Search Results Dropdown */}
                    {searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                              clearSearch();
                              setIsSearchOpen(false);
                            }}
                          >
                            <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                              {product.imagesUrl[0] && (
                                <img
                                  src={product.imagesUrl[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                ₹{product.sellingPrice}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist" className="relative">
              <Button variant="ghost" size="sm" className="relative" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                  >
                    {wishlistItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              aria-label="Cart"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
            
            {/* User Auth Button */}
            <UserAuthButton />
          </div>
        </div>
      </div>

      {/* Remove the bottom navigation section */}
    </header>
  );
}