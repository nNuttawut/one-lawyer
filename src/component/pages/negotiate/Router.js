import React from "react";

import { Routes, Route } from "react-router-dom";
import Main from "./MainNegotiate";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
    </Routes>
  );
}
