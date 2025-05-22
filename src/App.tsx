
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Import Event Pages
import EventsList from "./pages/Events/EventsList";
import EventsNew from "./pages/Events/EventsNew";
import EventsCancelRequests from "./pages/Events/EventsCancelRequests";
import EventsApprove from "./pages/Events/EventsApprove";

// Import Facility Pages
import RoomRequests from "./pages/Facilities/RoomRequests";
import Rooms from "./pages/Facilities/Rooms";
import RoomChangeRequests from "./pages/Facilities/RoomChangeRequests";

const queryClient = new QueryClient();

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                
                {/* Events Routes */}
                <Route path="/events" element={<EventsList />} />
                <Route path="/events/new" element={<EventsNew />} />
                <Route path="/events/cancel-requests" element={<EventsCancelRequests />} />
                <Route path="/events/approve" element={<EventsApprove />} />
                
                {/* Facilities Routes */}
                <Route path="/facilities/room-requests" element={<RoomRequests />} />
                <Route path="/facilities/rooms" element={<Rooms />} />
                <Route path="/facilities/room-change-requests" element={<RoomChangeRequests />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
