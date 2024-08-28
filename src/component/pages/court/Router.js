import React from "react";
import { Routes, Route } from "react-router-dom";
import AwaitingJudgment from "./AwaitingJudgment";
import Adjudge from "./Adjudge";
import ReportCourt from "./ReportCourt";

export default function Router() {
  return (
    <Routes>
      <Route path="/awaiting-judgment" element={<AwaitingJudgment />}></Route>
      <Route path="/adjudge" element={<Adjudge />}></Route>
      <Route path="/report-court" element={<ReportCourt />}></Route>
    </Routes>
  );
}
