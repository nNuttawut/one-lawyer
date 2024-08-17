import React from "react";

import { Routes, Route } from "react-router-dom";
import Report from "./Report";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Report />}></Route>
    </Routes>
  );
}
