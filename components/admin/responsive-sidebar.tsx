'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  Tag,
  Truck,
  MessageSquare,
  Menu,
  X,
  Image,
  TrendingUp,
  ChevronDown,
  Bell,
  Search,
  LogOut,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/admin', 
    icon: LayoutDashboard,
    badge: null,
    children: []
  },
  { 
    name: 'Products', 
    href: '/admin/products', 
    icon: Package,
    badge: '1.2k',
    children: [
      { name: 'All Products', href: '/admin/products' },
      { name: 'Add Product', href: '/admin/products/add' },
      { name: 'Categories', href: '/admin/products/categories' },
      { name: 'Inventory', href: '/admin/products/inventory' }
    ]
  },
  { 
    name: 'Orders', 
    href: '/admin/orders', 
    icon: ShoppingCart,
    badge: '23',
    children: [
      { name: 'All Orders', href: '/admin/orders' },
      { name: 'Pending', href: '/admin/orders/pending' },
      { name: 'Processing', href: '/admin/orders/processing' },
      { name: 'Shipped', href: '/admin/orders/shipped' }
    ]
  },
  { 
    name: 'Customers', 
    href: '/admin/customers', 
    icon: Users,
    badge: null,
    children: []
  },
  { 
    name: 'Categories', 
    href: '/admin/categories', 
    icon: Tag,
    badge: null,
    children: []
  },
  { 
    name: 'Banners', 
    href: '/admin/banners', 
    icon: Image,
    badge: null,
    children: []
  },
  { 
    name: 'Trading Products', 
    href: '/admin/trending', 
    icon: TrendingUp,
    badge: null,
    children: []
  },
  { 
    name: 'Analytics', 
    href: '/admin/analytics', 
    icon: BarChart3,
    badge: null,
    children: []
  },
  { 
    name: 'Shipping', 
    href: '/admin/shipping', 
    icon: Truck,
    badge: null,
    children: []
  },
  { 
    name: 'Reviews', 
    href: '/admin/reviews', 
    icon: MessageSquare,
    badge: '5',
    children: []
  },
  { 
    name: 'Content', 
    href: '/admin/content', 
    icon: FileText,
    badge: null,
    children: []
  },
  { 
    name: 'Settings', 
    href: '/admin/settings', 
    icon: Settings,
    badge: null,
    children: [
      { name: 'General', href: '/admin/settings/general' },
      { name: 'Payment', href: '/admin/settings/payment' },
      { name: 'Email', href: '/admin/settings/email' },
      { name: 'Security', href: '/admin/settings/security' }
    ]
  },
];

interface ResponsiveSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ResponsiveSidebar({ isOpen, onToggle }: ResponsiveSidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const filteredNavigation = navigation.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.children.some(child => 
      child.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-50 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-bold text-gray-900">Admin Panel</span>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search */}
          <div className="px-3 py-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 text-sm"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const isExpanded = expandedItems.includes(item.name);
              const hasChildren = item.children.length > 0;

              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center flex-1 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <item.icon
                        className={cn(
                          "mr-3 h-4 w-4 flex-shrink-0",
                          isActive ? "text-indigo-500" : "text-gray-400"
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge 
                          variant={isActive ? "default" : "secondary"} 
                          className="ml-2 text-xs h-5 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                    {hasChildren && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 ml-1"
                        onClick={() => toggleExpanded(item.name)}
                      >
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            isExpanded && "transform rotate-180"
                          )}
                        />
                      </Button>
                    )}
                  </div>

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            className={cn(
                              "block px-3 py-2 text-sm rounded-lg transition-colors",
                              isChildActive
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                            onClick={() => {
                              if (window.innerWidth < 1024) {
                                onToggle();
                              }
                            }}
                          >
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="px-3 py-3 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/api/placeholder/32/32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Admin User
                </p>
                <p className="text-xs text-gray-500 truncate">
                  admin@bagrusarees.com
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Profile
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <LogOut className="h-3 w-3 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}