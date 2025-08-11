import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import StudentEdit from "./pages/StudentEdit";
import StudentAssignBulk from "./pages/StudentAssignBulk";
import Attendance from "./pages/Attendance";
import AttendanceMark from "./pages/AttendanceMark";
import AttendanceView from "./pages/AttendanceView";

const queryClient = new QueryClient();

const isAuthed = () => {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return false;
    const { loggedIn } = JSON.parse(raw);
    return Boolean(loggedIn);
  } catch {
    return false;
  }
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  return isAuthed() ? children : <Navigate to="/login" replace />;
};

const HomeRedirect = () => (
  isAuthed() ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/batches" element={<RequireAuth><Batches /></RequireAuth>} />
            <Route path="/batches/edit" element={<RequireAuth><BatchEdit /></RequireAuth>} />
            <Route path="/students" element={<RequireAuth><Students /></RequireAuth>} />
            <Route path="/students/create" element={<RequireAuth><StudentCreate /></RequireAuth>} />
            <Route path="/students/assign" element={<RequireAuth><StudentAssign /></RequireAuth>} />
            <Route path="/students/edit" element={<RequireAuth><StudentEdit /></RequireAuth>} />
            <Route path="/students/assign-bulk" element={<RequireAuth><StudentAssignBulk /></RequireAuth>} />

            <Route path="/attendance" element={<RequireAuth><Attendance /></RequireAuth>} />
            <Route path="/attendance/mark" element={<RequireAuth><AttendanceMark /></RequireAuth>} />
            <Route path="/attendance/view" element={<RequireAuth><AttendanceView /></RequireAuth>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
