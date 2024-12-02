import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./utils/supabase"; // Import your Supabase client
import { useEffect, useState } from "react";
import MainPage from "./pages/MainPage";
import Register from "./pages/Register";
import Login from "./pages/Login";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an authenticated user session
  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setUser(session.user);
      }
      setLoading(false); // Stop loading once session is checked
    };

    fetchSession();
  }, []);

  // Protect routes based on authentication
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="text-center">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
