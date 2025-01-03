import React from "react";
import { Routes, Route } from "react-router-dom";
import ChargerIndict from "./ChargeIndict";

export default function Router() {
  return (
    <Routes>
      <Route
        path="chargeCourt/charge-indict"
        element={<ChargerIndict />}
      ></Route>
    </Routes>
  );
}
