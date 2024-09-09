import React from "react";

import { Routes, Route } from "react-router-dom";

import Main from "./Main";
import AssignLawyers from "./AssignLawyers";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/aissign-lawyers" element={<AssignLawyers />}></Route>
    </Routes>
  );
}
