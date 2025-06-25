import './globals.css';
import type { Metadata } from 'next';

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
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}