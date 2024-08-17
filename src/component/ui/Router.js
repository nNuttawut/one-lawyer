import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardRoute from "../pages/dashboard/Router";

export default function Router() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<DashboardRoute />} />
    </Routes>
  );
}
