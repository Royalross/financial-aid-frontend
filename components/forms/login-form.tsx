'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import axios from 'axios';

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const apiUrl: string | undefined = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API_URL is not defined');

      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { login, password },
        { headers: { 'Content-Type': 'application/json' } },
      );

      // The backend returns { token: "...", tokenType: "Bearer" }
      const token = response.data.token;
      const tokenType = response.data.tokenType || 'Bearer';

      localStorage.setItem('token', token);
      localStorage.setItem('tokenType', tokenType);
      localStorage.setItem('login', login);

      router.push('/dashboard');
    } catch (err: unknown) {
      let errorMsg = 'Invalid email or password';

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
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email or username below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="login">Email or Username</Label>
                <Input
                  id="login"
                  type="text"
                  placeholder="Email or username"
                  required
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/sign-up" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
