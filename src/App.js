import React from "react";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { HashRouter } from "react-router-dom";
import Main from "./component/ui/Main";

//redux setup
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers/index";
import LogIn from "./component/pages/LogIn";
const store = createStore(rootReducer);
const TOKEN = localStorage.getItem("TOKEN");

function App() {
  const token = TOKEN;
  if (!token) {
    return (
      <>
        <Provider store={store}>
          <HashRouter>
            <LogIn />
          </HashRouter>
        </Provider>
      </>
    );
  } else {
    return (
      <>
        <Provider store={store}>
          <HashRouter>
            <Main />
          </HashRouter>
        </Provider>
      </>
    );
  }
}

export default App;
