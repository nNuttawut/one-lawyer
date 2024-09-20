import React from "react";

import { Routes, Route } from "react-router-dom";
import MainEnforcement from "./MainEnforcement";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainEnforcement />}></Route>
    </Routes>
  );
}
