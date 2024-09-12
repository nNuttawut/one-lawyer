import React from "react";

import { Routes, Route } from "react-router-dom";
import MainNotice from "./MainNotice";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<MainNotice />}></Route>
    </Routes>
  );
}
