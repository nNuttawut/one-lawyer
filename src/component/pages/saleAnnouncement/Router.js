import React from "react";

import { Routes, Route } from "react-router-dom";
import SaleAnnoucement from "./SaleAnnoucement";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<SaleAnnoucement />}></Route>
    </Routes>
  );
}
