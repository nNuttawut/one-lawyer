import React from "react";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { HashRouter } from "react-router-dom";
import Main from "./component/ui/Main";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";

//redux setup
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers/index";
import LogIn from "./component/pages/LogIn";
import Loginline from "./component/pages/lineLogIn/LoginLine";
import Liff from "./component/pages/lineLogIn/Liff";
const store = createStore(rootReducer);
const TOKEN = localStorage.getItem("TOKEN");
const lineStatus = localStorage.getItem("lineStatus");
const line = localStorage.getItem("line");

function App() {
  const token = TOKEN;

  if (!token) {
    return (
      <>
        <Provider store={store}>
          <Router>
            <LogIn />
          </Router>
        </Provider>
      </>
    );
  } else {
    // console.log("lineStatus", lineStatus);
    // console.log("line", line);
    // if (line !== "null" || lineStatus === "false") {
    //   console.log("lineStatus false", lineStatus);
    //   return (
    //     <>
    //       <Provider store={store}>
    //         <HashRouter>
    //           <Main />
    //         </HashRouter>
    //       </Provider>
    //     </>
    //   );
    // } else {
    //   console.log("lineStatus true", lineStatus);
    //   ReactDOM.render(
    //     <Provider store={store}>
    //       <Router>
    //         <Routes>
    //           <Route path="/" element={<Loginline />} /> {/* หน้าหลัก */}
    //           <Route path="#/liff" element={<Liff />} /> {/* หน้าหลัก */}
    //         </Routes>
    //       </Router>
    //     </Provider>,
    //     document.getElementById("root")
    //   );
    // }

    // if (line !== "null" || lineStatus === "false") {
    //   console.log("lineStatus false", lineStatus);
    return (
      <>
        <Provider store={store}>
          <Router>
            <Main />
          </Router>
        </Provider>
      </>
    );
  }
}

export default App;
