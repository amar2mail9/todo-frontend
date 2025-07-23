import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import Home from "./components/page/Home";
import AddMainTodo from "./components/page/AddMainTodo";
import SubTodos from "./components/page/SubTodos";
import Cookies from "js-cookie";

// 🔐 Authentication checker
const isAuthenticated = () => !!Cookies.get("token");

// 🔐 Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// 🔓 Public Route Wrapper (optional: if user already logged in, redirect from login/signup)
const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔐 Private Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <AddMainTodo />
            </PrivateRoute>
          }
        />
        <Route
          path="/:slug"
          element={
            <PrivateRoute>
              <SubTodos />
            </PrivateRoute>
          }
        />

        {/* ⛔ Catch-all route for invalid paths */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
