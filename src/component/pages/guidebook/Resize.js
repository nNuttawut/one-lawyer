import React, { useEffect, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { Carousel, Image } from "antd";

const Main = () => {
  const contentStyle = {
    margin: 0,
    height: "550px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
    display: "flex", // ใช้ Flexbox
    justifyContent: "center", // จัดให้อยู่ตรงกลางในแนวนอน
    alignItems: "center", // จัดให้อยู่ตรงกลางในแนวตั้ง
  };

  const textStep1 = () => {
    return (
      <div style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "20px", color: "blue" }}>
          1. เว็บช่วยลดขนาดไฟล์ แปลงไฟล์ ฯลฯ{" "}
          <a
            href="https://www.ilovepdf.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "blue", textDecoration: "underline" }}
          >
            https://www.ilovepdf.com/
          </a>
        </p>
      </div>
    );
  };

  return (
    <>
      {/* autoplay={true} */}

      {textStep1()}
    </>
  );
};
const ReadText = MotionHoc(Main);

export default ReadText;
