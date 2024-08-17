import React from "react";

import { Routes, Route } from "react-router-dom";
import Main from "./Main";
import SecondPage from "./SecondPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
      <Route path="/secondpage" element={<SecondPage />}></Route>
    </Routes>
  );
}
