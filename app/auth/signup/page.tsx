'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Facebook, Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

const passwordRequirements = [
  { text: 'At least 8 characters', regex: /.{8,}/ },
  { text: 'One uppercase letter', regex: /[A-Z]/ },
  { text: 'One lowercase letter', regex: /[a-z]/ },
  { text: 'One number', regex: /\d/ },
];

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      login({
        id: '1',
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setIsLoading(false);
      router.push('/');
    }, 1000);
  };

  const isPasswordValid = (password: string) => {
    return passwordRequirements.every(req => req.regex.test(password));
  };

  const passwordsMatch = formData.password && formData.confirmPassword && 
                         formData.password === formData.confirmPassword;

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
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
            <CardDescription className="text-center">
              Join us and start your fashion journey today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Social Login */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <Mail className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <Facebook className="mr-2 h-4 w-4" />
                Continue with Facebook
              </Button>
            </div>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {/* Password Requirements */}
                {formData.password && (
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs">
                        <Check 
                          className={`h-3 w-3 ${
                            req.regex.test(formData.password) 
                              ? 'text-green-500' 
                              : 'text-gray-300'
                          }`} 
                        />
                        <span 
                          className={
                            req.regex.test(formData.password) 
                              ? 'text-green-600' 
                              : 'text-gray-500'
                          }
                        >
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {formData.confirmPassword && !passwordsMatch && (
                  <p className="text-xs text-red-500">Passwords don't match</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  required
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I agree to the{' '}
                  <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !agreedToTerms || !isPasswordValid(formData.password) || !passwordsMatch}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}