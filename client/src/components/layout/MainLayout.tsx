
import { ErrorBoundary } from "react-error-boundary"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Toaster } from "@/components/ui/toaster"

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
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex">
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
