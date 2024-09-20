import React from "react";

import { Routes, Route } from "react-router-dom";
import Main from "./MainSaleAnnouncement";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Main />}></Route>
    </Routes>
  );
}
