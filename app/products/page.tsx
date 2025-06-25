"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, Grid, List, SortAsc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ProductCard } from '@/components/products/product-card';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { CATEGORIES } from '@/lib/constants';
import { getAllProducts } from '@/lib/data';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const allProducts = getAllProducts();

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allProducts.forEach(product => {
      product.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter
      if (selectedCategory && product.category !== selectedCategory) {
        return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      
      // Tags filter
      if (selectedTags.length > 0 && !selectedTags.some(tag => product.tags.includes(tag))) {
        return false;
      }
      
      return true;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, priceRange, selectedTags, sortBy, allProducts]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      const categoryName = CATEGORIES.find(cat => cat.slug === product.category)?.name || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(product);
      return acc;
    }, {} as Record<string, typeof filteredProducts>);
  }, [filteredProducts]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value === 'all-categories' ? '' : value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange([0, 10000]);
    setSelectedTags([]);
    setSortBy('newest');
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Category</Label>
        <Select value={selectedCategory || 'all-categories'} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {CATEGORIES.map(category => (
              <SelectItem key={category.id} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <Label className="text-sm font-medium mb-2 block">
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          min={0}
          step={100}
          className="w-full"
        />
      </div>

      {/* Tags Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Tags</Label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={() => handleTagToggle(tag)}
              />
              <Label htmlFor={tag} className="text-sm">
                {tag}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartSidebar />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our complete collection of authentic Indian fashion
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <FiltersContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {/* Mobile Filters */}
                <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-sm text-gray-600">
                  {filteredProducts.length} products found
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-xl">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Display */}
            {Object.keys(groupedProducts).length > 0 ? (
              <Accordion type="multiple" className="w-full">
                {Object.entries(groupedProducts).map(([categoryName, products]) => (
                  <AccordionItem key={categoryName} value={categoryName}>
                    <AccordionTrigger className="text-xl font-semibold bg-gray-100 rounded-xl px-4 py-3 hover:bg-gray-200 transition-colors mb-2">
                      {categoryName} ({products.length})
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                        {products.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-12 text-gray-600">
                No products found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}