import React, { useState } from "react";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Form,
  Input,
  Modal,
  Spin,
} from "antd";
import logo from "../assets/images/logo.png";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { addUser } from "../redux/User";
// import { addToken } from "../redux/User";
import "../css/Media.css";

// function onChange(checked) {
//   console.log(`switch to ${checked}`);
// }

const { Title } = Typography;
const { Footer, Content } = Layout;

export default function SignIn() {
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const error = () => {
    Modal.error({
      title: "Error",
      content: "ล็อคอินไม่สำเร็จ กรุณาตรวจสอบ username และ password",
    });
  };
  const error2 = () => {
    Modal.error({
      title: "Error",
      content: "user นี้ไม่สามารถเข้าสู่ระบบได้ เนื่องจาก user ถูกปิดไปแล้ว",
    });
  };

  const onFinish = async (value) => {
    // const user = value;
    // setLoading(true);
    // await axios
    //   .post(login, user)
    //   .then((res) => {
    //     if (res.data.status === "success") {
    //       dispatch(
    //         addToken(
    //           localStorage.setItem("token", JSON.stringify(res.data.token))
    //         )
    //       );
    //       localStorage.setItem("username", res.data.username);
    //       localStorage.setItem("branch", res.data.branch);
    //       localStorage.setItem("menu", JSON.stringify(res.data.permission));
    //       localStorage.setItem("nickname", res.data?.nickname);
    //       localStorage.setItem("nicknameSalcod", res.data?.nicknameSalcod);
    //       localStorage.setItem("firstname", res.data?.firstname);
    //       localStorage.setItem("lastname", res.data?.lastname);
    //       localStorage.setItem("idSep", res.data?.idSep);
    //       localStorage.setItem("idDepartment", res.data?.idDepartment);
    //       setLoading(false);
    //     } else {
    //       error2();
    //       setLoading(false);
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.response.request.status === 404) {
    //       error();
    //     } else {
    //       error();
    //     }
    //     console.log("err", err);
    //     setLoading(false);
    //   });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Layout
      className="layout-default layout-signin"
      style={{ height: "100vh" }}
    >
      <Content className="signin" justify={"center"}>
        <Row gutter={[24, 0]} justify="center">
          <Row justify={"center"}>
            <Spin spinning={loading} size="large" tip=" Loading... ">
              <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                className="row-col"
              >
                <Row justify={"center"} className="main1">
                  <aside>
                    <div>
                      <Row justify={"center"}>
                        <Col span={24}>
                          <img src={logo} width={"700px"} alt="" />
                        </Col>
                      </Row>
                    </div>
                    <div>
                      <Row justify={"center"}>
                        <Col
                          span={20}
                          style={{ textAlign: "center", width: "80%" }}
                        >
                          <Title
                            className="mb-15"
                            style={{ textAlign: "center", color: "#002766" }}
                          >
                            <b>เข้าสู่ระบบ</b>
                          </Title>
                          <Form.Item
                            style={{ marginBottom: "15px" }}
                            className="username"
                            label={
                              <span
                                style={{
                                  color: "#002766",
                                  fontFamily: "sans - serif",
                                  fontSize: "20px",
                                }}
                              >
                                <b>ชื่อผู้ใช้</b>
                              </span>
                            }
                            name="username"
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกรหัสผู้ใช้งาน",
                              },
                            ]}
                          >
                            <Input placeholder="Username" />
                          </Form.Item>

                          <Form.Item
                            className="username"
                            label={
                              <span
                                style={{
                                  color: "#002766",
                                  fontFamily: "sans - serif",
                                  fontSize: "20px",
                                }}
                              >
                                <b>รหัสผ่าน</b>
                              </span>
                            }
                            name="password"
                            style={{ marginBottom: "15px" }}
                            rules={[
                              {
                                required: true,
                                message: "กรุณากรอกพาสเวิร์ด",
                              },
                            ]}
                          >
                            <Input.Password placeholder="Password" />
                          </Form.Item>
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              style={{ width: "100%" }}
                            >
                              <span
                                style={{
                                  color: "#ffffff",
                                  fontFamily: "sans - serif",
                                  fontSize: "20px",
                                }}
                              >
                                <b>เข้าสู่ระบบ</b>
                              </span>
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </aside>
                </Row>
              </Form>
            </Spin>
          </Row>
        </Row>
      </Content>
      <Footer justify={"center"}>
        <p className="copyright" style={{ color: "#002766" }}>
          <b>Copyright © </b>
          <u>
            <a
              href="https://www.facebook.com/calleasing.kkn"
              style={{ color: "#002766" }}
            >
              <b>One Leasing 2023</b>
            </a>
          </u>
        </p>
      </Footer>
    </Layout>
  );
}
