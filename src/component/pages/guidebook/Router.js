import React from "react";

import { Routes, Route } from "react-router-dom";
import ReadText from "./ReadText";

export default function Router() {
  return (
    <Routes>
      <Route path="/read-text" element={<ReadText />}></Route>
    </Routes>
  );
}
