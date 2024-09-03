import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./CalendarMain";

const Router = () => {
  return (
    <Routes>
      <Route path="/calendar" element={<Main />}></Route>
    </Routes>
  );
};

export default Router;
