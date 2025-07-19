import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to get exclusive offers and latest updates</p>
            </div>
            <div className="flex w-full md:w-auto max-w-md flex-col sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="rounded-xl sm:rounded-r-none bg-gray-800 border-gray-700 text-white mb-2 sm:mb-0"
              />
              <Button className="rounded-xl sm:rounded-l-none bg-indigo-600 hover:bg-indigo-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-bold">BagruSarees</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted partner for authentic Indian ethnic wear and fashion accessories. 
              Quality products with exceptional service.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="p-2">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/care-instructions" className="text-gray-400 hover:text-white transition-colors">
                  Care Instructions
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/category/sarees" className="text-gray-400 hover:text-white transition-colors">
                  Sarees
                </Link>
              </li>
              <li>
                <Link href="/category/suit" className="text-gray-400 hover:text-white transition-colors">
                  Suit Sets
                </Link>
              </li>
              <li>
                <Link href="/category/dress-material" className="text-gray-400 hover:text-white transition-colors">
                  Dress Material
                </Link>
              </li>
              <li>
                <Link href="/category/fabrics" className="text-gray-400 hover:text-white transition-colors">
                  Fabrics
                </Link>
              </li>
              <li>
                <Link href="/category/dupattas" className="text-gray-400 hover:text-white transition-colors">
                  Dupattas
                </Link>
              </li>
              <li>
                <Link href="/category/mens-collection" className="text-gray-400 hover:text-white transition-colors">
                  Men's Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-gray-400 text-sm">
                    Bagru, Jaipur<br />
                    Rajasthan, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-indigo-400" />
                <p className="text-gray-400">+91 76656 29448</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-indigo-400" />
                <p className="text-gray-400">support@bagrusarees.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 BagruSarees. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}