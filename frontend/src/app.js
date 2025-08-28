import React, { useState, useEffect } from "react";
import FarmDashboard from "./components/FarmDashboard";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showSignup, setShowSignup] = useState(false);

  // Load user session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("farm_user");
      const savedToken = localStorage.getItem("farm_token");

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (err) {
      console.error("❌ Failed to parse localStorage:", err);
      localStorage.removeItem("farm_user");
      localStorage.removeItem("farm_token");
    }
  }, []);

  // Handle login success
  const handleLoginSuccess = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);

    localStorage.setItem("farm_user", JSON.stringify(userData));
    localStorage.setItem("farm_token", userToken);

    setShowSignup(false); // ensure we reset to dashboard
  };

  // Handle signup success (auto-login)
  const handleSignupSuccess = (userData, userToken) => {
    handleLoginSuccess(userData, userToken);
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("farm_user");
    localStorage.removeItem("farm_token");
  };

  // Show login/signup if no user
  if (!user) {
    return showSignup ? (
      <SignupPage
        onSignupSuccess={handleSignupSuccess}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  // Show dashboard if user exists
  return <FarmDashboard user={user} token={token} onLogout={handleLogout} />;
}

export default App;
