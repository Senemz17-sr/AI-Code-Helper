import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import PremiumLandingPage from "@/pages/PremiumLandingPage";
import AIHelperPage from "@/pages/AIHelperPage";
import DashboardV2 from "@/pages/DashboardV2";
import HistoryPage from "@/pages/HistoryPage";
import CoursesPageV2 from "@/pages/CoursesPageV2";
import CourseDetailPageV2 from "@/pages/CourseDetailPageV2";
import LessonPageV2 from "@/pages/LessonPageV2";
import AuthPage from "@/pages/AuthPage";
import UserProfilePage from "@/pages/UserProfilePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const NavbarWrapper = () => {
  const { pathname } = useLocation();
  // Hide global Navbar on landing page since it has its own PremiumNavbar
  if (pathname === "/") return null;
  return <Navbar />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AIProvider>
          <SubscriptionProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <NavbarWrapper />
              <Routes>
                {/* Landing Page */}
                <Route path="/" element={<PremiumLandingPage />} />
                
                {/* Auth */}
                <Route path="/auth" element={<AuthPage />} />
                
                {/* AI Code Helper */}
                <Route
                  path="/helper"
                  element={
                    <ProtectedRoute>
                      <AIHelperPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Legacy Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <HistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses"
                  element={
                    <ProtectedRoute allowGuest>
                      <CoursesPageV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/course/:courseId"
                  element={
                    <ProtectedRoute allowGuest>
                      <CourseDetailPageV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/lesson/:lessonId"
                  element={
                    <ProtectedRoute allowGuest>
                      <LessonPageV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <UserProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/leaderboard"
                  element={
                    <ProtectedRoute>
                      <LeaderboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SubscriptionProvider>
        </AIProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
