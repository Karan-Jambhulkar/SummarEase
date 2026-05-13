import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import About from "./pages/About";
import Settings from "./pages/Settings";

import MainLayout from "./layouts/MainLayout";

function App() {

  return (

    <Routes>

      {/* Landing Page */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* Dashboard Layout Pages */}
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <Dashboard />
          </MainLayout>
        }
      />

      <Route
        path="/history"
        element={
          <MainLayout>
            <History />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />

      <Route
        path="/settings"
        element={
          <MainLayout>
            <Settings />
          </MainLayout>
        }
      />

    </Routes>
  );
}

export default App;