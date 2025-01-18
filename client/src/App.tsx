
import React, { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { useAuth } from "@/lib/contexts/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/contexts/auth";
import { MainLayout } from "@/components/layout/MainLayout";
import { WagmiConfig } from 'wagmi';
import { config } from './lib/web3';

const LazyUsers = lazy(() => import("@/pages/users"));
const LazyTokenOperations = lazy(() => import("@/pages/token-operations"));
const LazyDashboard = lazy(() => import("@/pages/dashboard"));
const LazyDeploy = lazy(() => import("@/pages/deploy"));
const LazyDistribution = lazy(() => import("@/pages/distribution"));
const LazyAPIManagement = lazy(() => import("@/pages/api-management"));

const AuthProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;

  return <>{children}</>;
};

function Router() {
  return (
    <Routes>
      <Route path="/users" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyUsers/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="/token-operations" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyTokenOperations/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="/" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyDashboard/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="/deploy" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyDeploy/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="/distribution" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyDistribution/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="/api-management" element={
        <AuthProtectedRoute>
          <React.Suspense fallback={<div>Loading...</div>}>
            <LazyAPIManagement/>
          </React.Suspense>
        </AuthProtectedRoute>
      }/>
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
}

function App() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <MainLayout>
              <Router />
            </MainLayout>
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
