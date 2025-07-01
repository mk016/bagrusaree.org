"use client";

import { UserProfile, useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <UserProfile 
                  appearance={{
                    elements: {
                      rootBox: 'w-full',
                      card: 'shadow-none p-0',
                      navbar: 'hidden',
                      pageScrollBox: 'p-0',
                    }
                  }}
                  path="/account"
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Welcome, {user?.firstName || 'User'}!</CardTitle>
                <CardDescription>Here's an overview of your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Account created</h3>
                    <p className="text-gray-600">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}