'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { API_ENDPOINTS } from '@/lib/constants';

// Default categories to show while loading
const DEFAULT_CATEGORIES = [
  {
    id: '1',
    name: 'Sarees',
    slug: 'sarees',
    subcategories: [
      { id: '1-1', name: 'Cotton Sarees', slug: 'cotton-sarees' },
      { id: '1-2', name: 'Silk Sarees', slug: 'silk-sarees' },
      { id: '1-3', name: 'Printed Sarees', slug: 'printed-sarees' },
    ],
  },
  {
    id: '2',
    name: 'Suit Sets',
    slug: 'suit-sets',
    subcategories: [
      { id: '2-1', name: 'Anarkali Suits', slug: 'anarkali-suits' },
      { id: '2-2', name: 'Palazzo Suits', slug: 'palazzo-suits' },
    ],
  },
  {
    id: '3',
    name: 'Dress Material',
    slug: 'dress-material',
    subcategories: [
      { id: '3-1', name: 'Cotton Dress Material', slug: 'cotton-dress-material' },
      { id: '3-2', name: 'Silk Dress Material', slug: 'silk-dress-material' },
    ],
  },
  {
    id: '4',
    name: 'Dupattas',
    slug: 'dupattas',
    subcategories: [
      { id: '4-1', name: 'Cotton Dupattas', slug: 'cotton-dupattas' },
      { id: '4-2', name: 'Silk Dupattas', slug: 'silk-dupattas' },
    ],
  },
  {
    id: '5',
    name: 'Bedsheets',
    slug: 'bedsheets',
    subcategories: [
      { id: '5-1', name: 'Single Bedsheets', slug: 'single-bedsheets' },
      { id: '5-2', name: 'Double Bedsheets', slug: 'double-bedsheets' },
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
                    href={`/category/${category.slug}/${subcategory.slug}`}
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
      <div className="flex items-center space-x-8 py-4">
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
                        href={`/category/${category.slug}/${subcategory.slug}`}
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