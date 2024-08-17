import React from "react";

import { Routes, Route } from "react-router-dom";
import Disbursement from "./Disbursement";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Disbursement />}></Route>
    </Routes>
  );
}
