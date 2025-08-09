import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ChefDashboard from "./pages/ChefDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import UserDashboard from "./pages/UserDashboard";
import UnauthorizedPage from "./pages/UnauthorizedPage";

function App() {
  return (
    <AuthRoutes />
  );
}

function AuthRoutes() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<LoginPage />} />

        {/* Unauthorized Page */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Role-based Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute allowedRoles={["MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRoles={["CHEF"]}>
              <ChefDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={["USER"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
