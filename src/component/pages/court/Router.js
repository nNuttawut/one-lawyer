import React from "react";
import { Routes, Route } from "react-router-dom";
import AwaitingJudgment from "./AwaitingJudgment";
import Adjudge from "./Adjudge";
import ReportCourt from "./ReportCourt";
import Judgement from "./Judgement";

export default function Router() {
  return (
    <Routes>
      <Route
        path="court/awaiting-judgment"
        element={<AwaitingJudgment />}
      ></Route>
      <Route path="court/case-is-final" element={<Adjudge />}></Route>
      <Route path="court/judgement" element={<Judgement />}></Route>
      <Route path="court/report-court" element={<ReportCourt />}></Route>
    </Routes>
  );
}
