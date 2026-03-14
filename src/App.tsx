import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Progress from "./pages/Progress";
import Groups from "./pages/Groups";
import Profile from "./pages/Profile";
import ProfileSettings from "./pages/ProfileSettings";
import NotFound from "./pages/NotFound";
import Thesis from "./pages/Thesis";
import UseCaseDiagram from "./pages/UseCaseDiagram";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings/personal" element={<ProfileSettings view="personal" />} />
              <Route path="/settings/macros" element={<ProfileSettings view="macros" />} />
              <Route path="/settings/goal" element={<ProfileSettings view="goal" />} />
              <Route path="/settings/weight-history" element={<ProfileSettings view="weight-history" />} />
              <Route path="/thesis" element={<Thesis />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
