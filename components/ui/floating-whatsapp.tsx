'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = '919024306866';
  const defaultMessage = 'Hello! I am interested in your products. Can you help me?';

  const openWhatsApp = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* WhatsApp Button */}
      <Button
        onClick={openWhatsApp}
        className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-7 w-7 text-white" />
      </Button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
    </div>
  );
}