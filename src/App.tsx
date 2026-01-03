import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
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

// Admin pages
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ArticlesList from "@/pages/admin/ArticlesList";
import ArticleEditor from "@/pages/admin/ArticleEditor";
import CategoriesManager from "@/pages/admin/CategoriesManager";
import AuthorsManager from "@/pages/admin/AuthorsManager";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import SettingsPage from "@/pages/admin/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AdminAuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
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
              
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="articles" element={<ArticlesList />} />
                <Route path="articles/:id" element={<ArticleEditor />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="authors" element={<AuthorsManager />} />
                <Route path="media" element={<MediaLibrary />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AdminAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
