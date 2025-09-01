import { useEffect, useState } from "react";
import { api } from "./lib/api";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [health, setHealth] = useState<string>("checking...");

  useEffect(() => {
    api("/health", { method: "GET" })
      .then((data) => setHealth(`ok: ${String(data?.ok)}`))
      .catch((err) => setHealth(`error: ${err.message}`));
  }, []);

  return (
    <>
      <Router>
        <AnimatedRoutes />
      </Router>

      <Toaster position="top-right" />

      <div
        style={{
          position: "fixed",
          bottom: 8,
          right: 8,
          background: "#f0f0f0",
          padding: "4px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          color: "#333",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
          opacity: 0.8,
        }}
      >
        Health: {health}
      </div>
    </>
  );
}

export default App;
