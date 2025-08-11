import React from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Login: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "/login";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <Helmet>
        <title>Login | ui-ready-frontend</title>
        <meta name="description" content="Login to access your account securely on ui-ready-frontend." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <section className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember">Remember me</Label>
                  </div>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                Don’t have an account? <Link to="#" className="text-primary hover:underline">Sign up</Link>
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>
    </>
  );
};

export default Login;
