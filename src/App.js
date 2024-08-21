import React from "react";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { HashRouter, useLocation } from "react-router-dom";
import SignIn from "./component/pages/SignIn";
import Main from "./component/ui/Main";

function App() {
  const token = true;

  if (!token) {
    return (
      <>
        <SignIn />
      </>
    );
  } else {
    return (
      <>
        <HashRouter>
          <Main />
        </HashRouter>
      </>
    );
  }
}

export default App;
