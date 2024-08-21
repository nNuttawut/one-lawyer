import React from "react";

import { Routes, Route } from "react-router-dom";
import Debtor from "./Debtor";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Debtor />}></Route>
    </Routes>
  );
}
