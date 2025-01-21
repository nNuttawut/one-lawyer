import React from "react";

import { Routes, Route } from "react-router-dom";
import Lawsuit from "./MainPreLawsuitFiled";
import LawsuitAdvanePayment from "./LawsuitAdvanePayment";
import LawsuitClearAdvanePayment from "./LawsuitClearAdvanePayment";

export default function Router() {
  return (
    <Routes>
      <Route path="lawsuit/pre-lawsuit-filed" element={<Lawsuit />}></Route>
      <Route
        path="lawsuit/advane-payment"
        element={<LawsuitAdvanePayment />}
      ></Route>
      <Route
        path="lawsuit/clear-advane-payment"
        element={<LawsuitClearAdvanePayment />}
      ></Route>
    </Routes>
  );
}
