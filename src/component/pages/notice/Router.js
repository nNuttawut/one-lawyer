import React from "react";

import { Routes, Route } from "react-router-dom";
import MainNotice from "./MainNotice";
import ReplyNotice from "./ReplyNotice";

export default function Router() {
  return (
    <Routes>
      <Route path="/create-notice" element={<MainNotice />}></Route>
      <Route path="/reply-notice" element={<ReplyNotice />}></Route>
    </Routes>
  );
}
