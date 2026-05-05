import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router";

// Page imports
import Home from "./pages/Home";
import VotePage from "./pages/VotePage";
import Layout from "./components/Layout";
import BatchPage from "./pages/BatchPage";

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
        path: "vote-page",
        element: <VotePage />,
      },
      {
        path: "batches",
        element: <BatchPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
