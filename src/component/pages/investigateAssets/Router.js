import React from "react";

import { Routes, Route } from "react-router-dom";

import EstimateAssets from "./EstimateAssets";
import CreateInvestigateAssets from "./CreateInvestigateAssets";
import AssetsFound from "./AssetsFound";

export default function Router() {
  return (
    <Routes>
      <Route
        path="investigate-assets/create-invitigate-assets"
        element={<CreateInvestigateAssets />}
      ></Route>
      <Route
        path="investigate-assets/estimate-assets"
        element={<EstimateAssets />}
      ></Route>
      <Route
        path="investigate-assets/assets-found"
        element={<AssetsFound />}
      ></Route>
    </Routes>
  );
}
