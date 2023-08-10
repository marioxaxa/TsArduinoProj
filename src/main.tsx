import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Editor from "./pages/Editor.tsx";
import Simulator from "./pages/Simulator.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Simulator />,
  },
  {
    path: "/editor",
    element: <Editor />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
