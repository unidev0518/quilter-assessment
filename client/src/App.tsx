import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./pages/Dashboard";
import NetlistDetail from "./pages/NetlistDetail";
import UploadNetlist from "./pages/UploadNetlist";
import EditNetlist from "./pages/EditNetlist";

import { AuthProvider } from "./context/AuthContext";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["x-auth-token"] = token;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="container">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/netlists/:id"
                element={
                  <PrivateRoute>
                    <NetlistDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <UploadNetlist />
                  </PrivateRoute>
                }
              />
              <Route
                path="/netlists/:id/edit"
                element={
                  <PrivateRoute>
                    <EditNetlist />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {

        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        return <Navigate to="/login" />;
      }

      return <>{children}</>;
    } catch (err) {

      localStorage.removeItem("token");
      delete axios.defaults.headers.common["x-auth-token"];
      return <Navigate to="/login" />;
    }
  }

  return <Navigate to="/login" />;
};

export default App;
