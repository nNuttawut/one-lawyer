import React from "react";

import { Routes, Route } from "react-router-dom";
import MainNotice from "./MainNotice";
import ReplyNotice from "./ReplyNotice";
import CreateScanNoticeMain from "./CreateScanNoticeMain";
import ReplyNoticeEms from "./ReplyNoticeEms";

export default function Router() {
  return (
    <Routes>
      <Route path="/create-notice" element={<MainNotice />}></Route>
      <Route path="/reply-notice" element={<ReplyNotice />}></Route>
      <Route
        path="/create-notice-ems"
        element={<CreateScanNoticeMain />}
      ></Route>
      <Route path="/reply-notice-ems" element={<ReplyNoticeEms />}></Route>
    </Routes>
  );
}
