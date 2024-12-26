import { message } from "antd";
import { useState } from "react";

const TokenCheck = () => {
  const [hasSignedOut, setHasSignedOut] = useState(false);

  const signOut = () => {
    if (!hasSignedOut) {
      localStorage.removeItem("USER_ID");
      localStorage.removeItem("USERNAME");
      localStorage.removeItem("TNAME");
      localStorage.removeItem("FNAME");
      localStorage.removeItem("LNAME");
      localStorage.removeItem("NNAME");
      localStorage.removeItem("LICENCE_NO_LAWYERS");
      localStorage.removeItem("COMPANY_ID");
      localStorage.removeItem("ROLE_ID");
      localStorage.removeItem("ACTIVE_STATUS");
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("lineStatus");
      localStorage.removeItem("line");
      setHasSignedOut(true);
      message.error("หมดเวลากรุณาเข้าสู่ระบบใหม่");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };
  return [signOut];
};

export default TokenCheck;
