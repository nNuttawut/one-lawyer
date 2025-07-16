import React from "react";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import Main from "./component/ui/Main";
// import { HashRouter as Router } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";

import LogIn from "./component/pages/userManage/LogIn";
import Loginline from "./component/pages/lineLogIn/LoginLine";
import Liff from "./component/pages/lineLogIn/Liff";
const TOKEN = localStorage.getItem("TOKEN");
const line = localStorage.getItem("line");

function App() {
  const token = TOKEN;

  if (!token) {
    return (
      <Router>
        <LogIn />
      </Router>
    );
  }
  return (
    <>
      <Router>
        <Main />
      </Router>
    </>
  );
}

export default App;
