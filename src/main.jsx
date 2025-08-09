// Import React's StrictMode to highlight potential problems in the application during development
import { StrictMode } from "react";

// Import createRoot from React DOM to enable concurrent rendering
import { createRoot } from "react-dom/client";

// Import global styles
import "./index.css";

// Import the main App component
import App from "./App.jsx";

// Import AuthProvider (Context Provider) to manage authentication state across the app
import { AuthProvider } from "./context/AuthContext.jsx";

// Create the root element for rendering the React app and wrap it inside StrictMode for best practices
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire app with AuthProvider so all child components can access authentication context */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
