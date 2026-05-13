import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "sonner";

import { ThemeProvider } from "@/providers/ThemeProvider";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <BrowserRouter>

      <ThemeProvider>

        <App />

        <Toaster richColors />

      </ThemeProvider>

    </BrowserRouter>

  </React.StrictMode>
);