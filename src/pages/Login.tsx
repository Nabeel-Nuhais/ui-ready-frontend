import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const canonicalUrl = typeof window !== "undefined" ? `${window.location.origin}/login` : "/login";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simple local auth
    localStorage.setItem("auth", JSON.stringify({ loggedIn: true, username }));
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Login | Batch Manager</title>
        <meta name="description" content="Login to access your Batch Manager dashboard." />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <section className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <CardDescription>Enter your username and password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
                </div>
                <Button type="submit" className="w-full">Sign in</Button>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </>
  );
};

export default Login;
