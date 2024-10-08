import React from "react";

import { Routes, Route } from "react-router-dom";
import Main from "./MainFinalCase";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
    </Routes>
  );
}
