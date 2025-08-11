import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Batches from "./pages/Batches";
import BatchEdit from "./pages/BatchEdit";
import Students from "./pages/Students";
import StudentCreate from "./pages/StudentCreate";
import StudentAssign from "./pages/StudentAssign";
import Attendance from "./pages/Attendance";
import AttendanceMark from "./pages/AttendanceMark";
import AttendanceView from "./pages/AttendanceView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
<Route path="/" element={<Index />} />
<Route path="/login" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/batches" element={<Batches />} />
<Route path="/batches/edit" element={<BatchEdit />} />
<Route path="/students" element={<Students />} />
<Route path="/students/create" element={<StudentCreate />} />
<Route path="/students/assign" element={<StudentAssign />} />
{/* Attendance routes */}
<Route path="/attendance" element={<Attendance />} />
<Route path="/attendance/mark" element={<AttendanceMark />} />
<Route path="/attendance/view" element={<AttendanceView />} />
{/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
<Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
