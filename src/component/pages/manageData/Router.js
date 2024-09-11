import React from "react";

import { Routes, Route } from "react-router-dom";

import AssignLawyers from "./AssignLawyers";
import ImportData from "./ImportData";
import ChangeLawyersJob from "./ChangeLawyersJob";

export default function Router() {
  return (
    <Routes>
      <Route path="/import-data" element={<ImportData />}></Route>
      <Route path="/aissign-lawyers" element={<AssignLawyers />}></Route>
      <Route path="/change-lawyers-jobs" element={<ChangeLawyersJob />}></Route>
    </Routes>
  );
}
