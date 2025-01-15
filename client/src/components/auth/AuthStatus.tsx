import { useAuth } from "@/lib/contexts/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogIn, LogOut } from "lucide-react";

export function AuthStatus() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="animate-pulse h-8 w-8 rounded-full bg-muted" />;
  }

  if (!user) {
    return (
      <Button variant="ghost" size="icon">
        <LogIn className="h-5 w-5" />
      </Button>
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
