import React, { useState } from "react";
import { Button, Row, Col, Form, Modal, Spin, message } from "antd";
import logo from "../../../assets/images/logoLogin.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseUrl, POST_USER, HEADERS_EXPORT } from "../../API/apiUrls";

export default function Loginline() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("USER_ID");
  const username = localStorage.getItem("USERNAME");
  const tName = localStorage.getItem("TNAME");
  const fName = localStorage.getItem("FNAME");
  const lName = localStorage.getItem("LNAME");
  const nName = localStorage.getItem("NNAME");
  const licenceNo = localStorage.getItem("LICENCE_NO_LAWYERS");
  const company = localStorage.getItem("COMPANY_ID");
  const roleId = localStorage.getItem("ROLE_ID");
  const activeStatus = localStorage.getItem("ACTIVE_STATUS");
  const lineId = localStorage.getItem("line");
  const lineName = localStorage.getItem("userNameLine");

  const sendData = async () => {
    console.log("ssssss");

    const dataComfirm = {
      USERNAME: username,
      TNAME: tName,
      FNAME: fName,
      LNAME: lName,
      NNAME: nName,
      LICENCE_NO: licenceNo,
      COMPANY_ID: company,
      ROLE_ID: roleId,
      ACTIVE_STATUS: activeStatus,
      line_uid: lineId ? lineId : false,
      id: userId,
    };
    setLoading(true);
    try {
      await axios
        .post(baseUrl + POST_USER, dataComfirm, { HEADERS_EXPORT })
        .then(async (res) => {
          if (res.status === 201) {
            message.success(`login Line สำเร็จ ${lineName}`);
            setLoading(false);
          } else {
            message.error("ไม่สามารถ login Line ได้");
            console.log("ไม่สามารถ login Line ได้");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.status === 404) {
            message.error("ไม่สามารถส่งข้อมูลได้");
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = (value) => {
    if (value) {
      console.log("value true", value);
      navigate("/liff");
    } else {
      console.log("value false", value);
      console.log("lineId", lineId);

      if (lineId === "null" && userId) {
        console.log("sendData");
        sendData();
      }
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <Row
      style={{
        minHeight: "100vh", // ให้สูงอย่างน้อยเต็มหน้าจอ
        display: "flex", // ใช้ Flexbox
        justifyContent: "center", // จัดให้อยู่ตรงกลางในแนวนอน
        alignItems: "center", // จัดให้อยู่ตรงกลางในแนวตั้ง
      }}
    >
      <Col
        xs={{ span: 24, offset: 0 }}
        lg={{ span: 6, offset: 0 }}
        md={{ span: 12 }}
      >
        <Row>
          <Col xs={2} md={6} lg={4}></Col>
          <Col
            xs={{ span: 20 }}
            lg={{ span: 16 }}
            md={{ span: 12 }}
            style={{ marginBottom: "10%" }}
          >
            <img style={{ width: "100%", height: "100%" }} src={logo} alt="" />
          </Col>

          <Col xs={2} md={6} lg={4}></Col>
        </Row>
        <Spin spinning={loading} size="large" tip=" Loading... ">
          <Form layout="vertical" className="row-col">
            <Form.Item>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => {
                  handleStatus(false);
                }}
              >
                กลับหน้าหลัก
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{ width: "100%" }}
                onClick={() => {
                  handleStatus(true);
                }}
              >
                login Line
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Col>
    </Row>
  );
}
