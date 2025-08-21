'use client';

import { UserMenu } from './user-menu';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';

export function UserAuthButton() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <UserMenu />;
  }

  return (
    <div className="flex gap-2">
      <Link href="/auth/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button variant="default" size="sm">
          Sign Up
        </Button>
      </Link>
    </div>
  );
}