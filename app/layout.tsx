import './globals.css';
import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ImageKitAppProvider } from '@/components/providers/imagekit-provider';
import { FloatingWhatsApp } from '@/components/ui/floating-whatsapp';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'BagruSarees - Authentic Indian Fashion',
  description: 'Discover authentic Indian ethnic wear and fashion accessories. Quality products with exceptional service.',
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <ImageKitAppProvider>
            {children}
          </ImageKitAppProvider>
          <FloatingWhatsApp />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}