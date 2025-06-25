'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

interface MegaMenuProps {
  isMobile?: boolean;
}

export function MegaMenu({ isMobile = false }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);

  if (isMobile) {
    return (
      <nav className="space-y-2">
        {CATEGORIES.map((category) => (
          <div key={category.id}>
            <div className="flex items-center justify-between">
              <Link
                href={`/category/${category.slug}`}
                className="flex-1 py-2 text-left hover:text-indigo-600 transition-colors"
              >
                {category.name}
              </Link>
              {category.subcategories.length > 0 && (
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
            {expandedMobile === category.id && category.subcategories.length > 0 && (
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
        {CATEGORIES.map((category) => (
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
              {category.subcategories.length > 0 && (
                <ChevronDown className="h-4 w-4" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {activeCategory === category.id && category.subcategories.length > 0 && (
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