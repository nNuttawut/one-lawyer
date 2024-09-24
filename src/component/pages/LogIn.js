import React, { useState } from "react";
import { Button, Row, Col, Form, Input, Card, Checkbox, message } from "antd";
import { Container, useMediaQuery } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import logo from "../../assets/images/logoLogin.png";
import axios from "axios";
import { baseUrl, LOG_IN, HEADERS_EXPORT } from "../API/apiUrls";

export default function LogIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("md"));
  const [openOTPModal, setOpenOTPModal] = useState(false);
  const [otpToken, setOtpToken] = useState({});
  const [serverToken, setServerToken] = useState("");
  const [onFailure, setOnFailure] = useState(false);
  const [loading, setLoading] = useState(false);

  const postLogin = async (postData) => {
    setLoading(true);
    try {
      await axios
        .post(baseUrl + LOG_IN, postData, {
          HEADERS_EXPORT,
        })
        .then(async (res) => {
          if (res.status === 200) {
            console.log("resQuery", res);
            localStorage.setItem("USER_ID", res.data?.id);
            localStorage.setItem("USERNAME", res.data?.USERNAME);
            localStorage.setItem("TNAME", res.data?.TNAME);
            localStorage.setItem("FNAME", res.data?.FNAME);
            localStorage.setItem("LNAME", res.data?.LNAME);
            localStorage.setItem("NNAME", res.data?.NNAME);
            localStorage.setItem("LICENCE_NO_LAWYERS", res.data?.LICENCE_NO);
            localStorage.setItem("COMPANY_ID", res.data?.COMPANY_ID);
            localStorage.setItem("ROLE_ID", res.data?.ROLE_ID);
            localStorage.setItem("ACTIVE_STATUS", res.data?.ACTIVE_STATUS);
            localStorage.setItem("TOKEN", JSON.stringify(res.data.token));
            message.success("เช้าสู่ระบบสำเร็จ");
            handleNavigate();
          } else {
            message.error("ข้อมูลไม่ถูกต้อง");
            console.log("ข้อมูลไม่ถูกต้อง");
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          message.error("ข้อมูลไม่ถูกต้อง");
        });
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
      // handleCancel();
    }
  };

  const onFinish = (values) => {
    console.log(values);
    const postData = {
      username: values.userName,
      password: values.password,
      remember: values.remember,
    };
    postLogin(postData);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onClickForgetPassword = () => {
    message.info("รบกวนติดต่อไอทีเพื่อขอเปลี่ยนรหัสผ่าน");
  };

  const handleNavigate = () => {
    navigate("/dashboard");
    window.location.reload();
  };

  return (
    <>
      <Container className="signin">
        <Row gutter={[24, 0]} justify="space-around">
          <Col
            style={{
              // padding: 12,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            {" "}
            <img width={"100%"} src={logo} alt="Logo" />
          </Col>
          <Col>
            <Card
              title={<h4>เข้าสู่ระบบ</h4>}
              bordered="false"
              style={{ marginTop: "50px" }}
            >
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Form.Item
                  label="user name"
                  name="userName"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอก id ผู้ใช้งาน!",
                    },
                  ]}
                >
                  <Input placeholder="กรุณากรอก user name" />
                </Form.Item>
                <Form.Item
                  label="password"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "กรุณากรอก password!",
                    },
                  ]}
                >
                  <Input.Password placeholder="กรุณากรอก password" />
                </Form.Item>
                <Link onClick={onClickForgetPassword}>ลืมรหัสผ่าน</Link>
                <Form.Item
                  name="remember"
                  className="aligin-center"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Checkbox>จดจำฉัน</Checkbox>
                </Form.Item>

                <Form.Item>
                  <Button
                    loading={loading}
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                  >
                    เข้าสู่ระบบ
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
        <div
          style={{
            marginTop: 50,
            justifyContent: "center",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <p className="copyright">
            {" "}
            Copyright © 2024 by{" "}
            <a href="https://www.facebook.com/calleasing.kkn/">
              {" "}
              ONE LEASING.CO.,LTD
            </a>
            .{" "}
          </p>
        </div>
      </Container>
    </>
  );
}
