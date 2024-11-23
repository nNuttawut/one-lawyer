import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "antd";
import liff from "@line/liff";
export default function Liff() {
  const [idToken, setIdToken] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const line = localStorage.getItem("line");

  useEffect(() => {
    initLine();
  }, []);

  const logout = () => {
    liff.logout();
    // liff.closeWindow();
    window.location.reload();
  };

  const initLine = () => {
    console.log("lineqq", line);

    if (line === "null") {
      console.log(" if (line === null) -->");

      liff.init(
        { liffId: "2006563000-BQzAEq8R", withLoginOnExternalBrowser: true },
        () => {
          if (liff.isLoggedIn()) {
            runApp();
          } else {
            liff.login();
          }
        },
        (err) => console.error(err)
      );
    } else {
      console.log("out --->");
      navigate("/");
    }
  };

  const runApp = () => {
    const idToken = liff.getIDToken();
    setIdToken(idToken);
    liff
      .getProfile()
      .then((profile) => {
        console.log(profile);
        localStorage.setItem("useridLine", profile.userId);
        localStorage.setItem("line", profile.userId);
        setDisplayName(profile.displayName);
        console.log("profile.displayName", profile.displayName);
        localStorage.setItem("userNameLine", profile.displayName);
        setStatusMessage(profile.statusMessage);
        console.log("profile.statusMessage", profile.statusMessage);

        setUserId(profile.userId);
        console.log("profile.userId", profile.userId);

        //  liff.closeWindow();
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  const closeLIFF = () => {
    liff.closeWindow();
  };

  return <></>;
}
