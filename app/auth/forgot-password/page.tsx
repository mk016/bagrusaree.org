'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEmailSent(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BagruSarees</span>
          </Link>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-1">
            {!isEmailSent ? (
              <>
                <CardTitle className="text-2xl font-bold text-center">Forgot your password?</CardTitle>
                <CardDescription className="text-center">
                  Enter your email address and we'll send you a link to reset your password.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
                <CardDescription className="text-center">
                  We've sent a password reset link to {email}
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!isEmailSent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-sm text-gray-600">
                  <p>Didn't receive the email? Check your spam folder or</p>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-indigo-600"
                    onClick={() => setIsEmailSent(false)}
                  >
                    try again
                  </Button>
                </div>
                
                <Button asChild className="w-full">
                  <a href="mailto:" className="inline-flex items-center justify-center">
                    <Mail className="mr-2 h-4 w-4" />
                    Open email app
                  </a>
                </Button>
              </div>
            )}

            <div className="text-center">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}