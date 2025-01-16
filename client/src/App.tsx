import React, { lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "@/lib/contexts/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/contexts/auth";
import { Header } from "@/components/layout/Header";
import NotFound from "@/pages/not-found";
import { MainLayout } from "@/components/layout/MainLayout"; // Added import for MainLayout


function Router() {
  return (
    <Switch>
      <Route path="/">
        {() => {
          const { user, loading } = useAuth();
          const Dashboard = lazy(() => import("@/pages/dashboard"));
          const Distribution = lazy(() => import("@/pages/distribution"));

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
      <Route path="/distribution">
        {() => (
          <React.Suspense fallback={<div>Loading...</div>}>
            <Distribution />
          </React.Suspense>
        )}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

import { WagmiConfig } from 'wagmi'
import { config } from './lib/web3'

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <MainLayout> {/* Using MainLayout here */}
            <Router />
          </MainLayout>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;

