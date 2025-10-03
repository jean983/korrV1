import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Lock, Mail } from 'lucide-react';
import korraiLogo from 'figma:asset/bd5bdf8d244c8b4fc63b5124966283973e9beb45.png';

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  const handleDemoLogin = () => {
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#186181] via-[#1d2759] to-[#769f86] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-32 h-16 bg-white rounded-2xl shadow-lg mb-4 px-4">
            <img src={korraiLogo} alt="KorrAI" className="h-8 w-auto" />
          </div>
          <p className="text-white/80">Geotechnical Intelligence Platform</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Sign in to access your geotechnical projects and AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="engineer@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
            >
              Try Demo Account
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-6">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>© 2024 Korrai. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
