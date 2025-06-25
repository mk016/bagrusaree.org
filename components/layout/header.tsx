'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCartStore, useAuthStore, useWishlistStore } from '@/lib/store';
import { MegaMenu } from './mega-menu';
import { UserMenu } from './user-menu';
import { Input } from '@/components/ui/input';
import { Heart, Search, User, X } from 'lucide-react';

export function Header() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getTotalItems, toggleCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();

  const totalCartItems = getTotalItems();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const cartItemCount = isHydrated ? totalCartItems : 0;
  const wishlistItemCount = isHydrated ? wishlistItems.length : 0;

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
        <div className="flex items-center justify-between">
          {/* Mobile: Hamburger and Cart only */}
          <div className="flex items-center w-full md:hidden">
            {/* Hamburger Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="mr-2" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 xs:w-72 sm:w-80 bg-white p-0">
                {/* Sidebar Content */}
                <div className="py-4 px-4">
                  {/* Logo */}
                  <Link href="/" className="flex items-center space-x-2 mb-6">
                    <img src="/assets/logo.png" alt="BagruSarees Logo" className="h-8 w-auto" />
                  </Link>
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 pr-4 py-2 w-full bg-white text-sm"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {/* Wishlist */}
                  <Link href="/wishlist" className="block mb-2">
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
                  {/* User Menu or Login */}
                  <div className="mb-2">
                    {isHydrated && isAuthenticated ? (
                      <UserMenu />
                    ) : (
                      <Link href="/auth/login">
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <User className="h-5 w-5 mr-2" />
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                  {/* Mega Menu */}
                  <div className="mt-4">
                    <MegaMenu isMobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            {/* Centered Logo (optional, can be hidden on mobile if desired) */}
            <Link href="/" className="flex items-center space-x-2 flex-1 justify-center">
              <img src="/assets/logo.png" alt="BagruSarees Logo" className="h-8 w-auto" />
            </Link>
            {/* Cart Icon */}
            <Button
              variant="ghost"
              size="sm"
              className="relative ml-auto"
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

          {/* Desktop/Tablet: Full Header */}
          <div className="hidden md:flex items-center justify-between w-full">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 min-w-[120px]">
              <img src="/assets/logo.png" alt="BagruSarees Logo" className="h-8 w-auto" />
            </Link>
            {/* Search Bar */}
            <div className="flex-1 flex justify-center mx-4 w-full min-w-0">
              <div className="w-full max-w-md">
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 w-full bg-white text-sm"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
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
              {/* User Menu */}
              {isHydrated && isAuthenticated ? (
                <UserMenu />
              ) : (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" aria-label="Login">
                    <User className="h-5 w-5 mr-2" />
                    <span className="hidden xs:inline">Login</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Desktop & Large Tablet */}
      <div className="hidden md:block border-t w-full">
        <div className="container mx-auto px-2 sm:px-4">
          <MegaMenu />
        </div>
      </div>
    </header>
  );
}