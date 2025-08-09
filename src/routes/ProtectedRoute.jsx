// Import React hooks and components
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  // Get the logged-in user and loading state from AuthContext
  const { user, loading } = useContext(AuthContext);

  // While authentication state is loading, show a loading indicator
  if (loading) return <div>Loading...</div>;

  // If no user is logged in, redirect to the login page
  if (!user) return <Navigate to="/login" replace />;

  // If allowedRoles is provided and the user's role is not in the list, redirect to unauthorized page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authenticated and has the correct role, render the child components
  return children;
}
