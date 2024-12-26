import React from "react";

import { Routes, Route } from "react-router-dom";
import ReportNotice from "./ReportNotice";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<ReportNotice />}></Route>
    </Routes>
  );
}
