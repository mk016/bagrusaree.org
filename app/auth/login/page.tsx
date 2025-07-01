'use client';

import { SignIn } from '@clerk/nextjs';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white font-bold text-lg">E</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">BagruSarees</span>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="pt-6">
            <SignIn
              appearance={{
                elements: {
                  formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-sm normal-case',
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-2xl font-bold text-center',
                  headerSubtitle: 'text-center',
                  socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50',
                  dividerLine: 'bg-gray-200',
                  dividerText: 'text-xs text-gray-500',
                  formFieldInput: 'rounded-md border-gray-300',
                  footerActionLink: 'text-indigo-600 hover:text-indigo-500'
                }
              }}
              routing="path"
              path="/auth/login"
              signUpUrl="/auth/signup"
              redirectUrl="/"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}