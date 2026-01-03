import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Rampur from "./pages/Rampur";
import UP from "./pages/UP";
import National from "./pages/National";
import Politics from "./pages/Politics";
import Crime from "./pages/Crime";
import EducationJobs from "./pages/EducationJobs";
import Business from "./pages/Business";
import Entertainment from "./pages/Entertainment";
import Sports from "./pages/Sports";
import Health from "./pages/Health";
import ReligionCulture from "./pages/ReligionCulture";
import FoodLifestyle from "./pages/FoodLifestyle";
import Nearby from "./pages/Nearby";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/rampur" element={<Rampur />} />
          <Route path="/up" element={<UP />} />
          <Route path="/national" element={<National />} />
          <Route path="/politics" element={<Politics />} />
          <Route path="/crime" element={<Crime />} />
          <Route path="/education-jobs" element={<EducationJobs />} />
          <Route path="/business" element={<Business />} />
          <Route path="/entertainment" element={<Entertainment />} />
          <Route path="/sports" element={<Sports />} />
          <Route path="/health" element={<Health />} />
          <Route path="/religion-culture" element={<ReligionCulture />} />
          <Route path="/food-lifestyle" element={<FoodLifestyle />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
