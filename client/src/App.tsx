import React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "@/lib/contexts/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/contexts/auth";
import { Header } from "@/components/layout/Header";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => {
          const { user, loading } = useAuth();
          const Dashboard = React.lazy(() => import("@/pages/dashboard"));
          
          if (loading) {
            return <div>Loading...</div>;
          }
          
          if (!user) {
            return (
              <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">xlC</h1>
                  <p className="mb-4">Please log in to access the dashboard</p>
                </div>
              </div>
            );
          }

          return (
            <React.Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </React.Suspense>
          );
        }}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;