import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index.tsx";
import PetMarketplace from "./pages/PetMarketplace.tsx";
import HealthMonitor from "./pages/HealthMonitor.tsx";
import VetAppointments from "./pages/VetAppointments.tsx";
import PetFood from "./pages/PetFood.tsx";
import Auth from "./pages/Auth.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center koda-gradient">
      <div className="animate-scale-in text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-3">
          <span className="text-primary-foreground font-bold text-lg">K</span>
        </div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<Auth />} />
    <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
    <Route path="/marketplace" element={<ProtectedRoute><PetMarketplace /></ProtectedRoute>} />
    <Route path="/health" element={<ProtectedRoute><HealthMonitor /></ProtectedRoute>} />
    <Route path="/vet" element={<ProtectedRoute><VetAppointments /></ProtectedRoute>} />
    <Route path="/food" element={<ProtectedRoute><PetFood /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
