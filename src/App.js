import React from "react";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { HashRouter } from "react-router-dom";
import SignIn from "./component/pages/SignIn";
import Main from "./component/ui/Main";

//redux setup
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./redux/reducers/index";
const store = createStore(rootReducer);

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
