import { ErrorBoundary } from "react-error-boundary"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/contexts/auth";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold text-destructive">Something went wrong</h2>
      <pre className="mt-4 rounded bg-muted p-4 text-sm">
        {error.message}
      </pre>
    </div>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Get authentication status
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex min-h-screen flex-col">
        <Header user={user} /> {/* Pass user status to Header */}
        <div className="flex-1 flex">
          {user && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden absolute left-4 top-4">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar className="w-64" />
              </SheetContent>
            </Sheet>
          )}
          <Sidebar className="w-64 hidden md:block" />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
        <Toaster />
      </div>
    </ErrorBoundary>
  )
}