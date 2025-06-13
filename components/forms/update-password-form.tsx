'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API_URL is not defined');

      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');
      if (!token) throw new Error('Reset token not found in URL');

      await axios.post(
        `${apiUrl}/auth/update-password`,
        { password, token },
        { headers: { 'Content-Type': 'application/json' } },
      );

      router.push('/auth/login');
    } catch (err: unknown) {
      let errorMsg = 'Unable to update password';

      if (axios.isAxiosError(err) && err.response) {
        const data = err.response.data;
        if (typeof data === 'object' && data !== null) {
          if ('detail' in data && typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if ('message' in data && typeof data.message === 'string') {
            errorMsg = data.message;
          }
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
      }

      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>Please enter your new password below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="New password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save new password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
