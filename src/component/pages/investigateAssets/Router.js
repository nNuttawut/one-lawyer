import React from "react";

import { Routes, Route } from "react-router-dom";

import InvestigateAssets from "./InvestigateAssets";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<InvestigateAssets />}></Route>
    </Routes>
  );
}
