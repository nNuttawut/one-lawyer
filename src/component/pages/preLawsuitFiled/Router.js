import React from "react";

import { Routes, Route } from "react-router-dom";
import PreLawsuitFiled from "./PreLawsuitFiled";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<PreLawsuitFiled />}></Route>
    </Routes>
  );
}
