import React from "react";

import { Routes, Route } from "react-router-dom";

import LoginLine from "./LoginLine";
import Liff from "./Liff";

export default function Router() {
  return (
    <Routes>
      <Route path="/login-line" element={<LoginLine />}></Route>
      <Route path="/liff" element={<Liff />}></Route>
    </Routes>
  );
}
