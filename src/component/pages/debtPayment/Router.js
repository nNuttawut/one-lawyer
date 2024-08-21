import React from "react";

import { Routes, Route } from "react-router-dom";
import DebtPayment from "./DebtPayment";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<DebtPayment />}></Route>
    </Routes>
  );
}
