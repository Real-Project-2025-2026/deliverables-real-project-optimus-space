import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Search from "./pages/Search";
import SpaceDetail from "./pages/SpaceDetail";
import Auth from "./pages/Auth";
import Landlords from "./pages/Landlords";
import HowItWorks from "./pages/HowItWorks";
import TenantDashboard from "./pages/dashboard/TenantDashboard";
import LandlordDashboard from "./pages/dashboard/LandlordDashboard";
import EditSpace from "./pages/dashboard/EditSpace";
import CreateSpace from "./pages/dashboard/CreateSpace";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import ReportVacancy from "./pages/ReportVacancy";
import Impressum from "./pages/legal/Impressum";
import Datenschutz from "./pages/legal/Datenschutz";
import AGB from "./pages/legal/AGB";
import HelpCenter from "./pages/HelpCenter";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { ScrollToTop } from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/search" element={<Search />} />
          <Route path="/space/:id" element={<SpaceDetail />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/landlords" element={<Landlords />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/report-vacancy" element={<ReportVacancy />} />
          <Route path="/dashboard/tenant" element={<TenantDashboard />} />
          <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
          <Route path="/dashboard/landlord/edit-space/:id" element={<EditSpace />} />
          <Route path="/dashboard/landlord/new-space" element={<CreateSpace />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          {/* Legal pages */}
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="/privacy" element={<Datenschutz />} />
          <Route path="/agb" element={<AGB />} />
          <Route path="/terms" element={<AGB />} />
          {/* Support pages */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/about" element={<About />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
