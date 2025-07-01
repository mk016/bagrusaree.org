'use client';

import { UserButton, SignInButton, SignUpButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';

export function UserAuthButton() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <UserButton 
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonBox: 'h-8 w-8',
            userButtonTrigger: 'h-8 w-8',
            userButtonAvatarBox: 'h-8 w-8'
          }
        }}
      />
    );
  }

  return (
    <div className="flex gap-2">
      <SignInButton mode="modal">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </SignInButton>
      <SignUpButton mode="modal">
        <Button variant="default" size="sm">
          Sign Up
        </Button>
      </SignUpButton>
    </div>
  );
}