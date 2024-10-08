import React from "react";
import { Routes, Route } from "react-router-dom";
import CommissionLaw from "./CommissionLaw";
import CommissionInvestigate from "./CommissionInvestigate";

export default function Router() {
  return (
    <Routes>
      <Route
        path="commission/commission-law"
        element={<CommissionLaw />}
      ></Route>
      <Route
        path="commission/commission-investigate"
        element={<CommissionInvestigate />}
      ></Route>
    </Routes>
  );
}
