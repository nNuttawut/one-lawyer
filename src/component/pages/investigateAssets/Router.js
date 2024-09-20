import React from "react";

import { Routes, Route } from "react-router-dom";

import Main from "./MainInvestigateAssets";
import InvestigateAssetsBefore from "./InvestigateAssetsBefore";
import InvestigateAssetsAfter from "./InvestigateAssetsAfter";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route
        path="investigateAssets/investigateAssets-before"
        element={<InvestigateAssetsBefore />}
      ></Route>
      <Route
        path="investigateAssets/investigateAssets-after"
        element={<InvestigateAssetsAfter />}
      ></Route>
    </Routes>
  );
}
