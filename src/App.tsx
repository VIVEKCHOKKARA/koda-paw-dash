import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import PetMarketplace from "./pages/PetMarketplace.tsx";
import HealthMonitor from "./pages/HealthMonitor.tsx";
import VetAppointments from "./pages/VetAppointments.tsx";
import PetFood from "./pages/PetFood.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/marketplace" element={<PetMarketplace />} />
          <Route path="/health" element={<HealthMonitor />} />
          <Route path="/vet" element={<VetAppointments />} />
          <Route path="/food" element={<PetFood />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
