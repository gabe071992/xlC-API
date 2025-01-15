import { useAuth } from "@/lib/contexts/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export function AuthStatus() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
      setEmail("");
      setPassword("");
      toast({
        title: "Success",
        description: "Logged in successfully",
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to login",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to logout",
      });
    }
  };

  if (loading) {
    return <div className="animate-pulse h-8 w-8 rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        {showLogin ? (
          <form onSubmit={handleLogin} className="flex items-center gap-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-48"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-48"
              required
            />
            <Button type="submit">Login</Button>
            <Button variant="ghost" onClick={() => setShowLogin(false)}>Cancel</Button>
          </form>
        ) : (
          <Button variant="ghost" onClick={() => setShowLogin(true)}>
            <LogIn className="h-5 w-5 mr-2" />
            Login
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
      <span className="text-sm mr-2">{user.email}</span>
      <Button variant="ghost" onClick={handleLogout}>
        <LogOut className="h-5 w-5 mr-2" />
        Logout
      </Button>
    </div>
  );
}