import React from "react";

import { Routes, Route } from "react-router-dom";
import SendToEnfocement from "./SendToEnfocement";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<SendToEnfocement />}></Route>
    </Routes>
  );
}
