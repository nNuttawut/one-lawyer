import React, { useState } from "react";
import axios from "axios";
import { Input } from "antd";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("USERNAME");

  //   const handleFileChange = (e) => {
  //     setFile(e.target.files[0]);
  //   };

  //   const uploadFile = async () => {
  //     if (!file) {
  //       setMessage("กรุณาเลือกไฟล์");
  //       return;
  //     }

  //     const user = "oneYut";
  //     const pass = "kbMu2+DZ";

  //     try {
  //       // ขั้นตอนการเข้าสู่ระบบ
  //       const loginResponse = await axios.get(
  //         `https://192-168-100-139.one-lawyer.direct.quickconnect.to:5001/webapi/entry.cgi?api=SYNO.API.Auth&version=6&method=login&account=${user}&passwd=${pass}&enable_syno_token=yes`,
  //         {
  //           headers: {
  //             "Access-Control-Allow-Origin": "*",
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       console.log("loginResponse---->", loginResponse);

  //       const sid = loginResponse.data.success
  //         ? loginResponse.data.data.sid
  //         : null;

  //       if (!sid) {
  //         setMessage("เข้าสู่ระบบล้มเหลว");
  //         return;
  //       }

  //       // ขั้นตอนการอัปโหลดไฟล์
  //       const formData = new FormData();
  //       formData.append("api", "SYNO.FileStation.Upload");
  //       formData.append("method", "upload");
  //       formData.append("version", "2");
  //       formData.append("folder_path", "/volume1/upload/photo"); // เปลี่ยนเป็นพาธที่ต้องการเก็บไฟล์
  //       formData.append("create_parents", "true");
  //       formData.append("sid", sid);
  //       formData.append("file", file);

  //       const uploadResponse = await axios.post(
  //         "https://192-168-100-139.one-lawyer.direct.quickconnect.to:5001/webapi/Upload.cgi",
  //         formData,
  //         {
  //           headers: {
  //             "Content-Type": "multipart/form-data",
  //           },
  //         }
  //       );

  //       console.log("formData---->", formData);

  //       if (uploadResponse.data.success) {
  //         setMessage("อัปโหลดสำเร็จ");
  //       } else {
  //         setMessage("อัปโหลดล้มเหลว: " + uploadResponse.data.error);
  //       }

  //       // ขั้นตอนการออกจากระบบ
  //       await axios.get(
  //         `https://192-168-100-139.one-lawyer.direct.quickconnect.to:5001/webapi/auth.cgi?api=SYNO.API.Auth&method=logout&version=1&sid=${sid}`
  //       );
  //     } catch (error) {
  //       setMessage("เกิดข้อผิดพลาด: " + error.message);
  //     }
  //   };

  // if (username === "administrator") {
  //   return (
  //     <div>
  //       <input type="file" onChange={handleFileChange} />
  //       <button onClick={uploadFile}>อัปโหลด</button>
  //       {message && <p>{message}</p>}
  //     </div>
  //   );
  // } else {
  //   return <b>ไม่มีสิทธ์เข้าถึงข้อมูล</b>;
  // }

  const [barCode, setBarCode] = useState("");

  // Handle keyup event or change event (when value changes)
  const handleInputChange = (event) => {
    setBarCode(event.target.value);
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      alert(`Barcode Scanned: ${barCode}`);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Scan barcode"
        name="barCode"
        id="barCode"
        value={barCode}
        onChange={handleInputChange} // To update state with input value
        onKeyUp={handleKeyUp} // Optional: if you want to do something when Enter is pressed
      />
    </div>
  );
};

export default FileUpload;
