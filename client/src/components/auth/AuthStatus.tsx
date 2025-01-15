import { useAuth } from "@/lib/contexts/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function AuthStatus() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-8 w-8 rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {showLogin ? (
          <form onSubmit={handleLogin} className="flex gap-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit">Login</Button>
          </form>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setShowLogin(true)}>
            <LogIn className="h-5 w-5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>
          {user.email?.charAt(0).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <Button variant="ghost" size="icon">
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}