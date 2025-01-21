import React from "react";

import { Routes, Route } from "react-router-dom";
import CreateTerminateContract from "./CreateTerminateContract";
import ReplyTerminateContract from "./ReplyTerminateContract";
import ImportTerminateContractEms from "./ImportTerminateContractEms";

export default function Router() {
  return (
    <Routes>
      <Route
        path="/create-terminate-Contract"
        element={<CreateTerminateContract />}
      ></Route>
      <Route
        path="/import-terminate-Contract-ems"
        element={<ImportTerminateContractEms />}
      ></Route>
      <Route
        path="/reply-terminate-Contract"
        element={<ReplyTerminateContract />}
      ></Route>
    </Routes>
  );
}
