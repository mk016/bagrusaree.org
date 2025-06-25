"use client";

import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <AlertTriangle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Error</h1>
              <p className="text-gray-600 mb-4">
                A critical error occurred. Please refresh the page to continue.
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mb-4">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
            
            <Button onClick={reset} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}