import { AuthStatus } from "@/components/auth/AuthStatus";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-bold">XLC Token Manager</h1>
        <AuthStatus />
      </div>
    </header>
  );
}
