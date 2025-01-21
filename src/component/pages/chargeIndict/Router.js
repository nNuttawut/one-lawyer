import React from "react";
import { Routes, Route } from "react-router-dom";
import AdvanePay from "./AdvanePay";
import ClearAdvanePay from "./ClearAdvanePay";

export default function Router() {
  return (
    <Routes>
      <Route path="charge-indict/advane-pay" element={<AdvanePay />}></Route>
      <Route
        path="charge-indict/clear-advane-pay"
        element={<ClearAdvanePay />}
      ></Route>
    </Routes>
  );
}
