import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router";


// Page imports
import Home from "./pages/Home";
import ElectionsPage from "./pages/ElectionsPage";
import VotePage from "./pages/VotePage";
import BatchPage from "./pages/BatchPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminSignup from "./pages/AdminSignup";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ResultsPage from "./pages/ResultsPage";
import AdminResults from "./pages/AdminResults";

// Component imports
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // 👈 Layout is now root
    children: [
      {
        index: true, // "/"
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "elections",
        element: (
          <ProtectedRoute>
            <ElectionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "vote/:electionId",
        element: (
          <ProtectedRoute>
            <VotePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/login",

        element: <AdminLogin />,
      },

      {
        path: "admin/signup",

        element: <AdminSignup />,
      },
      {
        path: "admin",

        element: (
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        ),
      },
      {
        path: "batches",
        element: <BatchPage />,
      },
      {
        path: "results/:electionId",

        element: <ResultsPage />,
      },
      {
        path: "admin/results/:electionId",

        element: (
          <AdminRoute>
            <AdminResults />
          </AdminRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
