'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/constants';

// Static navigation items that appear before categories
const STATIC_NAV_ITEMS = [
  { name: 'Home', href: '/', id: 'home' },
];

// Default categories to show while loading
const DEFAULT_CATEGORIES = [
  {
    id: '1',
    name: 'Sarees',
    slug: 'sarees',
    subcategories: [
      { id: '1-1', name: 'Cotton mul mul saree', slug: 'cotton-mul-mul-saree' },
      { id: '1-2', name: 'Cotton linen saree', slug: 'cotton-linen-saree' },
      { id: '1-3', name: 'Kota doriya saree', slug: 'kota-doriya-saree' },
      { id: '1-4', name: 'Chanderi silk saree', slug: 'chanderi-silk-saree' },
      { id: '1-5', name: 'Maheshwari silk saree', slug: 'maheshwari-silk-saree' },
    ],
  },
  {
    id: '2',
    name: 'Suit',
    slug: 'suit',
    subcategories: [
      { id: '2-1', name: 'Cotton suit with Mul dupatta', slug: 'cotton-suit-mul-dupatta' },
      { id: '2-2', name: 'Cotton suit with chiffon dupatta', slug: 'cotton-suit-chiffon-dupatta' },
      { id: '2-3', name: 'Cotton suit with Kota doriya duppata', slug: 'cotton-suit-kota-doriya-dupatta' },
      { id: '2-4', name: 'Kota doriya suit', slug: 'kota-doriya-suit' },
      { id: '2-5', name: 'Chanderi silk suit', slug: 'chanderi-silk-suit' },
      { id: '2-6', name: 'Maheshwari silk suit', slug: 'maheshwari-silk-suit' },
      { id: '2-7', name: 'Cotton linen suit', slug: 'cotton-linen-suit' },
    ],
  },
  {
    id: '3',
    name: 'Best Sellers',
    slug: 'best-sellers',
    subcategories: [],
  },
  {
    id: '4',
    name: 'Hand Bags',
    slug: 'hand-bags',
    subcategories: [],
  },
  {
    id: '5',
    name: 'More',
    slug: 'more',
    subcategories: [
      { id: '5-1', name: 'About', slug: 'about' },
      { id: '5-2', name: 'Offers', slug: 'offers' },
      { id: '5-3', name: 'Benefits', slug: 'benefits' },
    ],
  },
];

interface MegaMenuProps {
  isMobile?: boolean;
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.CATEGORIES);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCategories(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isMobile) {
    return (
      <nav className="space-y-2">
        {STATIC_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="block py-2 px-2 text-sm  text-gray-900 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors"
          >
            {item.name}
          </Link>
        ))}
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between">
              <Link
                href={`/category/${category.slug}`}
                className="flex-1 py-2 text-left hover:text-indigo-600 transition-colors"
              >
                {category.name}
              </Link>
              {category.subcategories && category.subcategories.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setExpandedMobile(
                      expandedMobile === category.id ? null : category.id
                    )
                  }
                >
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      expandedMobile === category.id && 'transform rotate-90'
                    )}
                  />
                </Button>
              )}
            </div>
            {expandedMobile === category.id && category.subcategories && category.subcategories.length > 0 && (
              <div className="ml-4 space-y-1 mt-2">
                {category.subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    href={`/category/${category.slug}`}
                    className="block py-1 px-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    {subcategory.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="relative">
      <div className="flex items-center justify-center space-x-8 py-4">
        {STATIC_NAV_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className="flex items-center space-x-1 py-2 text-sm font-medium hover:text-indigo-600 transition-colors"
          >
            <span>{item.name}</span>
          </Link>
        ))}
        {categories.map((category) => (
          <div
            key={category.id}
            className="relative"
            onMouseEnter={() => setActiveCategory(category.id)}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <Link
              href={`/category/${category.slug}`}
              className={cn(
                'flex items-center space-x-1 py-2 text-sm font-medium hover:text-indigo-600 transition-colors',
                activeCategory === category.id && 'text-indigo-600'
              )}
            >
              <span>{category.name}</span>
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronDown className="h-4 w-4" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {activeCategory === category.id && category.subcategories && category.subcategories.length > 0 && (
              <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border rounded-xl shadow-lg">
                <div className="p-4">
                  <div className="grid grid-cols-1 gap-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/category/${category.slug}`}
                        className="block py-2 px-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}