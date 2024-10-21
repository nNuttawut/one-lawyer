import React, { useEffect, useState } from "react";
import MotionHoc from "../../../utils/MotionHoc";
import { Carousel, Image } from "antd";
import step1 from "../../../assets/images/step1.png";
import step2 from "../../../assets/images/step2.png";
import step3 from "../../../assets/images/step3.png";
import step4 from "../../../assets/images/step4.png";
import step5 from "../../../assets/images/step5.png";
import step6 from "../../../assets/images/step6.png";
import step7 from "../../../assets/images/step7.png";
import step8 from "../../../assets/images/step8.png";
import step9 from "../../../assets/images/step9.png";
import step10 from "../../../assets/images/step10.png";

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
          1. ค้นหาโปรแกรม Sniping Tool
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          2. start menu จะโชว์โปรแกรม
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          3. ตัวอย่างโปรแกรม Sniping Tool
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          4. เปิดไฟล์ PDF เพื่อนำมาตัดในส่วนที่ต้องการ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          5. เลือก "New" คลิกในส่วนที่ต้องการและลากครอบให้ครบ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>6. แสดงส่วนที่ถูกตัด</p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          7. เลือก "Save As" เพื่อบันทึกรูป
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          8. เลือก Folder ที่ต้องการจะเก็บ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          9. พิมพ์ชื่อที่ต้องการเพื่อง่ายต่อการค้นหา
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          10. กด "Save" เพื่อบันทึกรูปภาพ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          11. เปิดโปรแกรม google chrome และกดเลือกที่ไอคอมที่อยู่ในกรอบสีแดง
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          12. คลิก "อัพโหลดไฟล์ "หรือลากรูปมาวาง
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          13. เลือกไฟล์ที่ต้องการ (กรณีคลิกอัพโหลด)
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          14. กด "open" (กรณีคลิกอัพโหลด)
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>15. คลิกที่ "ข้อความ"</p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          16. คลิก "เลือกข้อความทั้งหมด"
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          17. แสดงตัวอย่างข้อความที่ถูกนำไปประมวณผล
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          18. คลิก "คัดลอกข้อความ" และนำไปวางที่ ๆ ต้องการ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          18. คลิก "คัดลอกข้อความ" และนำไปวางที่ ๆ ต้องการ
        </p>
        <p style={{ fontSize: "20px", color: "blue" }}>
          19. ตรวจสอบข้อความ เพราะข้อความอาจจะแปลงไม่ถูกทั้งหมด
        </p>
      </div>
    );
  };

  return (
    <>
      {/* autoplay={true} */}
      <Carousel arrows infinite={false}>
        <div>
          <h3 style={contentStyle}>
            <div>
              <Image
                src={step1}
                alt="step1"
                style={{ width: "70%", height: "auto", marginLeft: "15%" }}
              />
            </div>
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step2}
              alt="step2"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step3}
              alt="step3"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step4}
              alt="step4"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step5}
              alt="step5"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step6}
              alt="step6"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step7}
              alt="step7"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step8}
              alt="step8"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step9}
              alt="step9"
              style={{ width: "60%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
        <div>
          <h3 style={contentStyle}>
            <Image
              src={step10}
              alt="step10"
              style={{ width: "50%", height: "auto", marginLeft: "20%" }}
            />
          </h3>
        </div>
      </Carousel>
      {textStep1()}
    </>
  );
};
const ReadText = MotionHoc(Main);

export default ReadText;
