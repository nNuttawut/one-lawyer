import React from "react";

import { Routes, Route } from "react-router-dom";
import ReadText from "./ReadText";
import Test from "./Test";

export default function Router() {
  return (
    <Routes>
      <Route path="/read-text" element={<ReadText />}></Route>
      <Route path="/test" element={<Test />}></Route>
    </Routes>
  );
}
