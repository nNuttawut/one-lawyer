import React from "react";
import Layout from "./ui/component/main/Layout";
import SignIn from "./pages/SignIn";

function App() {
  const token = false;

  if (!token) {
    return (
      <>
        <SignIn />
      </>
    );
  }
  return (
    <>
      <Layout />
    </>
  );
}

export default App;
